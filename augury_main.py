from augury_knowledge import ZiWeiKnowledgeBase, Brightness
from augury_combinations import ZiWeiCombinationProcessor

def main():
    """主程序"""
    # 初始化知识库
    knowledge_base = ZiWeiKnowledgeBase()
    
    # 尝试解析Excel文件
    knowledge_base.parse_excel_data("紫占-星曜.xlsx")
    
    # 如果解析失败，加载默认知识库
    if not knowledge_base.stars_data:
        knowledge_base._load_default_knowledge()
    
    # 初始化处理器
    processor = ZiWeiCombinationProcessor(knowledge_base)
    
    # 处理组合文件
    input_file = "紫占-组合.xlsx"
    output_file = "紫占组合象义结果.xlsx"
    
    result = processor.process_combinations_file(input_file, output_file)
    
    if result is not None:
        print("处理成功！")
        print(f"生成了 {len(result)} 行数据")
        print(f"包含 {result['场景维度'].nunique()} 个场景维度")
        print(f"处理了 {result['星曜组合'].nunique()} 个星曜组合")
    else:
        print("处理失败！")

# 单独的知识库导出功能
def export_knowledge_base(knowledge_base: ZiWeiKnowledgeBase, output_file: str):
    """导出知识库为常量定义"""
    import json
    
    knowledge_dict = {
        "stars": {},
        "scenarios": list(knowledge_base.scenario_categories),
        "brightness_rules": knowledge_base.brightness_rules
    }
    
    # 收集所有星曜数据
    for star in knowledge_base.get_all_stars():
        star_data = {}
        for scenario in knowledge_base.scenario_categories:
            scenario_data = {}
            for brightness in Brightness:
                meaning = knowledge_base.get_star_meaning(star, scenario, brightness)
                if "暂无" not in meaning:
                    scenario_data[brightness.value] = meaning
            if scenario_data:
                star_data[scenario] = scenario_data
        
        if star_data:
            knowledge_dict["stars"][star] = star_data
    
    # 保存为JSON文件
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(knowledge_dict, f, ensure_ascii=False, indent=2)
    
    print(f"知识库已导出到: {output_file}")

if __name__ == "__main__":
    # main()
    
    # 可选：导出知识库
    knowledge_base = ZiWeiKnowledgeBase()
    knowledge_base.parse_excel_data("紫占-星曜.xlsx")
    export_knowledge_base(knowledge_base, "ziwei_knowledge_base.json")