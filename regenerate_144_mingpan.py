#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""不依赖旧 CSV，使用项目真实 ZiweiChart 引擎生成 144 个唯一命盘。

生成：
  1. mingpanData.json（追加或替换 144 个示例命盘）
  2. 144_紫微斗数命盘时刻.csv（从最终选定的 144 张命盘反向生成）

请把本脚本放在项目源码目录中运行，确保 main.py 依赖的模块可导入。
建议先运行：
  python regenerate_144_mingpan.py --dry-run
再正式运行：
  python regenerate_144_mingpan.py --replace-existing
"""
import argparse
import csv
import json
import os
import shutil
import sys
from datetime import datetime, timedelta
from pathlib import Path

try:
    from main import ZiweiChart
except Exception as import_exc:
    raise SystemExit(
        "无法导入项目排盘引擎 ZiweiChart。请确认本脚本与 main.py 在同一源码目录，"
        "且 utils.py、qimen_runtime_engine.py 等依赖齐全。"
        f"原始错误：{type(import_exc).__name__}: {import_exc}"
    ) from import_exc

BRANCHES = list("子丑寅卯辰巳午未申酉戌亥")
DEFAULT_CSV = Path(__file__).with_name("144_紫微斗数命盘时刻.csv")
DEFAULT_JSON = Path.home() / "mingpanData.json"
CSV_FIELDS = [
    "紫微所在宫", "命宫所在宫", "公历日期", "北京时间", "农历日期(算法核对)",
    "时支", "五行局", "命宫主星(校验)"
]


def chart_positions(chart):
    """只从引擎实际排盘结果定位紫微所在宫和命宫所在宫。"""
    ziwei_branch = ming_branch = None
    ming_palace = None
    for palace in chart.palaces:
        if "紫微" in (getattr(palace, "main_stars", None) or []):
            ziwei_branch = palace.dizhi
        # constants.py 中命宫名称可能是“命  宫”（含空格），必须先去除所有空白再比较。
        palace_name = "".join(str(getattr(palace, "palace_name", "") or "").split())
        if palace_name == "命宫":
            ming_branch = palace.dizhi
            ming_palace = palace
    if ziwei_branch not in BRANCHES or ming_branch not in BRANCHES:
        raise ValueError(f"无法定位宫位：紫微={ziwei_branch!r}，命宫={ming_branch!r}")
    return ziwei_branch, ming_branch, ming_palace


def build_chart(dt, gender):
    chart = ZiweiChart(dt.year, dt.month, dt.day, dt.hour, dt.minute, gender)
    z, m, ming_palace = chart_positions(chart)
    return chart, z, m, ming_palace


def hour_branch(hour, minute):
    """按常用时辰区间换算；23:00-00:59 为子时。"""
    total = hour * 60 + minute
    if total >= 23 * 60 or total < 60:
        return "子"
    # 丑时 01:00-02:59，寅时 03:00-04:59，依次类推
    idx = ((total - 60) // 120 + 1) % 12
    return BRANCHES[idx]


def main_star_check(palace):
    stars = getattr(palace, "main_stars", None) or []
    return "、".join(stars) if stars else "无主星"


def discover_charts(start_date, max_days, gender):
    """从日期和时辰网格开始搜索；绝不读取旧 CSV 作为输入。"""
    targets = {(z, m) for z in BRANCHES for m in BRANCHES}
    found = {}
    errors = 0
    error_samples = []
    # 取各时辰中点，避开 2 小时交界；子时同时测 00:30 和 23:30。
    # 子：23:30、00:30；丑：02:30；寅：04:30……亥：22:30。
    times = [(0, 30), (2, 30), (4, 30), (6, 30), (8, 30), (10, 30),
             (12, 30), (14, 30), (16, 30), (18, 30), (20, 30), (22, 30), (23, 30)]
    start = datetime.strptime(start_date, "%Y-%m-%d")
    for offset in range(max_days):
        day = start + timedelta(days=offset)
        for hour, minute in times:
            dt = day.replace(hour=hour, minute=minute)
            try:
                chart, z, m, ming_palace = build_chart(dt, gender)
                key = (z, m)
                if key not in found:
                    found[key] = (dt, chart, z, m, ming_palace)
            except Exception as exc:
                errors += 1
                if len(error_samples) < 10:
                    error_samples.append(f"{dt:%Y-%m-%d %H:%M}: {type(exc).__name__}: {exc}")
                if errors <= 5:
                    print(f"提示：跳过无法排盘的时间 {dt:%Y-%m-%d %H:%M}：{type(exc).__name__}: {exc}", file=sys.stderr)
            if len(found) == 144:
                print(f"已找到 144/144 个唯一组合，搜索日期截至 {dt:%Y-%m-%d %H:%M}。")
                return found
        if (offset + 1) % 100 == 0:
            print(f"搜索进度：{offset + 1}/{max_days} 天；唯一组合 {len(found)}/144")
    missing_pairs = sorted(
        targets - set(found), key=lambda p: (BRANCHES.index(p[0]), BRANCHES.index(p[1]))
    )
    missing = [f"紫微在{z}-命宫在{m}" for z, m in missing_pairs]
    ziwei_coverage = sorted({z for z, _ in found}, key=BRANCHES.index)
    ming_coverage = sorted({m for _, m in found}, key=BRANCHES.index)
    print(f"紫微所在宫覆盖：{len(ziwei_coverage)}/12（{'、'.join(ziwei_coverage)}）", file=sys.stderr)
    print(f"命宫所在宫覆盖：{len(ming_coverage)}/12（{'、'.join(ming_coverage)}）", file=sys.stderr)
    raise RuntimeError(
        f"搜索 {max_days} 天后只找到 {len(found)}/144 个组合。缺少：{'、'.join(missing)}。\n"
        "可继续增加 --max-days；若多轮搜索仍缺少同一批组合，应检查排盘引擎的命宫/紫微安星逻辑。\n"
        "本次未写入任何输出文件。"
    )


def lunar_date_text(chart):
    info = getattr(chart, "lunar_info", {}) or {}
    # 优先使用项目返回的农历年月日字段，兼容常见命名。
    year = info.get("year_lunar")
    month = info.get("month_lunar")
    day = info.get("day_lunar")
    if year is not None and month is not None and day is not None:
        return f"{year}年{month}月{day}日"
    for key in ("lunar_date", "date_lunar", "农历日期"):
        if info.get(key):
            return str(info[key])
    # 不伪造农历结果；标注为引擎未提供。
    return "引擎未提供"


def csv_row(record):
    dt, chart, z, m, ming_palace = record
    info = getattr(chart, "lunar_info", {}) or {}
    return {
        "紫微所在宫": z,
        "命宫所在宫": m,
        "公历日期": dt.strftime("%Y-%m-%d"),
        "北京时间": dt.strftime("%H:%M"),
        "农历日期(算法核对)": lunar_date_text(chart),
        "时支": hour_branch(dt.hour, dt.minute),
        "五行局": getattr(chart, "wuxingju", "") or "",
        "命宫主星(校验)": main_star_check(ming_palace),
    }


def item_for_chart(record, new_id, device_id, now, gender):
    dt, chart, z, m, _ = record
    name = f"紫微在{z}-命宫在{m}"
    chart_data = json.loads(chart.to_json144())
    data = {
        "name": name,
        "birthTime": dt.strftime("%Y-%m-%d %H:%M"),
        "gender": gender,
        "birthPlace": "北京",
        "natalTime": "",
        "birthYear": dt.year,
        "birthMonth": dt.month,
        "birthDay": dt.day,
        "birthHour": dt.hour,
        "birthMinute": dt.minute,
        "deviceId": device_id,
        "deviceType": "pc",
        "saveTime": now,
        **chart_data,
        "sampleMeta": {"ziweiPalace": z, "mingPalace": m, "sourceEngine": "ZiweiChart"},
    }
    return {
        "id": new_id,
        "category": f"紫微在{z}",
        "name": name,
        "data": data,
        "timestamp": now.replace("T", " ")[:19],
        "device_info": {"device_id": device_id, "device_type": "pc", "save_time": now},
    }


def write_csv(csv_path, rows):
    """写入指定的临时/正式路径；调用方负责原子替换。"""
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description="不依赖旧 CSV，生成真实排盘验证的 144 个命盘及其时刻 CSV")
    parser.add_argument("--csv", default=str(DEFAULT_CSV), help="反向生成的 CSV 输出路径，不会读取此文件")
    parser.add_argument("--data-file", default=str(DEFAULT_JSON), help="mingpanData.json 路径")
    parser.add_argument("--start-date", default="1979-05-27", help="开始搜索日期 YYYY-MM-DD")
    parser.add_argument("--max-days", type=int, default=200000, help="最多搜索天数，默认约 548 年；可用 --max-days 300000 继续扩大")
    parser.add_argument("--device-id", default="ziwei144-engine-import", help="设备标识")
    parser.add_argument("--gender", choices=["male", "female"], default="male", help="生成命盘性别")
    parser.add_argument("--dry-run", action="store_true", help="只搜索和验证，不写入 JSON/CSV")
    parser.add_argument("--replace-existing", action="store_true", help="替换 JSON 中已有同名命盘")
    args = parser.parse_args()
    if args.max_days < 1:
        raise ValueError("--max-days 必须大于 0")

    csv_path = Path(args.csv).expanduser().resolve()
    data_path = Path(args.data_file).expanduser().resolve()

    # 单盘烟雾测试：引擎若连一张都排不出，立即报出真实异常，不做长时间搜索。
    smoke_dt = datetime.strptime(args.start_date, "%Y-%m-%d").replace(hour=12, minute=30)
    try:
        smoke_chart, smoke_z, smoke_m, _ = build_chart(smoke_dt, args.gender)
        print(f"单盘烟雾测试通过：{smoke_dt:%Y-%m-%d %H:%M}，紫微在{smoke_z}，命宫在{smoke_m}，五行局={smoke_chart.wuxingju}")
    except Exception as exc:
        raise RuntimeError(
            "排盘引擎单盘烟雾测试失败；未开始搜索，也未写入任何输出文件。"
            f"测试时刻={smoke_dt:%Y-%m-%d %H:%M}；错误={type(exc).__name__}: {exc}"
        ) from exc

    # 旧 CSV 仅作为输出目标，绝不读取。
    found = discover_charts(args.start_date, args.max_days, args.gender)
    expected = {f"紫微在{z}-命宫在{m}" for z in BRANCHES for m in BRANCHES}
    names = {f"紫微在{z}-命宫在{m}" for z, m in found}
    if len(found) != 144 or names != expected:
        raise RuntimeError("内部完整性校验失败：必须是 144 个唯一组合；未写入任何输出文件。")

    # CSV 内容先在内存中生成并校验，保证输出前即已完整。
    ordered_records = sorted(found.values(), key=lambda r: (BRANCHES.index(r[2]), BRANCHES.index(r[3])))
    csv_rows = [csv_row(record) for record in ordered_records]
    csv_keys = {(r["紫微所在宫"], r["命宫所在宫"]) for r in csv_rows}
    if len(csv_rows) != 144 or csv_keys != {(z, m) for z in BRANCHES for m in BRANCHES}:
        raise RuntimeError("写入前 CSV 数据完整性校验失败；未写入任何输出文件。")

    now = datetime.now().astimezone().isoformat(timespec="seconds")
    if data_path.exists():
        with open(data_path, "r", encoding="utf-8") as f:
            store = json.load(f)
        if not isinstance(store, dict) or not isinstance(store.get("items"), list):
            raise ValueError(f"{data_path} 格式不符合 {{'items': [...]}}")
    else:
        store = {"items": []}

    items = store["items"]
    existing = {x.get("name"): x for x in items if isinstance(x, dict) and x.get("name")}
    max_id = max((int(x.get("id", 0)) for x in items if isinstance(x, dict)), default=0)
    planned = []
    replacements = {}
    skipped = 0
    for key in sorted(found, key=lambda p: (BRANCHES.index(p[0]), BRANCHES.index(p[1]))):
        record = found[key]
        name = f"紫微在{key[0]}-命宫在{key[1]}"
        old = existing.get(name)
        if old and not args.replace_existing:
            skipped += 1
            continue
        if old:
            replacements[name] = item_for_chart(record, int(old.get("id", 0)), args.device_id, now, args.gender)
        else:
            max_id += 1
            planned.append(item_for_chart(record, max_id, args.device_id, now, args.gender))

    if args.dry_run:
        print("引擎验证通过：144/144 个唯一组合。")
        print(f"CSV 将从这 144 张最终命盘生成：{csv_path}")
        print(f"JSON 目标：{data_path}；预计新增 {len(planned)}、替换 {len(replacements)}、跳过 {skipped}。")
        print("dry-run 模式：未写入 JSON 或 CSV。")
        return

    # 先准备 JSON 内容并校验，最后才写两个输出文件。
    new_items = []
    for old in items:
        if isinstance(old, dict) and old.get("name") in replacements:
            new_items.append(replacements[old["name"]])
        else:
            new_items.append(old)
    new_items.extend(planned)
    store["items"] = new_items
    saved_names = {x.get("name") for x in new_items if isinstance(x, dict)}
    missing = expected - saved_names
    if missing:
        raise RuntimeError("写入前 JSON 完整性校验失败，缺少：" + "、".join(sorted(missing)))

    data_path.parent.mkdir(parents=True, exist_ok=True)
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    json_temp = data_path.with_suffix(data_path.suffix + ".tmp")
    csv_temp = csv_path.with_suffix(csv_path.suffix + ".tmp")

    # 两个临时文件先全部生成并校验，通过后才替换正式文件。
    try:
        with open(json_temp, "w", encoding="utf-8") as f:
            json.dump(store, f, ensure_ascii=False, indent=2)
            f.write("\n")
        write_csv(csv_temp, csv_rows)
        with open(json_temp, "r", encoding="utf-8") as f:
            json.load(f)
        with open(csv_temp, "r", encoding="utf-8-sig", newline="") as f:
            check_rows = list(csv.DictReader(f))
        check_keys = {(r["紫微所在宫"], r["命宫所在宫"]) for r in check_rows}
        expected_pairs = {(z, m) for z in BRANCHES for m in BRANCHES}
        if len(check_rows) != 144 or check_keys != expected_pairs:
            raise RuntimeError(
                f"临时 CSV 校验失败：行数={len(check_rows)}，唯一组合={len(check_keys)}；正式文件未替换。"
            )
        if data_path.exists():
            backup = data_path.with_suffix(
                data_path.suffix + "." + datetime.now().strftime("%Y%m%d_%H%M%S") + ".bak"
            )
            shutil.copy2(data_path, backup)
            print(f"JSON 原文件备份：{backup}")
        os.replace(json_temp, data_path)
        os.replace(csv_temp, csv_path)
    except Exception:
        for temp_path in (json_temp, csv_temp):
            try:
                temp_path.unlink(missing_ok=True)
            except OSError:
                pass
        raise
    print("完成：真实排盘引擎 144/144 组合校验通过。")
    print(f"JSON：{data_path}")
    print(f"CSV（由最终 144 盘反向生成）：{csv_path}")
    print(f"新增 {len(planned)}、替换 {len(replacements)}、跳过 {skipped}。")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"失败：{exc}", file=sys.stderr)
        sys.exit(1)
