import os

MODULE_PATH = "./modules"

class ModuleLoader:
    def __init__(self):
        self.cache = {}

    def load(self, module_name: str) -> str:
        if module_name in self.cache:
            return self.cache[module_name]

        file_path = os.path.join(MODULE_PATH, f"{module_name}.txt")

        if not os.path.exists(file_path):
            raise ValueError(f"模块缺失: {module_name}")

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.cache[module_name] = content
        return content