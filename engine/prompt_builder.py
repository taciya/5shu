from engine.module_loader import ModuleLoader

BASE_PROMPT = """
你是【紫占AI引擎】。

必须严格执行流程：
1. 模式识别
2. 模块加载声明
3. 结构建立
4. 五维扫描
5. 四化路径
6. 小星计算
7. 综合裁断

规则：
- 飞四化是唯一因果
- 禁止抽象
- 必须包含小星成本
"""

class PromptBuilder:
    def __init__(self):
        self.loader = ModuleLoader()

    def build(self, module_list: list, user_input: str) -> str:
        modules_text = ""

        for m in module_list:
            content = self.loader.load(m)
            modules_text += f"\n\n【{m}】\n{content}\n"

        final_prompt = f"""
{BASE_PROMPT}

【加载模块】
{",".join(module_list)}

{modules_text}

【用户问题】
{user_input}
"""
        return final_prompt