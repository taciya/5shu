/* 命主／身主独立分析：双击 div.ganzhi 触发；不修改或调用 sanhe_xxx。 */
;(function () {
  'use strict'

  const PANEL_ID = 'mingzhuShenzhuGanzhiPanel'
  const CONTENT_ID = 'mingzhuShenzhuGanzhiContent'
  const BRANCH_RE = /[子丑寅卯辰巳午未申酉戌亥]/

  function el(tag, className, text) {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined && text !== null) node.textContent = String(text)
    return node
  }

  function normalizePalace(value) {
    const raw = String(value || '')
      .replace(/\s/g, '')
      .replace(/宫$/, '')
    const aliases = { 仆役: '交友', 奴仆: '交友', 命: '命' }
    const normalized = aliases[raw] || raw
    return normalized ? normalized + '宫' : ''
  }

  function getChartData() {
    // 与现有命盘页面共享当前数据变量，但不依赖三合分析模块。
    const current =
      window.__5shuCurrentChart || window.mixData || window.lastMixData || null
    let data = current && (current.ziwei_chart || current.chart || current)
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (_) {
        return null
      }
    }
    if (data && typeof data === 'object' && typeof data.palaces === 'string') {
      try {
        data = Object.assign({}, data, { palaces: JSON.parse(data.palaces) })
      } catch (_) {}
    }
    return data && Array.isArray(data.palaces) ? data : null
  }

  function branchFromElement(ganzhi) {
    const palaceCell = ganzhi.closest('.palace')
    const candidates = [
      ganzhi.dataset.dizhi,
      ganzhi.dataset.branch,
      palaceCell && palaceCell.dataset.dizhi,
      palaceCell && palaceCell.id,
      ganzhi.textContent,
    ].filter(Boolean)
    for (const candidate of candidates) {
      const match = String(candidate).match(BRANCH_RE)
      if (match) return match[0]
    }
    return ''
  }

  function palaceForBranch(chart, branch, ganzhi) {
    let palace = chart.palaces.find(
      (p) => String(p.dizhi || '').trim() === branch,
    )
    if (palace) return palace
    const cell = ganzhi.closest('.palace')
    const id = String((cell && cell.id) || '').replace(/宫$/, '')
    palace = chart.palaces.find((p) => String(p.dizhi || '').trim() === id)
    if (palace) return palace
    return null
  }

  function ensurePanel() {
    let panel = document.getElementById(PANEL_ID)
    if (panel) return panel
    panel = el('aside', 'mzsz-ganzhi-panel')
    panel.id = PANEL_ID
    panel.setAttribute('aria-live', 'polite')
    panel.hidden = true
    const style = el('style')
    style.textContent = `
      .mzsz-ganzhi-panel{position:fixed;z-index:10000;left:0;top:0;width:min(440px,calc(100vw - 32px));height:auto;max-height:100vh;overflow:auto;box-sizing:border-box;background:#fffdf8;border:1px solid #d8cdb7;padding:7px;color:#2a2927;font:13px/1.45 system-ui,sans-serif}
      .mzsz-ganzhi-panel[hidden]{display:none}
      .mzsz-ganzhi-panel h3{margin:0;font-size:15px;line-height:1.25;font-weight:700}
      .mzsz-ganzhi-header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
      .mzsz-ganzhi-close{border:1px solid #cfc5b3;background:#f7f1e6;color:#302d28;padding:2px 8px;cursor:pointer}
      .mzsz-ganzhi-meta{color:#777;font-size:11px;margin:3px 0 7px}
      .mzsz-ganzhi-section{border-top:1px solid #e4dccc;padding-top:6px;margin-top:7px}
      .mzsz-ganzhi-section h4{font-size:12px;margin:0 0 4px;font-weight:700}
      .mzsz-ganzhi-section ul{padding-left:19px;margin:3px 0 6px}
      .mzsz-ganzhi-section li{margin:2px 0;overflow-wrap:anywhere}
      .mzsz-ganzhi-source{color:#777;font-size:10px;border-top:1px solid #e4dccc;padding-top:5px;margin-top:6px}
      .mzsz-ganzhi-status{color:#8a673c;margin:6px 0}
    `
    document.head.appendChild(style)
    const content = el('div')
    content.id = CONTENT_ID
    panel.appendChild(content)
    document.body.appendChild(panel)
    return panel
  }

  function alignPanel(panel) {
    const target = document.querySelector('.center-cell')
    if (!target) return
    const rect = target.getBoundingClientRect()
    if (!rect.width || !rect.height) return
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
  }

  function renderHeader(content, title, panel) {
    const header = el('div', 'mzsz-ganzhi-header')
    header.appendChild(el('h3', '', title || '命主／身主裁断'))
    const close = el('button', 'mzsz-ganzhi-close', '关闭')
    close.type = 'button'
    close.onclick = () => {
      panel.hidden = true
    }
    header.appendChild(close)
    content.appendChild(header)
  }

  function renderResult(content, result) {
    if (result.summary)
      content.appendChild(el('p', 'mzsz-ganzhi-meta', result.summary))
    ;(result.sections || []).forEach((section) => {
      const block = el('section', 'mzsz-ganzhi-section')
      block.appendChild(el('h4', '', section.title || '象义'))
      const items = Array.isArray(section.items) ? section.items : []
      if (items.length) {
        const list = el('ul')
        items.forEach((item) => list.appendChild(el('li', '', item)))
        block.appendChild(list)
      }
      if (section.source) {
        let source = `来源：${section.source}`
        const rows = section.source_rows
        if (Array.isArray(rows) && rows.length)
          source += `（表格行：${rows.join('、')}）`
        else if (
          rows &&
          Number.isFinite(rows.start) &&
          Number.isFinite(rows.end)
        )
          source += `（第 ${rows.start}–${rows.end} 行）`
        block.appendChild(el('div', 'mzsz-ganzhi-source', source))
      }
      content.appendChild(block)
    })
  }

  async function analyzeGanzhi(ganzhi) {
    const panel = ensurePanel()
    const content = document.getElementById(CONTENT_ID)
    panel.hidden = false
    content.replaceChildren()
    const branch = branchFromElement(ganzhi)
    const chart = getChartData()
    const palace =
      chart && branch ? palaceForBranch(chart, branch, ganzhi) : null
    const palaceName = (palace && (palace.name || palace.palace_name)) || '宫位'
    renderHeader(
      content,
      `${normalizePalace(palaceName) || palaceName} · ${branch || '未识别地支'}`,
      panel,
    )
    alignPanel(panel)

    if (!chart) {
      content.appendChild(
        el(
          'p',
          '',
          '尚未读取到当前命盘数据。请确认页面在 renderChart(mixData, formData) 中设置 window.__5shuCurrentChart = mixData; 后再试。',
        ),
      )
      return
    }
    if (!branch || !palace) {
      content.appendChild(
        el(
          'p',
          '',
          `无法将 div.ganzhi 的地支“${branch || '未识别'}”对应到当前命盘十二宫。`,
        ),
      )
      return
    }

    content.appendChild(
      el('p', 'mzsz-ganzhi-status', '正在读取命主／身主知识库……'),
    )
    try {
      const response = await fetch('/api/mingzhu-shenzhu/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          palace: normalizePalace(palace.name || palace.palace_name),
          dizhi: branch,
          chart,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.success === false)
        throw new Error(result.summary || result.message || '请求失败')
      content.replaceChildren()
      renderHeader(
        content,
        `${normalizePalace(palace.name || palace.palace_name)} · ${branch}`,
        panel,
      )
      content.appendChild(
        el(
          'p',
          'mzsz-ganzhi-meta',
          `宫主星：${result.gongzhu || '未识别'}　身主星：${result.shenzhu || '未识别'}`,
        ),
      )
      renderResult(content, result)
    } catch (error) {
      const status = content.querySelector('.mzsz-ganzhi-status')
      if (status) status.textContent = `分析失败：${error.message || error}`
      else
        content.appendChild(el('p', '', `分析失败：${error.message || error}`))
    }
    alignPanel(panel)
  }

  // 捕获阶段优先拦截，避免同一次双击继续冒泡触发现有 .palace 的 sanhe 分析。
  document.addEventListener(
    'click',
    function (event) {
      const target =
        event.target && event.target.closest
          ? event.target.closest('div.ganzhi')
          : null
      if (!target) return
      event.preventDefault()
      event.stopImmediatePropagation()
      analyzeGanzhi(target)
    },
    true,
  )

  function realign() {
    const panel = document.getElementById(PANEL_ID)
    if (panel && !panel.hidden) alignPanel(panel)
  }
  window.addEventListener('resize', realign)
  window.addEventListener('scroll', realign, true)
  window.MingzhuShenzhuGanzhi = { analyzeGanzhi }
})()
