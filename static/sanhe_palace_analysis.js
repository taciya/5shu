/* 三合命盘点击宫位解说：加载 sanhe_knowledge.json 或调用后端 /api/sanhe/analyze */
;(function () {
  'use strict'
  const PALACE_SYNONYMS = {
    命宮: '命宫',
    命宫: '命宫',
    兄弟: '兄弟宫',
    兄弟宫: '兄弟宫',
    夫妻: '夫妻宫',
    夫妻宫: '夫妻宫',
    子女: '子女宫',
    子女宫: '子女宫',
    财帛: '财帛宫',
    财帛宫: '财帛宫',
    疾厄: '疾厄宫',
    疾厄宫: '疾厄宫',
    迁移: '迁移宫',
    迁移宫: '迁移宫',
    仆役: '交友宫',
    仆役宫: '交友宫',
    交友: '交友宫',
    交友宫: '交友宫',
    官禄: '官禄宫',
    官禄宫: '官禄宫',
    田宅: '田宅宫',
    田宅宫: '田宅宫',
    福德: '福德宫',
    福德宫: '福德宫',
    父母: '父母宫',
    父母宫: '父母宫',
  }
  const STAR_RE =
    /紫微|天机|太阳|武曲|天同|廉贞|天府|太阴|贪狼|巨门|天相|天梁|七杀|破军|左辅|右弼|文昌|文曲|擎羊|陀罗|火星|铃星|地空|地劫|禄存|天马|魁钺|红鸾|天喜|天刑|空劫|四煞/g
  let knowledgePromise = null
  function normPalace(v) {
    const raw = String(v || '')
      .replace(/\s/g, '')
      .replace(/宫$/, '')
    return (
      PALACE_SYNONYMS[raw] ||
      PALACE_SYNONYMS[raw + '宫'] ||
      (raw ? raw + '宫' : '')
    )
  }
  async function loadKnowledge() {
    if (!knowledgePromise)
      knowledgePromise = fetch('/static/sanhe_knowledge.json').then((r) => {
        if (!r.ok) throw new Error('无法加载三合命盘知识库')
        return r.json()
      })
    return knowledgePromise
  }
  function extractStars(palace) {
    const lists = [
      'main_stars',
      'minor_stars',
      'xiaoxing_stars',
      'shensha_stars',
      'changsheng_stars',
    ]
    const out = []
    lists.forEach((k) =>
      (Array.isArray(palace?.[k]) ? palace[k] : []).forEach((s) => {
        const cleaned = String(s)
          .replace(/\(.*?\)/g, '')
          .trim()
        if (cleaned && !out.includes(cleaned)) out.push(cleaned)
      }),
    )
    return out
  }
  const MAIN_STARS = [
    '紫微',
    '天机',
    '太阳',
    '武曲',
    '天同',
    '廉贞',
    '天府',
    '太阴',
    '贪狼',
    '巨门',
    '天相',
    '天梁',
    '七杀',
    '破军',
  ]
  function normalizeMainStars(values) {
    const found = new Set()
    ;(values || []).forEach((value) => {
      const text = String(value)
        .replace(/\(.*?\)/g, '')
        .trim()
      MAIN_STARS.forEach((star) => {
        if (text.includes(star)) found.add(star)
      })
    })
    return MAIN_STARS.filter((star) => found.has(star)).sort()
  }
  function palaceLabel(p) {
    return normPalace(p?.name || p?.palace_name || p?.palaceName)
  }
  function getPalaceContext(clicked, chart) {
    const palaces = Array.isArray(chart?.palaces) ? chart.palaces : []
    const p =
      typeof clicked === 'string'
        ? palaces.find((x) => palaceLabel(x) === normPalace(clicked))
        : clicked
    if (!p) return null
    const name = palaceLabel(p)
    const stars = extractStars(p)
    const targetDizhi = p.dizhi
    const index = palaces.indexOf(p)
    const opposite =
      index >= 0 && palaces.length === 12 ? palaces[(index + 6) % 12] : null
    return {
      palace: p,
      name,
      stars,
      dizhi: targetDizhi,
      gan: p.gan || '',
      opposite: opposite
        ? {
            name: palaceLabel(opposite),
            dizhi: opposite.dizhi,
            stars: extractStars(opposite),
          }
        : null,
      chart: {
        birth_info: chart?.birth_info || {},
        yin_yang: chart?.yin_yang || '',
        wuxingju: chart?.wuxingju || '',
        mingzhu: chart?.mingzhu || '',
        shenzhu: chart?.shenzhu || '',
        palaces: palaces.map((x) => ({
          name: palaceLabel(x),
          dizhi: x.dizhi,
          gan: x.gan,
          main_stars: x.main_stars || [],
          minor_stars: x.minor_stars || [],
          xiaoxing_stars: x.xiaoxing_stars || [],
          shensha_stars: x.shensha_stars || [],
          changsheng_stars: x.changsheng_stars || [],
          sihua: x.sihua || [],
          lixin_sihua: x.lixin_sihua || [],
          xiangxin_sihua: x.xiangxin_sihua || [],
        })),
      },
    }
  }
  function flatRecordText(record) {
    const rows = []
    Object.entries(record.categories || {}).forEach(([category, values]) => {
      ;(values || []).forEach((text) => rows.push({ category, text }))
    })
    return rows
  }
  function scoreRecord(record, ctx) {
    const title = record.title || ''
    const text = JSON.stringify(record.categories || {})
    const stars = ctx.stars
    let score = 0
    if (title.includes(ctx.dizhi) || title.includes(ctx.name)) score += 2
    stars.forEach((star) => {
      if (record.stars_or_pattern === star || title.startsWith(star)) score += 5
      else if (title.includes(star)) score += 2
    })
    // 宫位相关条文优先，其次重点、行限、补充
    if (record.categories?.[ctx.name]) score += 12
    if (record.categories?.['重点']?.length) score += 1
    if (
      ctx.palace?.sihua?.length ||
      ctx.palace?.lixin_sihua?.length ||
      ctx.palace?.xiangxin_sihua?.length
    ) {
      if (/四化|化禄|化权|化科|化忌/.test(text)) score += 1
    }
    return score
  }
  function h(tag, cls, text) {
    const n = document.createElement(tag)
    if (cls) n.className = cls
    if (text !== undefined) n.textContent = text
    return n
  }
  function appendSafeRich(parent, title, body) {
    const section = h('section', 'sanhe-result-section')
    section.appendChild(h('h4', '', title))
    const ul = h('ul', '')
    body.forEach((x) => ul.appendChild(h('li', '', x)))
    section.appendChild(ul)
    parent.appendChild(section)
  }
  function ensurePanel() {
    let panel = document.getElementById('sanheAnalysisPanel')
    if (panel) return panel
    panel = h('aside', 'sanhe-analysis-panel')
    panel.id = 'sanheAnalysisPanel'
    panel.setAttribute('aria-live', 'polite')
    const style = h('style', '')
    style.textContent = `.sanhe-analysis-panel{position:fixed;z-index:9999;left:0;top:0;width:min(440px,calc(100vw - 32px));height:auto;max-height:100vh;overflow:auto;box-sizing:border-box;background:#fffdf8;border:1px solid #d8cdb7;border-radius:0;box-shadow:none;padding:7px;color:#2a2927;font:13px/1.45 system-ui,sans-serif}.sanhe-analysis-panel[hidden]{display:none}.sanhe-analysis-panel h3{margin:0;font-size:15px;line-height:1.25;font-weight:700}.sanhe-analysis-panel h4{margin:10px 0 4px;color:#6d5231;font-size:13px}.sanhe-analysis-panel ul{padding-left:18px;margin:3px 0}.sanhe-analysis-panel li{margin:3px 0}.sanhe-palace-header{position:sticky;top:-7px;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:6px;min-height:28px;box-sizing:border-box;margin:-7px -7px 6px;padding:5px 7px;background:#fffdf8;border-bottom:1px solid #e4dccc}.sanhe-palace-name{min-width:0;overflow-wrap:anywhere}.sanhe-panel-close{flex:0 0 auto;border:0;background:#eee5d7;border-radius:5px;padding:3px 8px;font:inherit;line-height:1.4;cursor:pointer}.sanhe-panel-meta{color:#777;font-size:11px;margin:3px 0 7px}.sanhe-source{color:#777;font-size:10px;border-top:1px solid #e4dccc;padding-top:6px;margin-top:8px}.sanhe-pending{color:#8a673c}.sanhe-tags{display:flex;flex-wrap:wrap;gap:4px}.sanhe-tag{background:#eee5d7;border-radius:4px;padding:1px 5px;font-size:11px}`
    document.head.appendChild(style)
    const content = h('div', '', '')
    content.id = 'sanheAnalysisContent'
    panel.appendChild(content)
    document.body.appendChild(panel)
    return panel
  }
  function alignPanelToCenterCell(panel) {
    const target = document.querySelector('.center-cell')
    if (!target) return false
    const rect = target.getBoundingClientRect()
    if (!rect.width || !rect.height) return false
    // 面板外框与 center-cell 的 getBoundingClientRect 完全重合，不做内缩。
    Object.assign(panel.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      maxHeight: 'none',
      transform: 'none',
      boxSizing: 'border-box',
      borderRadius: '0',
      boxShadow: 'none',
    })
    return true
  }
  function appendPalaceHeader(content, titleText, panel) {
    const row = h('div', 'sanhe-palace-header')
    row.appendChild(h('h3', 'sanhe-palace-name', titleText || '宫位'))
    const close = h('button', 'sanhe-panel-close', '关闭')
    close.type = 'button'
    close.setAttribute('aria-label', '关闭宫位说明')
    close.onclick = () => {
      panel.hidden = true
    }
    row.appendChild(close)
    content.appendChild(row)
  }
  async function analyzePalace(palace, chart) {
    const panel = ensurePanel(),
      content = document.getElementById('sanheAnalysisContent')
    panel.hidden = false
    content.replaceChildren()
    const ctx = getPalaceContext(palace, chart)
    appendPalaceHeader(content, ctx?.name || '宫位', panel)
    alignPanelToCenterCell(panel)
    if (!ctx) {
      content.appendChild(h('p', '', '尚未读取到对应宫位数据，请先生成命盘。'))
      return
    }
    content.appendChild(
      h(
        'div',
        'sanhe-panel-meta',
        `地支：${ctx.dizhi || '未识别'} · 宫干：${ctx.gan || '未识别'}`,
      ),
    )
    const tags = h('div', 'sanhe-tags', '')
    ctx.stars.forEach((star) => tags.appendChild(h('span', 'sanhe-tag', star)))
    content.appendChild(tags)
    if (ctx.opposite) {
      content.appendChild(
        h(
          'div',
          'sanhe-panel-meta',
          `对宫：${ctx.opposite.name}（${ctx.opposite.dizhi || ''}）｜${ctx.opposite.stars.join('、') || '无明显星曜'}`,
        ),
      )
    }
    content.appendChild(
      h('p', 'sanhe-pending', '正在匹配附件知识库中的星曜组合与宫位条文……'),
    )
    try {
      const resp = await fetch('/api/sanhe/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          palace: ctx.name,
          dizhi: ctx.dizhi,
          gan: ctx.gan,
          stars: ctx.stars,
          opposite: ctx.opposite,
          chart: ctx.chart,
        }),
      })
      if (resp.ok) {
        const data = await resp.json()
        renderAnalysisResult(content, data, ctx)
        return
      }
    } catch (e) {
      /* fall back to client-side search */
    }
    try {
      const kb = await loadKnowledge()
      const dataChart = ctx.chart || {}
      const palaces = dataChart.palaces || []
      const ming = palaces.find((p) => normPalace(p.name) === '命宫')
      const qianyi = palaces.find((p) => normPalace(p.name) === '迁移宫')
      const mingStars = normalizeMainStars(ming?.main_stars || [])
      const qianyiStars = normalizeMainStars(qianyi?.main_stars || [])
      const pending = content.querySelector('.sanhe-pending')
      if (pending) pending.remove()
      let marker, matchType, wanted
      if (mingStars.length === 2) {
        marker = '□'
        matchType = 'minggong_double_star'
        wanted = mingStars
      } else if (mingStars.length === 1) {
        marker = '○'
        matchType = 'minggong_single_star'
        wanted = mingStars
      } else if (mingStars.length > 2) {
        content.appendChild(
          h(
            'p',
            '',
            '命宫识别到三颗或以上十四主星，不符合 Excel 中的单主星（○）或双主星（□）规则；为避免误配，不显示象义。',
          ),
        )
        return
      } else {
        if (qianyiStars.length !== 2) {
          content.appendChild(
            h(
              'p',
              '',
              `命宫无主星；迁移宫主星为“${qianyiStars.join('、') || '无主星'}”，未满足 ◇ 要求的迁移宫双主星条件，停止匹配。`,
            ),
          )
          return
        }
        marker = '◇'
        matchType = 'qianyi_double_star'
        wanted = qianyiStars
      }
      const list = (kb.chart_families || []).filter(
        (f) =>
          f.chart_marker === marker &&
          JSON.stringify(
            normalizeMainStars(
              marker === '◇'
                ? f.migration_main_stars || []
                : f.main_stars || [],
            ),
          ) === JSON.stringify(wanted),
      )
      const branch = String((marker === '◇' ? qianyi : ming)?.dizhi || '')
      let candidates = list.filter((f) => {
        const m = String(f.title || '').match(
          /在([子丑寅卯辰巳午未申酉戌亥]{1,2})/,
        )
        if (!m) return list.length === 1
        return !!branch && m[1].includes(branch)
      })
      if (candidates.length !== 1) {
        content.appendChild(
          h(
            'p',
            '',
            `按 ${marker} 标记与“${wanted.join('、')}”匹配到 ${candidates.length} 个段落，无法唯一识别；为避免误配，不显示象义。`,
          ),
        )
        return
      }
      const f = candidates[0]
      const r = (kb.chart_families || []).find((x) => x.id === f.id)
      if (!r) {
        content.appendChild(
          h('p', '', `索引指向 ${f.id}，但知识库缺少对应段落。`),
        )
        return
      }
      const items =
        r.categories?.[ctx.name] ||
        r.categories?.[ctx.name.replace(/宫$/, '')] ||
        []
      const section = h('section', 'sanhe-result-section')
      section.appendChild(h('h4', '', `${r.title} · ${ctx.name} · ${marker}`))
      if (items.length) appendSafeRich(section, ctx.name, items)
      else
        appendSafeRich(section, '匹配说明', [
          '该命盘段落没有此宫的专属条文；为避免借用其他命盘断语，不以其他盘内容代替。',
        ])
      section.appendChild(
        h(
          'div',
          'sanhe-source',
          `匹配规则：${matchType}；来源：${r.source?.file || '斗数-三合命盘.xlsx'}，Sheet2 第 ${r.source?.row_start ?? '—'}–${r.source?.row_end ?? '—'} 行`,
        ),
      )
      content.appendChild(section)
    } catch (e) {
      const pending = content.querySelector('.sanhe-pending')
      if (pending)
        pending.textContent =
          '知识库加载失败。请确认 sanhe_knowledge.json 已放在 static 目录。'
    }
  }
  function renderAnalysisResult(content, data, ctx) {
    const pending = content.querySelector('.sanhe-pending')
    if (pending) pending.remove()
    if (data.summary) content.appendChild(h('p', '', data.summary))
    ;(data.sections || []).forEach((sec) => {
      const arr = Array.isArray(sec.items)
        ? sec.items
        : [sec.text].filter(Boolean)
      if (arr.length) appendSafeRich(content, sec.title || '象义', arr)
      if (sec.source)
        content.appendChild(h('div', 'sanhe-source', `来源：${sec.source}`))
    })
    if (data.interpretation)
      appendSafeRich(content, '综合解说', [data.interpretation])
    if (
      !data.sections?.length &&
      !data.summary &&
      !data.interpretation &&
      !['ambiguous', 'no_match', 'missing_minggong'].includes(data.match_status)
    )
      content.appendChild(
        h('p', '', '后端已返回，但没有找到可显示的象义条目。'),
      )
  }
  function findChartData() {
    // renderChart 的 mixData 是局部变量；把它暴露给本模块后优先读取。
    return (
      window.__5shuCurrentChart || window.mixData || window.lastMixData || null
    )
  }
  document.addEventListener('dblclick', function (ev) {
    const cell = ev.target.closest('.palace')
    if (!cell) return
    const chart = findChartData()
    const data = chart?.ziwei_chart || chart?.chart || chart
    if (!data?.palaces) {
      const panel = ensurePanel()
      panel.hidden = false
      const c = document.getElementById('sanheAnalysisContent')
      c.replaceChildren()
      appendPalaceHeader(c, '宫位', panel)
      alignPanelToCenterCell(panel)
      c.appendChild(
        h(
          'p',
          '',
          '已点击宫位，但页面尚未暴露当前命盘数据。请在 renderChart(mixData, formData) 开头加入 window.__5shuCurrentChart = mixData; 后刷新。',
        ),
      )
      return
    }
    const palace = data.palaces.find(
      (p) => p.dizhi === cell.id.replace(/宫$/, ''),
    )
    analyzePalace(palace, data)
  })
  window.addEventListener('resize', function () {
    const panel = document.getElementById('sanheAnalysisPanel')
    if (panel && !panel.hidden) alignPanelToCenterCell(panel)
  })
  window.addEventListener(
    'scroll',
    function () {
      const panel = document.getElementById('sanheAnalysisPanel')
      if (panel && !panel.hidden) alignPanelToCenterCell(panel)
    },
    true,
  )
  window.SanhePalaceAnalyzer = {
    analyzePalace,
    loadKnowledge,
    getPalaceContext,
  }
})()
