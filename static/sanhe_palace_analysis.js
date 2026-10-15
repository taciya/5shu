/* 三合命盘点击宫位解说：加载 sanhe_knowledge.json 或调用后端 /api/sanhe/analyze */
(function () {
  'use strict';
  const PALACE_SYNONYMS = {
    '命宮':'命宫','命宫':'命宫','兄弟':'兄弟宫','兄弟宫':'兄弟宫','夫妻':'夫妻宫','夫妻宫':'夫妻宫',
    '子女':'子女宫','子女宫':'子女宫','财帛':'财帛宫','财帛宫':'财帛宫','疾厄':'疾厄宫','疾厄宫':'疾厄宫',
    '迁移':'迁移宫','迁移宫':'迁移宫','仆役':'交友宫','仆役宫':'交友宫','交友':'交友宫','交友宫':'交友宫',
    '官禄':'官禄宫','官禄宫':'官禄宫','田宅':'田宅宫','田宅宫':'田宅宫','福德':'福德宫','福德宫':'福德宫','父母':'父母宫','父母宫':'父母宫'
  };
  const STAR_RE = /紫微|天机|太阳|武曲|天同|廉贞|天府|太阴|贪狼|巨门|天相|天梁|七杀|破军|左辅|右弼|文昌|文曲|擎羊|陀罗|火星|铃星|地空|地劫|禄存|天马|魁钺|红鸾|天喜|天刑|空劫|四煞/g;
  let knowledgePromise = null;
  function normPalace(v) {
    const raw = String(v || '').replace(/\s/g, '').replace(/宫$/, '');
    return PALACE_SYNONYMS[raw] || PALACE_SYNONYMS[raw + '宫'] || (raw ? raw + '宫' : '');
  }
  async function loadKnowledge() {
    if (!knowledgePromise) knowledgePromise = fetch('/static/sanhe_knowledge.json').then(r => {
      if (!r.ok) throw new Error('无法加载三合命盘知识库');
      return r.json();
    });
    return knowledgePromise;
  }
  function extractStars(palace) {
    const lists = ['main_stars','minor_stars','xiaoxing_stars','shensha_stars','changsheng_stars'];
    const out = [];
    lists.forEach(k => (Array.isArray(palace?.[k]) ? palace[k] : []).forEach(s => {
      const cleaned = String(s).replace(/\(.*?\)/g, '').trim();
      if (cleaned && !out.includes(cleaned)) out.push(cleaned);
    }));
    return out;
  }
  function palaceLabel(p) { return normPalace(p?.name || p?.palace_name || p?.palaceName); }
  function getPalaceContext(clicked, chart) {
    const palaces = Array.isArray(chart?.palaces) ? chart.palaces : [];
    const p = typeof clicked === 'string' ? palaces.find(x => palaceLabel(x) === normPalace(clicked)) : clicked;
    if (!p) return null;
    const name = palaceLabel(p);
    const stars = extractStars(p);
    const targetDizhi = p.dizhi;
    const index = palaces.indexOf(p);
    const opposite = index >= 0 && palaces.length === 12 ? palaces[(index + 6) % 12] : null;
    return {palace:p, name, stars, dizhi:targetDizhi, gan:p.gan || '', opposite:opposite ? {name:palaceLabel(opposite),dizhi:opposite.dizhi,stars:extractStars(opposite)} : null,
      chart:{birth_info:chart?.birth_info || {}, yin_yang:chart?.yin_yang || '', wuxingju:chart?.wuxingju || '', mingzhu:chart?.mingzhu || '', shenzhu:chart?.shenzhu || '', palaces:palaces.map(x=>({name:palaceLabel(x),dizhi:x.dizhi,gan:x.gan,main_stars:x.main_stars||[],minor_stars:x.minor_stars||[],xiaoxing_stars:x.xiaoxing_stars||[],shensha_stars:x.shensha_stars||[],changsheng_stars:x.changsheng_stars||[],sihua:x.sihua||[],lixin_sihua:x.lixin_sihua||[],xiangxin_sihua:x.xiangxin_sihua||[]}))}};
  }
  function flatRecordText(record) {
    const rows = [];
    Object.entries(record.categories || {}).forEach(([category, values]) => {
      (values || []).forEach(text => rows.push({category, text}));
    });
    return rows;
  }
  function scoreRecord(record, ctx) {
    const title = record.title || '';
    const text = JSON.stringify(record.categories || {});
    const stars = ctx.stars;
    let score = 0;
    if (title.includes(ctx.dizhi) || title.includes(ctx.name)) score += 2;
    stars.forEach(star => { if (record.stars_or_pattern === star || title.startsWith(star)) score += 5; else if (title.includes(star)) score += 2; });
    // 宫位相关条文优先，其次重点、行限、补充
    if (record.categories?.[ctx.name]) score += 12;
    if (record.categories?.['重点']?.length) score += 1;
    if (ctx.palace?.sihua?.length || ctx.palace?.lixin_sihua?.length || ctx.palace?.xiangxin_sihua?.length) {
      if (/四化|化禄|化权|化科|化忌/.test(text)) score += 1;
    }
    return score;
  }
  function h(tag, cls, text) { const n=document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; }
  function appendSafeRich(parent, title, body) {
    const section=h('section','sanhe-result-section'); section.appendChild(h('h4','',title));
    const ul=h('ul',''); body.forEach(x=>ul.appendChild(h('li','',x))); section.appendChild(ul); parent.appendChild(section);
  }
  function ensurePanel() {
    let panel=document.getElementById('sanheAnalysisPanel');
    if(panel) return panel;
    panel=h('aside','sanhe-analysis-panel'); panel.id='sanheAnalysisPanel'; panel.setAttribute('aria-live','polite');
    const style=h('style',''); style.textContent=`.sanhe-analysis-panel{position:fixed;z-index:9999;left:0;top:0;width:min(440px,calc(100vw - 32px));height:auto;max-height:100vh;overflow:auto;box-sizing:border-box;background:#fffdf8;border:1px solid #d8cdb7;border-radius:7px;box-shadow:0 6px 22px #0002;padding:7px;color:#2a2927;font:13px/1.45 system-ui,sans-serif}.sanhe-analysis-panel[hidden]{display:none}.sanhe-analysis-panel h3{margin:0;font-size:15px;line-height:1.25;font-weight:700}.sanhe-analysis-panel h4{margin:10px 0 4px;color:#6d5231;font-size:13px}.sanhe-analysis-panel ul{padding-left:18px;margin:3px 0}.sanhe-analysis-panel li{margin:3px 0}.sanhe-palace-header{position:sticky;top:-7px;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:8px;margin:-7px -7px 6px;padding:7px;background:#fffdf8;border-bottom:1px solid #e4dccc}.sanhe-palace-name{min-width:0;overflow-wrap:anywhere}.sanhe-panel-close{flex:0 0 auto;border:0;background:#eee5d7;border-radius:5px;padding:3px 8px;font:inherit;line-height:1.4;cursor:pointer}.sanhe-panel-meta{color:#777;font-size:11px;margin:3px 0 7px}.sanhe-source{color:#777;font-size:10px;border-top:1px solid #e4dccc;padding-top:6px;margin-top:8px}.sanhe-pending{color:#8a673c}.sanhe-tags{display:flex;flex-wrap:wrap;gap:4px}.sanhe-tag{background:#eee5d7;border-radius:4px;padding:1px 5px;font-size:11px}`;
    document.head.appendChild(style);
    const content=h('div','',''); content.id='sanheAnalysisContent'; panel.appendChild(content);
    document.body.appendChild(panel); return panel;
  }
  function alignPanelToCenterCell(panel) {
    const target=document.querySelector('.center-cell');
    if(!target) return false;
    const rect=target.getBoundingClientRect();
    if(!rect.width || !rect.height) return false;
    const computed=window.getComputedStyle(target);
    const borderLeft=parseFloat(computed.borderLeftWidth)||0;
    const borderRight=parseFloat(computed.borderRightWidth)||0;
    const borderTop=parseFloat(computed.borderTopWidth)||0;
    const borderBottom=parseFloat(computed.borderBottomWidth)||0;
    // 紧贴 center-cell 内缘，同时保留 2px 缝隙，不覆盖中心格边框。
    const inset=2;
    Object.assign(panel.style,{
      left:`${rect.left+borderLeft+inset}px`,
      top:`${rect.top+borderTop+inset}px`,
      width:`${Math.max(0,rect.width-borderLeft-borderRight-inset*2)}px`,
      height:`${Math.max(0,rect.height-borderTop-borderBottom-inset*2)}px`,
      maxHeight:'none', transform:'none', boxSizing:'border-box'
    });
    return true;
  }
  function appendPalaceHeader(content, titleText, panel) {
    const row=h('div','sanhe-palace-header');
    row.appendChild(h('h3','sanhe-palace-name',titleText||'宫位'));
    const close=h('button','sanhe-panel-close','关闭');
    close.type='button'; close.setAttribute('aria-label','关闭宫位说明');
    close.onclick=()=>{panel.hidden=true;};
    row.appendChild(close);
    content.appendChild(row);
  }
  async function analyzePalace(palace, chart) {
    const panel=ensurePanel(), content=document.getElementById('sanheAnalysisContent'); panel.hidden=false;
    alignPanelToCenterCell(panel);
    content.replaceChildren();
    const ctx=getPalaceContext(palace,chart);
    appendPalaceHeader(content,ctx?.name||'宫位',panel);
    alignPanelToCenterCell(panel);
    if(!ctx){content.appendChild(h('p','','尚未读取到对应宫位数据，请先生成命盘。'));return;}
    content.appendChild(h('div','sanhe-panel-meta',`地支：${ctx.dizhi||'未识别'} · 宫干：${ctx.gan||'未识别'}`));
    const tags=h('div','sanhe-tags',''); ctx.stars.forEach(star=>tags.appendChild(h('span','sanhe-tag',star))); content.appendChild(tags);
    if(ctx.opposite){content.appendChild(h('div','sanhe-panel-meta',`对宫：${ctx.opposite.name}（${ctx.opposite.dizhi||''}）｜${ctx.opposite.stars.join('、')||'无明显星曜'}`));}
    content.appendChild(h('p','sanhe-pending','正在匹配附件知识库中的星曜组合与宫位条文……'));
    try {
      const resp=await fetch('/api/sanhe/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({palace:ctx.name,dizhi:ctx.dizhi,gan:ctx.gan,stars:ctx.stars,opposite:ctx.opposite,chart:ctx.chart})});
      if(resp.ok){const data=await resp.json(); renderAnalysisResult(content,data,ctx); return;}
    } catch(e) { /* fall back to client-side search */ }
    try {
      const kb=await loadKnowledge();
      const dataChart=ctx.chart || {};
      const palaces=dataChart.palaces||[];
      const ming=palaces.find(p=>normPalace(p.name)==='命宫');
      const mingStars=(ming?.main_stars||[]).map(x=>String(x).replace(/\(.*?\)/g,'').trim()).filter(Boolean).sort();
      const purple=palaces.filter(p=>(p.main_stars||[]).some(x=>String(x).replace(/\(.*?\)/g,'').trim()==='紫微'));
      const pending=content.querySelector('.sanhe-pending'); if(pending)pending.remove();
      if(!ming?.dizhi || purple.length!==1 || !purple[0]?.dizhi){
        content.appendChild(h('p','','无法构造144命盘复合索引：需要唯一的紫微所在宫位地支，以及命宫所在宫位地支。为避免误配，不显示象义。')); return;
      }
      const ziweiDizhi=String(purple[0].dizhi), mingDizhi=String(ming.dizhi);
      const indexResp=await fetch('/static/chart_index_144.json');
      if(!indexResp.ok) throw new Error('缺少 chart_index_144.json');
      const chartIndex=await indexResp.json();
      const key=`紫微在${ziweiDizhi}|命宫在${mingDizhi}`;
      const entry=(chartIndex.entries||[]).find(x=>x.key===key);
      if(!entry){content.appendChild(h('p','',`144命盘索引中不存在键：${key}。应修复索引，不使用近似匹配。`));return;}
      const expected=(entry.minggong_main_stars||[]).slice().sort();
      if(JSON.stringify(expected)!==JSON.stringify(mingStars)){
        content.appendChild(h('p','',`复合键 ${key} 对应的十四主星为“${expected.join('、')||'无主星'}”，但当前命宫十四主星为“${mingStars.join('、')||'无主星'}”。请检查排盘数据或144索引，本次不显示象义。`)); return;
      }
      if(entry.status!=='mapped'||!entry.record||typeof entry.record!=='object'){
        content.appendChild(h('p','',`已唯一识别命盘键 ${key}，命宫十四主星为“${expected.join('、')||'无主星'}”，但知识库尚未建立对应的命盘象义条目（索引状态：${entry.status||'missing_knowledge_record'}）。应补齐索引/内容，不借用其他命盘断语。`));return;
      }
      const r=(kb.records||[]).find(x=>x.id===entry.record.id);
      if(!r){content.appendChild(h('p','',`索引键 ${key} 指向 ${entry.record.id}，但知识库找不到该条目。请修复 record_id 映射。`));return;}
      const items=r.categories?.[ctx.name]||[];
      const section=h('section','sanhe-result-section'); section.appendChild(h('h4','',r.title+' · '+ctx.name));
      if(items.length) appendSafeRich(section,ctx.name,items);
      else appendSafeRich(section,'匹配说明',['该命盘条目没有此宫的专属条文；为避免借用其他命盘断语，不以其他盘内容代替。']);
      section.appendChild(h('div','sanhe-source',`唯一复合键：${key}；来源：斗數-三合命盘.docx；段落 ${r.source?.paragraph_start ?? '—'}–${r.source?.paragraph_end ?? '—'}`)); content.appendChild(section);
    } catch(e){const pending=content.querySelector('.sanhe-pending');if(pending)pending.textContent='知识库加载失败。请确认 sanhe_knowledge.json 已放在 static 目录。';}
  }
  function renderAnalysisResult(content, data, ctx) {
    const pending=content.querySelector('.sanhe-pending'); if(pending)pending.remove();
    if(data.summary) content.appendChild(h('p','',data.summary));
    (data.sections||[]).forEach(sec=>{const arr=Array.isArray(sec.items)?sec.items:[sec.text].filter(Boolean);if(arr.length)appendSafeRich(content,sec.title||'象义',arr);if(sec.source)content.appendChild(h('div','sanhe-source',`来源：${sec.source}`));});
    if(data.interpretation) appendSafeRich(content,'综合解说',[data.interpretation]);
    if(!data.sections?.length && !data.summary && !data.interpretation && !['ambiguous','no_match','missing_minggong'].includes(data.match_status)) content.appendChild(h('p','','后端已返回，但没有找到可显示的象义条目。'));
  }
  function findChartData() {
    // renderChart 的 mixData 是局部变量；把它暴露给本模块后优先读取。
    return window.__5shuCurrentChart || window.mixData || window.lastMixData || null;
  }
  document.addEventListener('click', function(ev){
    const cell=ev.target.closest('.palace'); if(!cell)return;
    const chart=findChartData(); const data=chart?.ziwei_chart || chart?.chart || chart;
    if(!data?.palaces){ const panel=ensurePanel();panel.hidden=false;const c=document.getElementById('sanheAnalysisContent');c.replaceChildren();appendPalaceHeader(c,'宫位',panel);alignPanelToCenterCell(panel);c.appendChild(h('p','','已点击宫位，但页面尚未暴露当前命盘数据。请在 renderChart(mixData, formData) 开头加入 window.__5shuCurrentChart = mixData; 后刷新。'));return; }
    const palace=data.palaces.find(p=>p.dizhi===cell.id.replace(/宫$/,''));
    analyzePalace(palace, data);
  });
  window.addEventListener('resize',function(){const panel=document.getElementById('sanheAnalysisPanel');if(panel&&!panel.hidden)alignPanelToCenterCell(panel);});
  window.addEventListener('scroll',function(){const panel=document.getElementById('sanheAnalysisPanel');if(panel&&!panel.hidden)alignPanelToCenterCell(panel);},true);
  window.SanhePalaceAnalyzer={analyzePalace,loadKnowledge,getPalaceContext};
})();
