"""命主／身主知识库，数据源为《紫微斗数-命主身主.xlsx》Sheet1。

本模块只负责按地支查表、查找星曜实际落宫并读取原文条目，不创造缺失的断语。
"""
from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

KB_PATH = Path(__file__).resolve().with_name("mingzhu_shenzhu_knowledge.json")

@lru_cache(maxsize=1)
def load_knowledge() -> dict[str, Any]:
    with KB_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)

PALACE_ALIASES = {
    "命": "命宫", "命宫": "命宫", "兄弟": "兄弟宫", "兄弟宫": "兄弟宫",
    "夫妻": "夫妻宫", "夫妻宫": "夫妻宫", "子女": "子女宫", "子女宫": "子女宫",
    "财帛": "财帛宫", "财帛宫": "财帛宫", "疾厄": "疾厄宫", "疾厄宫": "疾厄宫",
    "迁移": "迁移宫", "迁移宫": "迁移宫", "奴仆": "交友宫", "奴仆宫": "交友宫",
    "交友": "交友宫", "交友宫": "交友宫", "官禄": "官禄宫", "官禄宫": "官禄宫",
    "田宅": "田宅宫", "田宅宫": "田宅宫", "福德": "福德宫", "福德宫": "福德宫",
    "父母": "父母宫", "父母宫": "父母宫",
}

STAR_KEYS = ("main_stars", "minor_stars", "xiaoxing_stars", "shensha_stars", "changsheng_stars")

def normalize_palace(value: Any) -> str:
    raw = re.sub(r"\s", "", str(value or "")).removesuffix("宫")
    return PALACE_ALIASES.get(raw, PALACE_ALIASES.get(raw + "宫", raw + "宫" if raw else ""))

def clean_star(value: Any) -> str:
    return re.sub(r"（.*?）|\(.*?\)", "", str(value or "")).strip()

def stars_in_palace(palace: dict[str, Any]) -> list[str]:
    out: list[str] = []
    for key in STAR_KEYS:
        values = palace.get(key) or []
        if not isinstance(values, list):
            continue
        for value in values:
            star = clean_star(value)
            if star and star not in out:
                out.append(star)
    return out

def locate_star(star: str, palaces: list[dict[str, Any]]) -> dict[str, Any] | None:
    """按当前命盘实际星曜列表定位星曜，不把查询宫位误当成落宫。"""
    if not star:
        return None
    for palace in palaces:
        if star in stars_in_palace(palace):
            return palace
    return None

def get_gongzhu_meaning(source_palace: str, target_palace: str) -> dict[str, Any] | None:
    data = load_knowledge()
    source = normalize_palace(source_palace)
    target = normalize_palace(target_palace)
    return (data.get("gongzhu_into_palaces") or {}).get(source, {}).get(target)

def get_shenzhu_meaning(target_palace: str) -> dict[str, Any] | None:
    return (load_knowledge().get("shenzhu_into_palaces") or {}).get(normalize_palace(target_palace))

def analyze_palace(dizhi: str, palace: str, chart: dict[str, Any]) -> dict[str, Any]:
    """依据被双击宫位地支查宫主/身主，再查两星实际落宫并依Excel原文裁断。"""
    data = load_knowledge()
    branch = str(dizhi or "").strip().replace("宫", "")
    mapping = (data.get("dizhi_to_rulers") or {}).get(branch)
    palace_name = normalize_palace(palace)
    palaces = chart.get("palaces") or []
    if not mapping:
        return {"success": False, "title": "命主／身主裁断（Excel知识库）", "palace": palace_name, "dizhi": branch,
                "summary": f"地支“{branch or '未提供'}”不在 Excel 知识库中，无法匹配宫主／身主。", "sections": []}

    gongzhu, shenzhu = mapping["gongzhu"], mapping["shenzhu"]
    ruler_palace = locate_star(gongzhu, palaces)
    body_palace = locate_star(shenzhu, palaces)
    sections: list[dict[str, Any]] = []
    source_label=""
    # source_label = "《紫微斗数-命主身主.xlsx》Sheet1"

    def add_section(title: str, items: list[str], source_rows: Any = None, fallback: str | None = None):
        section = {"title": title, "items": items or ([fallback] if fallback else []), "source": source_label}
        if source_rows is not None:
            section["source_rows"] = source_rows
        if items or fallback:
            sections.append(section)

    # add_section("地支映射", [
    #     f"当前选择：{palace_name}（{branch}）。按 Excel 地支表，{branch}位对应宫主星：{gongzhu}；身主星：{shenzhu}。",
    #     "说明：上面是该地支对应的宫主／身主星；下文分别按当前命盘十二宫星曜列表核对两颗星实际落宫。",
    # ], source_rows={"dizhi_row": 18, "gongzhu_row": 20, "shenzhu_row": 25})

    # framework_items = [x['text'] for x in data.get('body_master_framework', []) if x.get('source_row') == 42]
    # if framework_items:
    #     add_section("身主星的资料定义", framework_items, source_rows=[42])

    if ruler_palace:
        landed_name = normalize_palace(ruler_palace.get("name") or ruler_palace.get("palace_name"))
        landed_branch = str(ruler_palace.get("dizhi") or "未载")
        entry = get_gongzhu_meaning(palace_name, landed_name)
        items = list((entry or {}).get("items", []))
        items.insert(0, f"命盘星曜列表显示：{gongzhu}实际位于{landed_name}（{landed_branch}）。")
        add_section(f"宫主星 {gongzhu} 实际落{landed_name}", items,
                    source_rows=(entry or {}).get("source_rows"),
                    fallback="Excel知识库中没有该来源宫主进入此落宫的独立条目，故不自行补写象义。")
    else:
        add_section(f"宫主星 {gongzhu} 落宫核对", [], fallback=f"当前命盘十二宫星曜列表中未找到{gongzhu}，无法确定它实际落在哪一宫；不将被双击宫位直接视作该星的落宫。")

    if body_palace:
        landed_name = normalize_palace(body_palace.get("name") or body_palace.get("palace_name"))
        landed_branch = str(body_palace.get("dizhi") or "未载")
        entry = get_shenzhu_meaning(landed_name) or {}
        items = list(entry.get("items", []))
        items.insert(0, f"命盘星曜列表显示：{shenzhu}实际位于{landed_name}（{landed_branch}）。")
        add_section(f"身主星 {shenzhu} 实际落{landed_name}", items,
                    source_rows=entry.get("source_rows"),
                    fallback="Excel的身主部分没有找到针对该落宫的独立条文。本节只报告星曜实际落宫，不借用其他宫位古诀。")
    else:
        add_section(f"身主星 {shenzhu} 落宫核对", [], fallback=f"当前命盘十二宫星曜列表中未找到{shenzhu}，无法确定它实际落在哪一宫。")

    # 命宫专属补充：按 Excel“斗数星曜配五行八卦12地支”先由命宫地支取宫主星，
    # 再以该宫主星连接“斗数星曜配五行八卦九星”；命卦简介仍按地支自身对应卦象查询。
    if palace_name == "命宫":
        extra = data.get("minggong_extra_sections") or {}
        nine_star_items = []
        nine_star_rows = []
        # “命坐八卦九星”不是匹配命宫当前坐守主星，而是命宫地支对应的宫主星所配九星。
        for row in extra.get("ming_zuo_bagua_jiuxing", []):
            if row.get("star") == gongzhu:
                nine_star_items.append(f"命宫地支{branch}对应宫主星：{gongzhu}；{row['star']}配九星：{row['nine_star']}。象义：{row['meaning']}")
                nine_star_rows.append(row.get("source_row"))
        if nine_star_items:
            add_section("命坐八卦九星", nine_star_items,
                        source_rows=[20, *nine_star_rows])
        else:
            add_section("命坐八卦九星", [],
                        source_rows=extra.get("source_rows", {}).get("命坐八卦九星"),
                        fallback=f"命宫地支{branch}对应宫主星为{gongzhu}，但 Excel“斗数星曜配五行八卦九星”中没有找到该星的配对条目；不以命宫实际坐守星曜替代。")

        branch_gua = str(mapping.get("gua") or "")
        gua_key = branch_gua[:2] if branch_gua else ""
        gua_entry = next((x for x in extra.get("minggua_jianjie", []) if x.get("gua") == gua_key), None)
        if gua_entry:
            add_section("命卦简介", [f"命宫地支{branch}在十二地支表中对应卦象：{branch_gua}。", gua_entry.get("meaning", "")],
                        source_rows=[19, gua_entry.get("source_row")])
        else:
            add_section("命卦简介", [], source_rows=extra.get("source_rows", {}).get("命卦简介"),
                        fallback=f"未能按 Excel 原表将命宫地支{branch}对应卦象“{branch_gua or '未识别'}”匹配到《命卦简介》条目。")

    # Excel 第848行的身主特别规则：仅在原文条件均满足时展示，不将其泛化到其他盘。
    if body_palace:
        body_landing_name = normalize_palace(body_palace.get('name') or body_palace.get('palace_name'))
        body_landing_branch = str(body_palace.get('dizhi') or '').strip()
        body_landing_map = (data.get('dizhi_to_rulers') or {}).get(body_landing_branch, {})
        special_rules = data.get('shenzhu_special_rules') or []
        if (mapping.get('gua') == '坤土' and body_landing_name == '命宫'
                and body_landing_map.get('gua') == '坤土'):
            for rule in special_rules:
                if rule.get('source_rows') == [848] and rule.get('availability') == 'explicit':
                    add_section('身主特别规则（原文条件匹配，第848行）', [
                        rule.get('interpretation', ''),
                        f"匹配条件：所选宫位地支卦象为{mapping.get('gua')}；{shenzhu}实际落命宫，命宫地支{body_landing_branch}对应卦象为{body_landing_map.get('gua')}。",
                        '本条只按 Excel 原文呈现“保守”象义，不外推其他判断。',
                    ], source_rows=rule.get('source_rows'))

    summary = (f"地支{branch}：宫主星{gongzhu}，身主星{shenzhu}；"
               f"宫主实际落宫：{normalize_palace(ruler_palace.get('name') or ruler_palace.get('palace_name')) if ruler_palace else '未找到'}；"
               f"身主实际落宫：{normalize_palace(body_palace.get('name') or body_palace.get('palace_name')) if body_palace else '未找到'}。"
               "")
    return {"success": True, "title": "命主／身主裁断（Excel知识库）", "palace": palace_name, "dizhi": branch,
            "gongzhu": gongzhu, "shenzhu": shenzhu,
            "gongzhu_landing": {"palace": normalize_palace(ruler_palace.get("name") or ruler_palace.get("palace_name")), "dizhi": ruler_palace.get("dizhi")} if ruler_palace else None,
            "shenzhu_landing": {"palace": normalize_palace(body_palace.get("name") or body_palace.get("palace_name")), "dizhi": body_palace.get("dizhi")} if body_palace else None,
            "summary": summary, "sections": sections, "source": source_label, "mapping": mapping}


def register_mingzhu_shenzhu_routes(app: Any) -> None:
    """Register a separate endpoint so the existing /api/sanhe/analyze remains backward compatible."""
    from flask import jsonify, request

    @app.post('/api/mingzhu-shenzhu/analyze')
    def api_analyze_mingzhu_shenzhu():
        try:
            payload = request.get_json(silent=True) or {}
            result = analyze_palace(
                dizhi=payload.get('dizhi', ''),
                palace=payload.get('palace', ''),
                chart=payload.get('chart') or {},
            )
            return jsonify(result), (200 if result.get('success') else 400)
        except Exception as exc:
            app.logger.exception('命主／身主裁断失败')
            return jsonify({
                'success': False,
                'title': '命主／身主裁断',
                'summary': f'命主／身主分析发生错误：{exc}',
                'sections': [],
            }), 500

    @app.get('/api/mingzhu-shenzhu/knowledge')
    def api_mingzhu_shenzhu_knowledge():
        try:
            kb = load_knowledge()
            return jsonify({
                'success': True,
                'source': kb.get('source'),
                'branch_order': kb.get('branch_order'),
                'dizhi_to_rulers': kb.get('dizhi_to_rulers'),
                'gongzhu_into_palaces': kb.get('gongzhu_into_palaces'),
                'shenzhu_into_palaces': kb.get('shenzhu_into_palaces'),
                'minggong_extra_sections': kb.get('minggong_extra_sections'),
            })
        except Exception as exc:
            app.logger.exception('命主／身主知识库读取失败')
            return jsonify({'success': False, 'message': str(exc)}), 500
