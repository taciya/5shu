from pathlib import Path

# =========================
# 配置
# =========================

# 文本文件所在目录
INPUT_DIR = "md"

# 输出文件
OUTPUT_FILE = "./md/zizhan_rules_full.md"

# 指定文件列表
FILE_LIST = [
    "00_SYSTEM_ROOT_LOCK.md",
    "01_MODULE_CORE_PROTOCOL.md",
    "02_MODULE_CAUSAL_PROTOCOL.md",
    "03_MODULE_TRACE_ONLY_PROTOCOL.md",
    "04_MODULE_MANIFEST_LAYER_PROTOCOL.md",
    "05_MODULE_LAYER_PRIORITY.md",
    "24_MODULE_DYNAMIC_ACTIVATION_ENGINE.md",
    "06_MODULE_PATH_ENGINE.md",
    "07_MODULE_FLOW_STATE_ENGINE.md",
    "08_MODULE_CONVERGENCE_PROTOCOL.md",
    "09_MODULE_CONVERGENCE_ENGINE.md",
    "26_MODULE_PATH_GRAVITY_ENGINE.md",
    "25_MODULE_RECURSION_LIMIT_PROTOCOL.md",
    "11_MODULE_5D_SCAN.md",
    "12_MODULE_OVERLAY_ENGINE.md",
    "13_MODULE_SCENE_MAPPING.md",
    "14_MODULE_REALITY_MAPPING_ENGINE.md",
    "15_MODULE_MINOR_STAR_LOGIC.md",
    "16_MODULE_MINOR_STAR_ENGINE.md",
    "17_MODULE_COST_ENGINE.md",
    "18_MODULE_TERMINAL_CAPACITY_ENGINE.md",
    "19_MODULE_PATH_PRIORITY_ENGINE.md",
    "20_MODULE_ENERGY_PRIORITY.md",
    "21_MODULE_STRATEGY_ENGINE.md",
    "10_MODULE_PATH_TREE.md",
    "22_MODULE_OUTPUT_TEMPLATE.md",
    "23_MODULE_SELF_CHECK.md",
]

# =========================
# merge
# =========================

input_path = Path(INPUT_DIR)

with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:

    for filename in FILE_LIST:

        file_path = input_path / filename

        # 文件不存在时跳过
        if not file_path.exists():
            print(f"文件不存在: {filename}")
            continue

        print(f"合并: {filename}")

        with open(file_path, "r", encoding="utf-8") as infile:
            content = infile.read()


        # 写入正文
        outfile.write(content)

        # 写入分隔标题（可删）
        outfile.write(f"\n\n\n\n")

print(f"\n完成 -> {OUTPUT_FILE}")
