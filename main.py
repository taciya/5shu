from constants import *
from utils import CalendarUtils

from star_placement import StarPlacement
from sihua_calculator import SihuaCalculator
from output_formatter import OutputFormatter
from models import Palace

class ZiweiChart:
    """紫微斗数命盘类"""
    
    def __init__(self, year, month, day, hour, minute, gender):
        self.year = year
        self.month = month
        self.day = day
        self.hour = hour
        self.minute = minute
        self.gender = gender
        self.yin_yang = None  # 阴阳
        self.palaces = []  # 十二宫位
        self.feigong_map = None  # 飞宫四化
        self.feiru_map = None  # 飞入四化
        self.minggong_index = None  # 命宫索引
        self.sizhu_ymdh = None  # 四柱信息
        self.shengong_index = None  # 身宫索引
        self.wuxingju = None  # 五行局
        self.mingzhu = None  # 命主
        self.shenzhu= None  # 身主
        self.name= None # 名字
        self.start_age = None  # 起始年龄
        self.true_solar_time=f'{year}/{month}/{day} {hour}:{minute}'
        self.sizhu_bagua=None # 四柱八卦
        self.lunar_info=None # 
        # 初始化命盘
        self._initialize_chart()
    
    def _initialize_chart(self):
        """初始化命盘"""
        utils = CalendarUtils()
        # 测试闰月数据
        self.lunar_info=utils.get_lunar_info(self.year, self.month, self.day, self.hour, self.minute)
        print(self.lunar_info)

        # 初始化十二宫位
        self.palaces = [Palace(b) for b in DIZHI_ORDER]
        # 设置四柱八卦
        
        # self.sizhu_bagua=utils.generate_sizhu_bagua_extended(self.sizhu_ymdh['year'][0], self.sizhu_ymdh['month'], self.sizhu_ymdh['day'], self.sizhu_ymdh['hour'])
        self.sizhu_bagua={
            "年柱": f"{self.lunar_info['year_GZ']}",
            "月柱": f"{self.lunar_info['month_GZ']}",
            "日柱": f"{self.lunar_info['day_GZ']}",
            "时柱": f"{self.lunar_info['hour_GZ']}",
            "八卦": f"{self.lunar_info['bagua']}",
            "真太阳时": f"{self.lunar_info['solar_date']}",
        }

        # print(self.sizhu_bagua)   #<<<<<<<<<
        # 安星计算
        star_placement = StarPlacement(self)
        
        # 定位命宫
        self.minggong_index = star_placement.find_minggong()
        ordered_names = []
        for i in range(12):
            idx = (self.minggong_index- i) % 12
            ordered_names.append(PALACE_NAMES[idx])
        for i, palace in enumerate(self.palaces):
            palace.palace_name = ordered_names[i]  

        # print("定位命宫")
        # 定位身宫
        self.shengong_index, _ = star_placement.place_shengong()
        self.wuxingju = star_placement.get_wuxingju_jushu2()

        # 定位来因宫
        star_placement.place_laiyingong()        
        # 计算大限范围
        star_placement.calculate_limitation()
        # print("定位身宫")
        # 安主星
        star_placement.place_main_stars()
        # print("安主星")
        self.feigong_map=star_placement.get_feigong_map()
        self.feiru_map=star_placement.get_feiru_map()      

        # 安辅星
        star_placement.place_minor_stars()
        # 星曜状态
        star_placement.calculate_stars_brightness()
        # print("安辅星")
        # 安小星
        star_placement.place_small_stars()
        # print("安小星")
        # 安长生十二神
        star_placement.place_changsheng_12shen()
        # print("安长生十二神")
        # 安太岁十二神
        star_placement.place_tai_sui_12shen()
        # print("安太岁十二神")
        # 安将前十二神
        star_placement.place_jiangqian_12shen()
        # print("安将前十二神")
        # 安博士十二神
        star_placement.place_boshi_12shen()
        # print("安博士十二神")
        # 安命主身主
        star_placement.place_mingzhu_shenzhu()
        # print("安命主身主")
        # 四化计算
        sihua_calculator = SihuaCalculator(self)
        sihua_calculator.apply_nian_sihua()  # 生年四化
        sihua_calculator.calculate_lixin_sihua()  # 自化
        sihua_calculator.calculate_xiangxin_sihua()  # 向心四化
        # print("四化计算")
    
    def to_json(self):
        """将命盘数据转换为JSON格式"""
        formatter = OutputFormatter(self)
        return formatter.to_json()
    
    def to_json144(self):
        """将命盘数据转换为JSON格式"""
        formatter = OutputFormatter(self)
        return formatter.to_json144()    
    
    def save_to_file(self):
        """将命盘数据保存到本地JSON文件"""
        formatter = OutputFormatter(self)
        return formatter.save_to_file ()
    
    def print_all_palaces(self,stars=[]):
        """将命盘数据转换为JSON格式"""
        formatter = OutputFormatter(self)
        return formatter.print_all_palaces(stars)