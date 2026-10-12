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

def register_sanhe_routes(app, knowledge_path=None):
    if knowledge_path:
        file_path=Path(knowledge_path)
    else:
        module_dir=Path(__file__).resolve().parent
        candidates=[module_dir/'sanhe_knowledge.json', module_dir/'static'/'sanhe_knowledge.json']
        file_path=next((p for p in candidates if p.exists()), candidates[0])
    def get_kb():
        with file_path.open('r',encoding='utf-8') as f:return json.load(f)
    @app.get('/api/sanhe/knowledge')
    def sanhe_knowledge():
        kb=get_kb(); q=(request.args.get('q') or '').strip(); palace=_norm_palace(request.args.get('palace'))
        records=[]
        for r in kb.get('records',[]):
            alltext=r.get('title','')+' '+' '.join(t for _,t in _flatten(r))
            if q and q not in alltext: continue
            if palace and not (r.get('categories',{}).get(palace) or palace in r.get('title','')): continue
            records.append(r)
        return jsonify({'success':True,'total':len(records),'records':records[:100]})
    @app.post('/api/sanhe/analyze')
    def sanhe_analyze():
        data=request.get_json(silent=True) or {}
        palace=_norm_palace(data.get('palace')); dizhi=str(data.get('dizhi') or '')
        chart=data.get('chart') or {}; palaces=chart.get('palaces') or []
        chosen=next((p for p in palaces if _norm_palace(p.get('name'))==palace and (not dizhi or p.get('dizhi')==dizhi)),None)
        ming=next((p for p in palaces if _norm_palace(p.get('name'))=='命宫'),None)
        if not ming:
            return jsonify({'success':False,'match_status':'missing_minggong','summary':'命盘数据中未找到命宫，无法唯一识别144命盘。','sections':[]})
        ming_stars=[re.sub(r"\(.*?\)","",str(x)).strip() for x in (ming.get('main_stars') or []) if x]
        chosen_stars=[re.sub(r"\(.*?\)","",str(x)).strip() for x in ((chosen or {}).get('main_stars') or []) if x]
        purple=[p for p in palaces if any(re.sub(r"\(.*?\)","",str(x)).strip()=='紫微' for x in (p.get('main_stars') or []))]
        if len(purple)!=1 or not purple[0].get('dizhi') or not ming.get('dizhi'):
            return jsonify({'success':True,'match_status':'missing_chart_key','summary':'无法构造144命盘复合索引：需要唯一的紫微所在宫位地支，以及命宫所在宫位地支。为避免误配，不显示象义。','sections':[]})
        ziwei_dizhi=str(purple[0].get('dizhi')); ming_dizhi=str(ming.get('dizhi'))
        index_path=file_path.with_name('chart_index_144.json')
        if not index_path.exists():
            return jsonify({'success':True,'match_status':'missing_index','summary':'缺少 chart_index_144.json，无法按“紫微地支 + 命宫地支”唯一匹配。请将144命盘索引文件放在 sanhe_knowledge.json 同目录。','sections':[]})
        with index_path.open('r',encoding='utf-8') as f: chart_index=json.load(f)
        key=f'紫微在{ziwei_dizhi}|命宫在{ming_dizhi}'
        entry=next((x for x in chart_index.get('entries',[]) if x.get('key')==key),None)
        if not entry:
            return jsonify({'success':True,'match_status':'index_key_missing','summary':f'144命盘索引中不存在键：{key}。应修复索引，不使用近似匹配。','sections':[]})
        expected=sorted(entry.get('minggong_main_stars') or [])
        actual=sorted(ming_stars)
        if expected!=actual:
            expected_text='、'.join(expected) if expected else '无主星'; actual_text='、'.join(actual) if actual else '无主星'
            return jsonify({'success':True,'match_status':'chart_key_mismatch','summary':f'复合键 {key} 对应的十四主星签名为“{expected_text}”，但当前命宫十四主星为“{actual_text}”。这说明排盘数据与144索引不一致，应检查索引或排盘字段；本次不显示象义。','sections':[],'index_key':key,'expected_minggong_stars':expected,'actual_minggong_stars':actual})
        if entry.get('status')!='mapped' or not isinstance(entry.get('record'),dict):
            expected_text='、'.join(expected) if expected else '无主星'
            return jsonify({'success':True,'match_status':entry.get('status','missing_knowledge_record'),'summary':f'已唯一识别命盘键 {key}，命宫十四主星为“{expected_text}”，但三合知识库尚未建立对应的命盘象义条目。应补齐该条目的知识库索引/内容，不借用其他命盘断语。','sections':[],'index_key':key,'minggong_stars':expected})
        kb=get_kb(); record_id=entry['record'].get('id')
        candidates=[r for r in kb.get('records',[]) if r.get('id')==record_id]
        if len(candidates)!=1:
            return jsonify({'success':True,'match_status':'knowledge_record_missing','summary':f'144索引键 {key} 指向知识库条目 {record_id}，但知识库中找不到唯一记录。请修复 record_id 映射。','sections':[],'index_key':key})
        r=candidates[0]
        r=candidates[0]; cats=r.get('categories') or {}; items=cats.get(palace) or []
        sections=[]
        if items:
            sections.append({'title':f"{r.get('title','')} · {palace}",'items':items,
                'source':f"斗數-三合命盘.docx，段落 {r.get('source',{}).get('paragraph_start','—')}–{r.get('source',{}).get('paragraph_end','—')}"})
        else:
            sections.append({'title':f"{r.get('title','')} · 本宫无专属条文",'items':['该命盘条目中没有独立的此宫象义内容；为避免借用其他命盘的断语，本次不以其他盘的内容代替。'],
                'source':f"斗數-三合命盘.docx，段落 {r.get('source',{}).get('paragraph_start','—')}–{r.get('source',{}).get('paragraph_end','—')}"})
        purple_info=f"紫微在{ziwei_dizhi}，命宫在{ming_dizhi}。"
        summary=f"唯一匹配：{r.get('title')}。复合索引：{key}；命宫十四主星：{'、'.join(ming_stars) or '无主星'}；当前选择：{palace}（{dizhi or '地支未知'}），本宫十四主星：{'、'.join(chosen_stars) or '无'}。{purple_info}仅显示该知识条目在当前宫位的内容。"
        return jsonify({'success':True,'match_status':'unique','index_key':key,'matched_record':r.get('id'),'matched_title':r.get('title'),
            'palace':palace,'dizhi':dizhi,'stars':_extract_stars(chosen or {}),'summary':summary,'sections':sections,'matched_records':1})
