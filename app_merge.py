from pathlib import Path

# =========================
# 配置
# 请最终检查以下两个文件之间的整合性和联动性: Prompt.md zizhan_rules_full.md 注意:以上两个文件都存在于数据源中,不要搞错文件
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
    "32_MODULE_QIMEN_PLUGIN.md",
    "07_MODULE_FLOW_STATE_ENGINE.md",
    "08_MODULE_CONVERGENCE_PROTOCOL.md",
    "09_MODULE_CONVERGENCE_ENGINE.md",
    "29_MODULE_SPATIAL_CONVERGENCE_ENGINE.md",
    "26_MODULE_PATH_GRAVITY_ENGINE.md",
    "25_MODULE_RECURSION_LIMIT_PROTOCOL.md",
    "11_MODULE_5D_SCAN.md",
    "12_MODULE_OVERLAY_ENGINE.md",
    "34_MODULE_COMPOSITE_IMAGE_PROTOCOL.md",
    "13_MODULE_SCENE_MAPPING.md",
    "14_MODULE_REALITY_MAPPING_ENGINE.md",
    "28_MODULE_SPATIAL_FIELD_PROTOCOL.md",
    "15_MODULE_MINOR_STAR_LOGIC.md",
    "16_MODULE_MINOR_STAR_ENGINE.md",
    "17_MODULE_COST_ENGINE.md",
    "18_MODULE_TERMINAL_CAPACITY_ENGINE.md",
    "19_MODULE_PATH_PRIORITY_ENGINE.md",
    "33_MODULE_OVERRIDE_AUTHORITY_TREE.md",
    "20_MODULE_ENERGY_PRIORITY.md",
    "21_MODULE_STRATEGY_ENGINE.md",
    "10_MODULE_PATH_TREE.md",
    "27_MODULE_STRUCTURED_REASONING_PROTOCOL.md",
    "22_MODULE_OUTPUT_TEMPLATE.md",
    "23_MODULE_SELF_CHECK.md",
]
# 30 31 32 对象外部文件,不参与合并,但需要保留在数据源中


INPUT_DIR = "md2"
OUTPUT_FILE = "./md2/zizhan_rules_full.md"
FILE_LIST = [
    "00_GLOBAL_PREAMBLE.md",
    "10_MODE_CORE_AND_STAR_MODEL.md",
    "11_ROLE_MAPPING_PROTOCOL.md",
    "20_FIELD_LAYER_AND_MANIFEST.md",
    "30_CAUSAL_PATH_AND_TRACE.md",
    "40_SCAN_OVERLAY_AND_COMPOSITE.md",
    "50_FLOW_CONVERGENCE_AND_TERMINAL.md",
    "60_REALITY_SCENE_AND_SPATIAL.md",
    "70_MINOR_STAR_AND_COST.md",
    "80_PRIORITY_ENERGY_RANK_AND_STRATEGY.md",
    "85_STRUCTURED_REASONING_AND_COMPRESSION.md",
    "90_OUTPUT_FORMAT.md",
    "99_SELF_CHECK.md"
]

INPUT_DIR = ""
OUTPUT_FILE = "./协议/紫占.md"
FILE_LIST = [
    "协议/01_定义层.md",
    "协议/02_裁断层.md",
    "协议/03_专项协议层.md",
    "协议/04_输出层.md",
    "协议/05_质检层.md",
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
        outfile.write(f"\n\n")

print(f"\n完成 -> {OUTPUT_FILE}")
