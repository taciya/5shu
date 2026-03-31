# 数据模型文件
class Palace:
    """宫位类"""
    def __init__(self, dizhi):
        self.palace_name=None # 宫位名称
        self.dizhi = dizhi # 地支
        self.gan = None     # 天干
        self.main_stars = []      # 主星列表
        self.minor_stars = []     # 辅星列表
        self.xiaoxing_stars = []   # 小星列表
        self.shensha_stars = []   # 神煞列表
        self.changsheng_stars = []  # 长生列表
        self.sihua = []           # 生年四化列表
        self.lixin_sihua = []      # 自化列表
        self.xiangxin_sihua = []  # 向心四化列表
        self.shengong_flg = False  # 身宫标志 
        self.laiyingong_flg = False  # 来应宫标志
        self.age_range= None     # 年龄范围
        self.ages=[] #年龄列表
        self.others = []   # 其他信息
        # --- 新增字段：存储星曜的庙旺落陷状态 ，格式: {'星曜名': '亮度值'}---
        self.main_stars_brightness = {} # 主星亮度字典
        self.minor_stars_brightness = {} # 辅星亮度字典        
    def to_dict(self):
        """转换为字典格式"""
        return {
            'palace_name': self.palace_name,
            'dizhi': self.dizhi,
            'gan': self.gan,
            'main_stars': self.main_stars,
            'minor_stars': self.minor_stars,
            'xiaoxing_stars': self.xiaoxing_stars,
            'shensha_stars': self.shensha_stars,
            'changsheng_stars': self.changsheng_stars,
            'sihua': self.sihua,
            'lixin_sihua': self.lixin_sihua,
            'xiangxin_sihua': self.xiangxin_sihua,
            'shengong_flg': self.shengong_flg,
            'laiyingong_flg': self.laiyingong_flg,
            'others': self.others,
            'age_range': self.age_range,
            'ages': self.ages
        }




