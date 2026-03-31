import pandas as pd
import re
from typing import Dict, List, Set, Tuple
from dataclasses import dataclass
from enum import Enum

class Brightness(Enum):
    """星曜亮度枚举"""
    TEMPLE = "庙旺"      # 庙
    PROSPEROUS = "旺"   # 旺
    HARMONY = "平和"     # 得地
    WEAK = "落陷"       # 落陷

@dataclass
class StarProperty:
    """星曜属性"""
    star_name: str
    scenario: str
    brightness: Brightness
    ziwei_meaning: str  # 紫占核心象义
    doushu_meaning: str = ""  # 斗数补充象义
    combination_effect: str = ""  # 组合影响

class ZiWeiKnowledgeBase:
    """紫微斗数知识库"""
    
    def __init__(self):
        self.stars_data = {}  # 星曜基础数据
        self.brightness_rules = {}  # 亮度规则
        self.combination_patterns = {}  # 组合模式
        self.scenario_categories = set()  # 场景维度
    def parse_excel_data(self, file_path: str):
        """解析Excel文件数据"""
        try:
            df = pd.read_excel(file_path, sheet_name=None, header=[0,1,2])  # 多级表头支持

            # 解析星曜属性（主星+吉凶星）
            for sheet_name in df.keys():
                if "主星" in sheet_name or "吉凶星" in sheet_name or "小星" in sheet_name:
                    for _, row in df[sheet_name].iterrows():
                        if pd.isna(row[('星曜名称', '', '')]):
                            continue
                        star_name = row[('星曜名称', '', '')]
                        scenario = row[('场景维度', '', '')]
                        
                        # 初始化星曜数据
                        for brightness in Brightness:
                            col = (f"{brightness.value}象义", "", "")
                            if col in row and not pd.isna(row[col]):
                                property = StarProperty(
                                    star_name=star_name,
                                    scenario=scenario,
                                    brightness=brightness,
                                    ziwei_meaning=row[col],
                                    doushu_meaning=row.get(('斗数补充', '', ''), ''),
                                    combination_effect=row.get(('组合影响', '', ''), '')
                                )
                                key = f"{star_name}_{scenario}_{brightness.value}"
                                self.stars_data[key] = property

            # 解析亮度规则（单独表格）
            brightness_df = df.get("亮度规则", pd.DataFrame())
            for _, row in brightness_df.iterrows():
                star_name = row['星曜名称']
                rules = {}
                for brightness in Brightness:
                    col = f"{brightness.value}规则"
                    if col in row and not pd.isna(row[col]):
                        rules[brightness] = row[col]
                self.brightness_rules[star_name] = rules

            # 解析组合模式（单独表格）
            combination_df = df.get("组合模式", pd.DataFrame())
            for _, row in combination_df.iterrows():
                stars = tuple(sorted(row['星曜组合'].split(',')))
                effect = row['组合效应']
                scenario = row['适用场景']
                conditions = row.get('条件', '')
                self.combination_patterns[stars] = {
                    'effect': effect,
                    'scenario': scenario,
                    'conditions': conditions
                }

            print(f"知识库加载完成: {len(self.stars_data)} 个星曜, {len(self.scenario_categories)} 个场景维度")

        except Exception as e:
            print(f"解析Excel文件错误: {e}")
            self._load_default_knowledge()        
    # def parse_excel_data(self, file_path: str):
    #     """解析Excel文件数据"""
    #     try:
    #         # 读取Excel文件
    #         df = pd.read_excel(file_path)
            
    #         # 解析星曜数据
    #         self._parse_star_properties(df)
    #         self._parse_brightness_rules(df)
    #         self._parse_combination_patterns(df)
            
    #         print(f"知识库加载完成: {len(self.stars_data)} 个星曜, {len(self.scenario_categories)} 个场景维度")
            
    #     except Exception as e:
    #         print(f"解析Excel文件错误: {e}")
    #         # 可以在这里添加手动定义的数据作为备选
    #         self._load_default_knowledge()
    
    def _parse_star_properties(self, df: pd.DataFrame):
        """解析星曜属性"""
        # 假设Excel结构：星曜名称 | 场景维度 | 庙旺象义 | 落陷象义 | 斗数补充
        for _, row in df.iterrows():
            star_name = row['星曜名称']
            scenario = row['场景维度']
            
            # 添加到场景分类
            self.scenario_categories.add(scenario)
            
            # 解析不同亮度的象义
            for brightness in Brightness:
                brightness_col = f"{brightness.value}象义"
                if brightness_col in df.columns and pd.notna(row[brightness_col]):
                    property = StarProperty(
                        star_name=star_name,
                        scenario=scenario,
                        brightness=brightness,
                        ziwei_meaning=row[brightness_col],
                        doushu_meaning=row.get('斗数补充', '')
                    )
                    
                    key = f"{star_name}_{scenario}_{brightness.value}"
                    self.stars_data[key] = property
    
    def _parse_brightness_rules(self, df: pd.DataFrame):
        """解析亮度规则"""
        # 解析亮度影响规则
        brightness_df = df[df['类型'] == '亮度规则']  # 假设有专门的亮度规则表
        
        for _, row in brightness_df.iterrows():
            star_name = row['星曜名称']
            rules = {}
            
            for brightness in Brightness:
                if pd.notna(row.get(brightness.value)):
                    rules[brightness] = row[brightness.value]
            
            self.brightness_rules[star_name] = rules
    
    def _parse_combination_patterns(self, df: pd.DataFrame):
        """解析组合模式"""
        # 解析星曜组合的特殊效应
        combination_df = df[df['类型'] == '组合模式']
        
        for _, row in combination_df.iterrows():
            stars = tuple(sorted(row['星曜组合'].split(',')))
            self.combination_patterns[stars] = {
                'effect': row['组合效应'],
                'scenario': row['适用场景'],
                'conditions': row.get('条件', '')
            }
    
    def _load_default_knowledge(self):
        """加载默认知识库（当Excel解析失败时使用）"""
        print("加载默认知识库...")
        
        # 这里可以硬编码一些核心的星曜知识
        default_data = {
            # 14主星基础定义
            "紫微星": {
                "根本属性": "尊贵/重要/唯一",
                "财富资产": "核心资产、权威财富",
                "感情婚姻": "唯一配偶、要求专一",
                "身体健康": "重要器官疾病",
                "职场事业": "权威岗位、管理职位"
            },
            "天机星": {
                "根本属性": "动/道/机",
                "财富资产": "流动资金、短线投资", 
                "感情婚姻": "多变关系、机械表现",
                "身体健康": "神经系统、思维速度",
                "职场事业": "动态岗位、技术分析"
            }
            # ... 其他星曜定义
        }
        
        # 将默认数据转换为标准格式
        for star_name, scenarios in default_data.items():
            for scenario, meaning in scenarios.items():
                for brightness in Brightness:
                    key = f"{star_name}_{scenario}_{brightness.value}"
                    self.stars_data[key] = StarProperty(
                        star_name=star_name,
                        scenario=scenario,
                        brightness=brightness,
                        ziwei_meaning=f"{meaning}（{brightness.value}时）"
                    )
        
        self.scenario_categories = set(default_data[next(iter(default_data))].keys())
    
    def get_star_meaning(self, star_name: str, scenario: str, brightness: Brightness) -> str:
        """获取特定星曜在特定场景和亮度下的象义"""
        key = f"{star_name}_{scenario}_{brightness.value}"
        
        if key in self.stars_data:
            prop = self.stars_data[key]
            meaning = prop.ziwei_meaning
            if prop.doushu_meaning:
                meaning += f"（斗数: {prop.doushu_meaning}）"
            return meaning
        
        return f"{star_name}在{scenario}暂无{brightness.value}象义"
    
    def get_combination_effect(self, stars: List[str], scenario: str) -> str:
        """获取星曜组合的特殊效应"""
        sorted_stars = tuple(sorted(stars))
        
        if sorted_stars in self.combination_patterns:
            pattern = self.combination_patterns[sorted_stars]
            if scenario in pattern['scenario'] or pattern['scenario'] == '全部':
                return pattern['effect']
        
        return ""
    
    def get_all_scenarios(self) -> List[str]:
        """获取所有场景维度"""
        return sorted(list(self.scenario_categories))
    
    def get_all_stars(self) -> List[str]:
        """获取所有星曜名称"""
        stars = set()
        for key in self.stars_data.keys():
            star_name = key.split('_')[0]
            stars.add(star_name)
        return sorted(list(stars))

# 知识库常量定义（可以作为独立的配置文件）
DEFAULT_KNOWLEDGE_BASE = {
    "brightness_effects": {
        "庙旺": "能量最强，正面特质显著",
        "旺": "能量较强，正面特质明显", 
        "平和": "能量平稳，特质正常发挥",
        "落陷": "能量最弱，负面特质显现"
    },
    
    "core_stars_meaning": {
        "紫微星": {
            "description": "紫微属土，核心定义为「尊贵/重要/唯一」",
            "scenarios": {
                "财富资产": "核心资产、权威财富、垄断性收入",
                "感情婚姻": "唯一配偶、要求专一、权威型关系",
                "身体健康": "重要器官疾病、头部问题",
                "职场事业": "权威岗位、管理职位、决策核心"
            }
        },
        "天机星": {
            "description": "天机属木，核心定义为「动/道/机」",
            "scenarios": {
                "财富资产": "流动资金、短线投资、道路财",
                "感情婚姻": "多变关系、机械表现、道路坎坷",
                "身体健康": "神经系统、思维速度、通道系统",
                "职场事业": "动态岗位、技术分析、天道职业"
            }
        }
        # ... 可以继续扩展其他星曜
    }
}