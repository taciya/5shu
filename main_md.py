from engine.prompt_builder import PromptBuilder
from engine.executor import Executor

def detect_modules(user_input: str):
    """
    👉 简单规则（可升级为AI判断）
    """

    modules = [
        "MODULE_CORE_PROTOCOL",
        "MODULE_PATH_ENGINE",
        "MODULE_5D_SCAN",
        "MODULE_SCENE_MAPPING",
        "MODULE_MINOR_STAR_LOGIC",
        "MODULE_MINOR_STAR_ENGINE",
        "MODULE_ENERGY_PRIORITY",
        "MODULE_OUTPUT_TEMPLATE",
        "MODULE_SELF_CHECK"
    ]

    # 命理模式额外模块
    if "命" in user_input or "运" in user_input:
        modules.append("MODULE_STRATEGY_ENGINE")

    return modules


def main():
    user_input = input("请输入问题：")

    modules = detect_modules(user_input)

    builder = PromptBuilder()
    prompt = builder.build(modules, user_input)

    executor = Executor()
    result = executor.run(prompt)

    print("\n===== 解卦结果 =====\n")
    print(result)


if __name__ == "__main__":
    main()