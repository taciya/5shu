"""三合命盘知识库 API。用法：在 app.py 中 from sanhe_api import register_sanhe_routes; register_sanhe_routes(app)"""
from flask import request, jsonify
import json, re
from pathlib import Path

PALACE_ALIASES={
 '命宫':'命宫','兄弟':'兄弟宫','兄弟宫':'兄弟宫','夫妻':'夫妻宫','夫妻宫':'夫妻宫','子女':'子女宫','子女宫':'子女宫',
 '财帛':'财帛宫','财帛宫':'财帛宫','疾厄':'疾厄宫','疾厄宫':'疾厄宫','迁移':'迁移宫','迁移宫':'迁移宫',
 '仆役':'交友宫','仆役宫':'交友宫','交友':'交友宫','交友宫':'交友宫','官禄':'官禄宫','官禄宫':'官禄宫',
 '田宅':'田宅宫','田宅宫':'田宅宫','福德':'福德宫','福德宫':'福德宫','父母':'父母宫','父母宫':'父母宫'}

def _norm_palace(s):
    s=re.sub(r'\s','',str(s or '')).removesuffix('宫')
    return PALACE_ALIASES.get(s, PALACE_ALIASES.get(s+'宫', s+'宫' if s else ''))

def _extract_stars(p):
    stars=[]
    for k in ('main_stars','minor_stars','xiaoxing_stars','shensha_stars','changsheng_stars'):
        for s in p.get(k,[]) or []:
            cleaned=re.sub(r'\(.*?\)','',str(s)).strip()
            if cleaned and cleaned not in stars: stars.append(cleaned)
    return stars

def _flatten(record):
    return [(cat,t) for cat,lines in (record.get('categories') or {}).items() for t in lines]

_MAIN_STARS = ['紫微','天机','太阳','武曲','天同','廉贞','天府','太阴','贪狼','巨门','天相','天梁','七杀','破军']
def _normalize_main_stars(values):
    out=[]
    for value in values or []:
        text=re.sub(r'\(.*?\)','',str(value)).strip()
        found=[]
        for star in _MAIN_STARS:
            if star in text: found.append(star)
        # Sort in canonical order, not input order; keep only stars actually present.
        for star in _MAIN_STARS:
            if star in found and star not in out: out.append(star)
    return sorted(out)

def register_sanhe_routes(app, knowledge_path=None):
    if knowledge_path:
        file_path=Path(knowledge_path)
    else:
        module_dir=Path(__file__).resolve().parent
        candidates=[module_dir/'sanhe_knowledge.json', module_dir/'static'/'sanhe_knowledge.json']
        file_path=next((p for p in candidates if p.exists()), candidates[0])
    def get_kb():
        with file_path.open('r',encoding='utf-8') as f:return json.load(f)
    def source_index_path():
        candidates=[file_path.with_name('sanhe_chart_index.json'), file_path.parent/'static'/'sanhe_chart_index.json']
        return next((p for p in candidates if p.exists()), candidates[0])
    @app.get('/api/sanhe/knowledge')
    def sanhe_knowledge():
        kb=get_kb(); q=(request.args.get('q') or '').strip(); palace=_norm_palace(request.args.get('palace'))
        records=[]
        for r in (kb.get('chart_families') or kb.get('records',[])):
            alltext=r.get('title','')+' '+' '.join(t for _,t in _flatten(r))
            if q and q not in alltext: continue
            if palace and not (r.get('categories',{}).get(palace) or r.get('categories',{}).get(palace.removesuffix('宫')) or palace in r.get('title','')): continue
            records.append(r)
        return jsonify({'success':True,'total':len(records),'records':records[:100]})
    @app.post('/api/sanhe/analyze')
    def sanhe_analyze():
        data=request.get_json(silent=True) or {}
        palace=_norm_palace(data.get('palace')); dizhi=str(data.get('dizhi') or '')
        chart=data.get('chart') or {}; palaces=chart.get('palaces') or []
        chosen=next((p for p in palaces if _norm_palace(p.get('name'))==palace and (not dizhi or str(p.get('dizhi') or '')==dizhi)),None)
        ming=next((p for p in palaces if _norm_palace(p.get('name'))=='命宫'),None)
        qianyi=next((p for p in palaces if _norm_palace(p.get('name'))=='迁移宫'),None)
        if not ming:
            return jsonify({'success':False,'match_status':'missing_minggong','summary':'命盘数据中未找到命宫，无法匹配。','sections':[]})
        ming_stars=_normalize_main_stars(ming.get('main_stars') or [])
        qianyi_stars=_normalize_main_stars((qianyi or {}).get('main_stars') or [])
        kb=get_kb(); families=kb.get('chart_families') or []
        if len(ming_stars)==2:
            # 优先匹配命宫双主星（□），按完整组合匹配，不能拆成单星匹配。
            match_type='minggong_double_star'; match_stars=ming_stars
            candidates=[f for f in families if f.get('chart_marker')=='□' and _normalize_main_stars(f.get('main_stars') or [])==match_stars]
        elif len(ming_stars)==1:
            # 命宫确为单主星时，才进入 ○ 单星段落。
            match_type='minggong_single_star'; match_stars=ming_stars
            candidates=[f for f in families if f.get('chart_marker')=='○' and _normalize_main_stars(f.get('main_stars') or [])==match_stars]
        elif len(ming_stars)>2:
            return jsonify({'success':True,'match_status':'unsupported_minggong_star_count','summary':f'命宫识别到 {len(ming_stars)} 颗十四主星，不符合 Excel 中单主星（○）或双主星（□）的段落规则；为避免误配，不显示象义。','sections':[],'minggong_stars':ming_stars})
        else:
            if not qianyi:
                return jsonify({'success':True,'match_status':'missing_qianyi','summary':'命宫无主星，命盘数据中没有迁移宫，无法按 ◇ 规则匹配。','sections':[],'match_type':'qianyi_double_star'})
            if len(qianyi_stars)!=2:
                return jsonify({'success':True,'match_status':'qianyi_not_double_star','summary':f'命宫无主星，但迁移宫十四主星为“{"、".join(qianyi_stars) or "无主星"}”，不是 Excel 中 ◇ 所要求的双主星；不降级匹配其他命盘。','sections':[],'match_type':'qianyi_double_star','minggong_stars':ming_stars,'qianyi_stars':qianyi_stars})
            match_type='qianyi_double_star'; match_stars=qianyi_stars
            candidates=[f for f in families if f.get('chart_marker')=='◇' and _normalize_main_stars(f.get('migration_main_stars') or [])==match_stars]
        # Validate title branch even when a signature has only one candidate, preventing a
        # wrong branch fallback (e.g. 天相在巳亥 should not match 天相在卯酉).
        relevant_palace=qianyi if match_type=='qianyi_double_star' else ming
        relevant_dizhi=str((relevant_palace or {}).get('dizhi') or '')
        branch_checked=[]
        for f in candidates:
            title=f.get('title','')
            m=re.search(r'在([子丑寅卯辰巳午未申酉戌亥]{1,2})',title)
            if m:
                if relevant_dizhi and relevant_dizhi in m.group(1): branch_checked.append(f)
            elif len(candidates)==1:
                branch_checked.append(f)
        candidates=branch_checked
        if len(candidates)!=1:
            return jsonify({'success':True,'match_status':'no_unique_source_family','summary':f'按 {match_type} 识别出 {len(candidates)} 个候选原文段落，无法唯一匹配；为避免误配，不显示其他命盘的象义。','sections':[],'match_type':match_type,'matched_candidates':len(candidates),'minggong_stars':ming_stars,'qianyi_stars':qianyi_stars})
        record=candidates[0]; source_title=record.get('title','')
        cats=record.get('categories') or {}; items=(cats.get(palace) or cats.get(palace.removesuffix('宫')) or [])
        source=record.get('source') or {}
        source_label=""
        # source_label=f"{source.get('file','斗数-三合命盘.xlsx')}，Sheet2 第 {source.get('row_start','—')}–{source.get('row_end','—')} 行"
        if items:
            sections=[{'title':f'{source_title} · {palace}','items':items,'source':source_label}]
        else:
            sections=[{'title':f'{source_title} · 本宫无专属条文','items':['该命盘段落中没有独立的此宫条文；为避免借用其他命盘的断语，本次不以其他盘的内容代替。'],'source':source_label}]
        match_label={'minggong_double_star':'命宫双主星（□）','minggong_single_star':'命宫单主星（○）','qianyi_double_star':'命宫无主星，迁移宫双主星（◇）'}[match_type]
        return jsonify({'success':True,'match_status':'unique','match_type':match_type,'match_label':match_label,'matched_record':record.get('id'),'matched_title':source_title,
          'palace':palace,'dizhi':dizhi,'stars':_extract_stars(chosen or {}),
          'summary':f"唯一匹配：{source_title}。识别规则：{match_label}；命宫主星：{'、'.join(ming_stars) or '无主星'}；迁移宫主星：{'、'.join(qianyi_stars) or '无主星'}；当前选择：{palace}（{dizhi or '地支未知'}）。象义取自 Excel 对应原文段落。",
          'sections':sections,'matched_records':1})
