from typing import List, Dict, Any
from collections import defaultdict

# =========================
# 1. 规则库（可扩展）
# =========================
def build_rule_db(file_path: str) -> Dict[str, Any]:
  import json
  with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f,)
  
  return data

# =========================
# 2. 数据结构
# =========================
class Edge:
    def __init__(self, from_node: str, to_node: str, transform: str):
        self.from_node = from_node
        self.to_node = to_node
        self.transform = transform

    def key(self):
        return f"{self.from_node}→{self.to_node}"


class SelfTransform:
    def __init__(self, node: str, transform: str):
        self.node = node
        self.transform = transform


# =========================
# 3. 核心引擎
# =========================
class ZiWeiEngine:

    def __init__(self, edges: List[Edge], selfs: List[SelfTransform]):
        self.edges = edges
        self.selfs = selfs
        self.rule_db = build_rule_db("rule_db.json")

    # -------- 合法性过滤 --------
    def filter_valid_edges(self):
        # 这里只做最基本过滤，可扩展
        return self.edges

    # -------- 规则匹配 --------
    def match_rule(self, edge: Edge):
        key = edge.key()
        key=self.normalize_palace(key)  # 标准化宫位名称
        if key not in self.rule_db:
            return None

        rule_set = self.rule_db[key]
        if edge.transform not in rule_set:
            return None

        return rule_set[edge.transform]

    # -------- 会合修正 --------
    def apply_modifiers(self, edge: Edge, rule: Dict):
        result = list(rule["base"])

        # 找同一目标宫的其他飞化
        same_target = [e for e in self.edges if e.to_node == edge.to_node and e != edge]

        for e in same_target:
            if e.transform in rule.get("mod", {}):
                result.append(f"（叠加：{rule['mod'][e.transform]}）")

        return result

    # -------- 自化影响 --------
    def apply_self_effect(self, edge: Edge, meanings: List[str]):
        for s in self.selfs:
            if s.node == edge.from_node:
                if s.transform == "忌":
                    meanings.append("（自化忌：内耗/反复）")
                elif s.transform == "禄":
                    meanings.append("（自化禄：随性削弱执行）")
        return meanings
    
 
    # -------- 主分析 --------
    def analyze(self):
        edges = self.filter_valid_edges()
        results = []

        for edge in edges:
            rule = self.match_rule(edge)

            if not rule:
                continue

            meanings = self.apply_modifiers(edge, rule)
            meanings = self.apply_self_effect(edge, meanings)

            results.append({
                "path": edge.key(),
                "transform": edge.transform,
                "meanings": meanings
            })

        return self.aggregate(results)

    # -------- 聚合输出 --------
    def aggregate(self, results):
        summary = []
        for r in results:
            summary.extend(r["meanings"])

        return {
            "details": results,
            "final": list(set(summary))
        }


# =========================
# 4. 示例运行
# =========================
if __name__ == "__main__":

    edges = [
        Edge("命宫", "财帛宫", "忌"),
        Edge("财帛宫", "事业宫", "权"),
        Edge("命宫", "事业宫", "忌"),
        Edge("命宫", "命宫", "禄")
    ]

    selfs = [
        # SelfTransform("命宫", "禄")
    ]

    engine = ZiWeiEngine(edges, selfs)
    result = engine.analyze()

    print("=== 详细推理 ===")
    for item in result["details"]:
        print(item)

    print("\n=== 最终结论 ===")
    print(result["final"])