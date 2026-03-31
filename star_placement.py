# 星曜安置逻辑文件
from constants import *
from utils import CalendarUtils
from models import Palace
from collections import defaultdict


class StarPlacement:
    """星曜安置类"""
    
    def __init__(self, ziwei_chart):
        self.ziwei_chart = ziwei_chart
        (nian_gan,nian_zhi) = list(ziwei_chart.lunar_info['year_GZ'])
        self.utils = CalendarUtils()
        self.ziwei_chart.yin_yang = '阳' if nian_gan in YANG_YEARS else '阴'

    
    # 命宫定位算法🆗
    def find_minggong(self):
        """命宫定位算法"""
        month = self.ziwei_chart.lunar_info['month_lunar']
        hour_idx = int((self.ziwei_chart.lunar_info['hour'] + 1) // 2) % 12 # 时辰序数
        # 顺数生月：从寅宫开始顺数month-1次
        # 地支宫位序号 = (寅宫序号 + 月份 - 1) % 12
        start_idx = (0 + month - 1) % 12 #寅宫索引为0
        # 逆数生时：从定位点逆数hour_idx次
        # print(start_idx,hour_idx)
        minggong_index = (start_idx - hour_idx) % 12
        return minggong_index
    
    # 计算大限范围🆗
    def calculate_limitation(self):
        # 大限范围：年柱天干地支序数 + 1
        self.ziwei_chart.start_age = WUXINGJU_AGE[self.ziwei_chart.wuxingju]

        # 生成大限年龄范围列表（12个区间，每10年一个）
        age_ranges = []
        current_age = self.ziwei_chart.start_age
        for i in range(12):
            age_ranges.append(f"{current_age}-{current_age + 9}")
            current_age += 10
        # 确定轮转方向：阳男、阴女顺时针；阴男、阳女逆时针
        if (self.ziwei_chart.yin_yang == "阳" and self.ziwei_chart.gender == "male") \
            or (self.ziwei_chart.yin_yang == "阴" and self.ziwei_chart.gender == "female"):
            clockwise = True  # 顺时针
        else:
            clockwise = False  # 逆时针        

        # 根据轮转方向生成宫位索引序列
        indices = []  # 存储每个大限对应的宫位索引
        current_index = self.ziwei_chart.minggong_index  # 总是从命宫（索引0）开始
        if clockwise:
            # 顺时针轮转：索引序列为 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
            step = 1
        else:
            # 逆时针轮转：索引序列为 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
            step = -1
        
        for i in range(12):
            indices.append(current_index)
            current_index = (current_index + step) % 12
            # 处理负数索引（Python模运算会自动处理，但确保在0-11范围内）
            if current_index < 0:
                current_index += 12

        # 分配大限期限到每个宫位：
        for idx,value in enumerate(indices):
            palace_index = value
            self.ziwei_chart.palaces[palace_index].age_range = age_ranges[idx]

    
    # 五行局计算🆗
    def get_wuxingju_jushu(self):
        """五行局计算"""

        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])

        gong_zhi = self.ziwei_chart.palaces[self.ziwei_chart.minggong_index].dizhi        
        gong_gan = self.utils.get_palace_gan(nian_gan, gong_zhi)


        return NAYIN_MAP[gong_gan + gong_zhi]['局数']
    
    def get_wuxingju_jushu2(self):
        """五行局计算"""
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])

        gong_zhi = self.ziwei_chart.palaces[self.ziwei_chart.minggong_index].dizhi        
        gong_gan = self.utils.get_palace_gan(nian_gan, gong_zhi)

        return NAYIN_MAP[gong_gan + gong_zhi]['局数2']    
    
    def get_wuxingju(self):
        """获取五行局"""
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])

        gong_zhi = self.ziwei_chart.palaces[self.ziwei_chart.minggong_index].dizhi        
        gong_gan = self.utils.get_palace_gan(nian_gan, gong_zhi)

        return NAYIN_MAP[gong_gan + gong_zhi]['五行']
    
    # 紫微星定位    🆗
    def find_ziwei(self, minggong_index):
        """紫微星定位"""
        lunar_day = self.ziwei_chart.lunar_info['day_lunar']
        wuxing_ju = self.get_wuxingju_jushu()

        if lunar_day % wuxing_ju == 0: # 整除情形
            quotient = lunar_day // wuxing_ju
            position = (quotient - 1) % 12 # 从寅宫顺数商数对应位置
        else: # 非整除情形
            x = (wuxing_ju - (lunar_day % wuxing_ju)) % wuxing_ju # 计算补数x
            adjusted_num = lunar_day + x
            quotient = adjusted_num // wuxing_ju
            
            if x % 2 == 0:  # 偶数补数
                position = (quotient + x - 1) % 12  # 顺数至(商数+x)[1]
            else:  # 奇数补数
                if quotient >= x:
                    position = (quotient - x - 1) % 12 # 顺数至(商数-x)[1]
                else:
                    reverse_steps = x - quotient # 逆数位数
                    position = (-reverse_steps) % 12 # 从寅宫逆推[1]  
        
        return position
    
    def _shift_arr(self,arr):
        return arr[11:] + arr[:11]    
    
    # 天府星定位 
    # 紫微宫位 ≤ 5（子至巳宫）​：天府位置 = (5−紫微宫位索引)mod12
    # 紫微宫位 ≥ 6（午至亥宫）​：天府位置 = (17−紫微宫位索引)mod12
    def find_tianfu(self, ziwei_pos):
        """天府星定位"""
        #紫微星索引转换
        ziwei_pos_2 = ziwei_pos + 2 % 12
        # 地支宫位定义（子宫为起始点）
        palaces2 = ["子", "丑","寅", "卯", "辰", "巳",   "午", "未", "申", "酉", "戌", "亥"]
        palaces2 = self._shift_arr(palaces2)
        # 核心计算公式（需将地支转为0-11的索引值）
        if ziwei_pos_2 <= 5: # 子丑寅卯辰巳（0-5号索引）
            tianfu_index = (5 - ziwei_pos_2) % 12
        else: # 午未申酉戌亥（6-11号索引）
            tianfu_index = (17 - ziwei_pos_2) % 12
            
        return DIZHI_ORDER.index(palaces2[tianfu_index])
    #禄存星定位
    def find_lucun(self):
        """禄存星定位"""
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        gong_gan = LUCUN_MAP[nian_gan]
        return DIZHI_ORDER.index(gong_gan)
    
    # 四化-飞入
    def get_feiru_map(self):
        """全局反向推导飞入四化映射"""
        feiru_map = defaultdict(lambda: defaultdict(list))  # 目标宫位→四化类型→来源列表
        # feiru_map = {}  # 目标宫位→四化类型→来源列表

        ordered_names = []
        # 遍历所有宫位的飞出记录
        for i in range(12):
            idx = (self.ziwei_chart.minggong_index - i) % 12
            ordered_names.append(PALACE_NAMES[idx])        
        # 遍历每个宫位，计算飞四化
        for i, source_palace in enumerate(self.ziwei_chart.palaces):        
        # for source_palace in self.ziwei_chart.palaces:
            source_dizhi = source_palace.dizhi
            # .get(source_dizhi, {})
            palace_name = ordered_names[i]  # 当前宫位的名称

            fly_records = self.ziwei_chart.feigong_map[source_dizhi]

            for sihua_type, target_info in fly_records.items():
                        # 'target': target_dizhi,
                        # 'target_palace_name': target_palace_name,
                        # 'star': star_name
                if sihua_type in ['禄', '权', '科', '忌']:
                    target_dizhi = target_info['target']
                    # 记录飞入信息
                    feiru_map[target_dizhi][sihua_type].append({
                        'star': target_info['star'],
                        'source_palace': palace_name,
                        'source_dizhi': source_dizhi
                    })
        
        return feiru_map
    
    # 四化-飞出
    def get_feigong_map(self):
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        # 初始化飞四化映射字典
        fly_sihua_map = {}
        ordered_names = []
        for i in range(12):
            idx = (self.ziwei_chart.minggong_index - i) % 12
            ordered_names.append(PALACE_NAMES[idx])        
        # 遍历每个宫位，计算飞四化
        for i, palace in enumerate(self.ziwei_chart.palaces):
            dizhi = palace.dizhi  # 当前宫位的地支
            gong_gan = self.utils.get_palace_gan(nian_gan, dizhi)  # 当前宫位的天干
            palace_name = ordered_names[i]  # 当前宫位的名称
            
            # 如果天干不在四化表中，跳过该宫位（通常不会发生，但安全处理）
            if gong_gan not in SIHUA_TABLE:
                continue
            
            # 获取当前天干对应的四化星曜字典
            sihua_stars = SIHUA_TABLE[gong_gan]
            
            # 初始化当前宫位的飞四化条目，包含宫位名称
            entry = {'palace_name': palace_name}
            
            # 遍历四化类型：禄、权、科、忌
            for sihua_type in ['禄', '权', '科', '忌']:
                star_name = sihua_stars[sihua_type]  # 获取四化类型对应的星曜名称
                
                # 初始化目标宫位信息
                target_dizhi = None
                target_palace_name = None
                
                # 在所有宫位中查找包含该星曜名称的主星列表
                for j, p in enumerate(self.ziwei_chart.palaces):
                    if star_name in p.main_stars:  # 只查找主星列表
                        target_dizhi = p.dizhi  # 目标宫位的地支
                        target_palace_name = ordered_names[j]  # 目标宫位的名称
                        break  # 找到后跳出循环（假设主星唯一）
                
                # 如果找到目标宫位，构建详细信息；否则设置为 None
                if target_dizhi is not None:
                    entry[sihua_type] = {
                        'target': target_dizhi,
                        'target_palace_name': target_palace_name,
                        'star': star_name
                    }
                else:
                    entry[sihua_type] = None  # 未找到星曜时设置为 None
            
            # 将当前宫位的飞四化条目添加到映射字典，键为地支
            fly_sihua_map[dizhi] = entry
        return fly_sihua_map

    # 主星分布
    def place_main_stars(self):
        """主星分布"""
        ziwei_index = self.find_ziwei(self.ziwei_chart.minggong_index)

        # 紫微星系（逆布）
        #紫微逆去宿天机，隔一太阳武曲移。天同隔二廉贞位，空三复见紫微池
        ziwei_stars = ['天机', 'X', '太阳', '武曲', '天同', 'X', 'X', '廉贞']
        idx = ziwei_index
        self.ziwei_chart.palaces[idx].main_stars.append("紫微")

        for star in ziwei_stars:
            idx = (idx - 1) % 12 # 逆时针隔1宫
            if star != 'X':
                self.ziwei_chart.palaces[idx].main_stars.append(star)
        
        # 天府星系（顺布）
        # 天府太阴顺贪狼，巨门天相与天梁，七杀空三是破军
        tianfu_index = self.find_tianfu(ziwei_index)
        tianfu_stars = ["太阴", "贪狼", "巨门", "天相", "天梁", "七杀", 'X', 'X', 'X', "破军"]
        idx = tianfu_index
        self.ziwei_chart.palaces[idx].main_stars.append("天府")
        
        for star in tianfu_stars:
            idx = (idx + 1) % 12
            if star != 'X':
                self.ziwei_chart.palaces[idx].main_stars.append(star)
                
        # 辅曜
        # 左辅从辰宫顺数月份
        idx = (2 + self.ziwei_chart.lunar_info['month_lunar'] - 1) % 12
        self.ziwei_chart.palaces[idx].main_stars.append('左辅')
        
        # 右弼从戌宫逆数月份
        idx = (8 - self.ziwei_chart.lunar_info['month_lunar'] + 1) % 12
        self.ziwei_chart.palaces[idx].main_stars.append('右弼')
        
        # 文昌文曲安星逻辑
        hour = self.ziwei_chart.lunar_info['hour']
        shi_zhi_index = int((hour + 1) // 2) % 12
        
        # 文曲星：从辰宫开始顺数时辰数
        wenqu_start = DIZHI_ORDER.index('辰')
        wenqu_idx = (wenqu_start + shi_zhi_index) % 12
        self.ziwei_chart.palaces[wenqu_idx].main_stars.append('文曲')
        
        # 文昌星：从戌宫开始逆数时辰数
        wenchang_start = DIZHI_ORDER.index('戌')
        wenchang_idx = (wenchang_start - shi_zhi_index) % 12
        self.ziwei_chart.palaces[wenchang_idx].main_stars.append('文昌')
        
        # 禄存星
        self.ziwei_chart.palaces[self.find_lucun()].minor_stars.append('禄存')
     # 放置辅星（8吉星和6凶星）
    def place_minor_stars(self):
        """放置辅星（8吉星和6凶星）"""
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])

        # 1. 天魁星 - 根据年干确定位置
        tiankui_map = {
            '甲': '丑', '乙': '子', '丙': '亥', '丁': '酉', 
            '戊': '丑', '己': '子', '庚': '丑', '辛': '午', 
            '壬': '卯', '癸': '巳'
        }
        if nian_gan in tiankui_map:
            idx = DIZHI_ORDER.index(tiankui_map[nian_gan])
            self.ziwei_chart.palaces[idx].minor_stars.append('天魁')
        
        # 2. 天钺星 - 根据年干确定位置
        tianyue_map = {
            '甲': '未', '乙': '申', '丙': '酉', '丁': '亥', 
            '戊': '未', '己': '申', '庚': '未', '辛': '寅', 
            '壬': '巳', '癸': '卯'
        }
        if nian_gan in tianyue_map:
            idx = DIZHI_ORDER.index(tianyue_map[nian_gan])
            self.ziwei_chart.palaces[idx].minor_stars.append('天钺')
        
         # 3. 天马星 - 根据年支确定位置🆗
        nian_zhi_dizhi = nian_zhi

        if nian_zhi_dizhi in TIANMA_MAP:
            tianma_pos = TIANMA_MAP[nian_zhi_dizhi]
            idx = DIZHI_ORDER.index(tianma_pos)
            self.ziwei_chart.palaces[idx].minor_stars.append('天马')
        
        # 4. 擎羊星 - 根据性别和阴阳年调整🆗
        # 5. 陀罗星 - 禄存为原点，和擎羊对称位置🆗
        lucun_idx = self.find_lucun()
        yang_nian = nian_gan in YANG_YEARS
        # 擎羊星安星规则：
        # - 阳年：擎羊在禄存的前一宫
        # - 阴年：擎羊在禄存的前一宫
        if self.ziwei_chart.gender == 'male':
            if yang_nian:
                qingyang_idx = (lucun_idx + 1) % 12  # 阳男，前一宫
                tuoluo_idx = (lucun_idx - 1) % 12  # 禄存对称位置
            else:
                qingyang_idx = (lucun_idx + 1) % 12  # 阴男，后一宫
                tuoluo_idx = (lucun_idx -1) % 12    # 禄存对称位置
        else:
            if yang_nian:
                qingyang_idx = (lucun_idx + 1) % 12  # 阳女，后一宫
                tuoluo_idx = (lucun_idx -1) % 12  # 禄存对称位置
            else:
                qingyang_idx = (lucun_idx +1) % 12  # 阴女，前一宫
                tuoluo_idx = (lucun_idx -1) % 12  # 禄存对称位置
        
        self.ziwei_chart.palaces[qingyang_idx].minor_stars.append('擎羊')
        self.ziwei_chart.palaces[tuoluo_idx].minor_stars.append('陀罗')
        
         # 根据口诀确定火星和铃星的子时起始位置
        # 火星和铃星
        hour = self.ziwei_chart.lunar_info['hour']
        shi_chen = int((hour + 1) // 2) % 12  # 0=子时, 1=丑时, ..., 11=亥时
        
        if nian_zhi_dizhi in ['申', '子', '辰']: # "申子辰人寅戌扬"
            huoxing_start = '寅'
            lingxing_start = '戌'
        elif nian_zhi_dizhi in ['寅', '午', '戌']: # "寅午戌人丑卯方"
            huoxing_start = '丑'
            lingxing_start = '卯'
        elif nian_zhi_dizhi in ['巳', '酉', '丑']:  # "巳酉丑人卯戌位"
            huoxing_start = '卯'
            lingxing_start = '戌'
        else: # "亥卯未人本戌房"
            huoxing_start = '戌'
            lingxing_start = '戌'
        
        # 6. 火星安星：从起始宫位顺数时辰数🆗
        start_idx = DIZHI_ORDER.index(huoxing_start)
        if not yang_nian:
            start_idx = (start_idx - 1) % 12
        huoxing_idx = (start_idx + shi_chen) % 12
        self.ziwei_chart.palaces[huoxing_idx].minor_stars.append('火星')
        
        # 7. 铃星安星：从起始宫位顺数时辰数🆗
        start_idx = DIZHI_ORDER.index(lingxing_start)
        lingxing_idx = (start_idx + shi_chen) % 12
        self.ziwei_chart.palaces[lingxing_idx].minor_stars.append('铃星')
        
        # 8. 地空星安星规则：🆗
        # 从亥宫起子时，逆数到生时支        
        # 9. 地劫星安星规则：🆗
        # 从亥宫起子时，顺数到生时支
        
        # 获取生时支（时辰对应的地支）
        shi_zhi_index = int((hour + 1) // 2) % 12
        # 计算地空星位置
        dikong_start = DIZHI_ORDER.index('亥') # 亥宫为起始点
        # 计算地劫星位置
        dijie_start = DIZHI_ORDER.index('亥')  # 亥宫为起始点
        
        # 地空逆数，地劫顺数
        dikong_idx = (dikong_start - shi_zhi_index) % 12
        dijie_idx = (dijie_start + shi_zhi_index) % 12
        
        self.ziwei_chart.palaces[dikong_idx].minor_stars.append('地空')
        self.ziwei_chart.palaces[dijie_idx].minor_stars.append('地劫')

    # 新增：放置小星
    def place_small_stars(self):
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        # 获取年支在子开始的顺序中的索引 
        nian_zhi_index = DIZHI_ORDER_ZI.index(nian_zhi)
        nian_gan_index = NIAN_GAN.index(nian_gan)
        shi_zhi_index = int((self.ziwei_chart.lunar_info['hour'] + 1) // 2) % 12
        month = self.ziwei_chart.lunar_info['month_lunar']
        
        # 天官星 - 使用常量定义 ✔
        if nian_gan in TIANGUAN_MAP:
            # 获取生肖对应的地支
            animal = TIANGUAN_MAP[nian_gan]
            # 根据地支获取宫位索引
            idx = DIZHI_ORDER.index(SHENGXIAO_DIZHI_MAP[animal])
            self.ziwei_chart.palaces[idx].xiaoxing_stars.append('天官')
        
        # 天福星 - 使用常量定义 ✔
        if nian_gan in TIANFU_MAP:
            # 获取生肖对应的地支
            animal = TIANFU_MAP[nian_gan]
            # 根据地支获取宫位索引
            idx = DIZHI_ORDER.index(SHENGXIAO_DIZHI_MAP[animal])
            self.ziwei_chart.palaces[idx].xiaoxing_stars.append('天福')

        #天哭天虚起午宫，午宫起子两分踪，哭逆巳兮虚顺未，生年寻到便居中
        # 天哭：从午宫(索引6)起子年（寅宫起所以 -2），逆数到生年支  ✔
        idx = (6-2 - nian_zhi_index) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('天哭')
        
        # 天虚：从午宫(索引6)起子年（寅宫起所以 -2），顺数到生年支  ✔
        idx = (6-2 + nian_zhi_index) % 12  
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('天虚')
        
        # 龙池星 - 龙池辰上子顺行，生年到处福元真 ✔
        idx = (4-2 + nian_zhi_index) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('龙池')
        
        # 凤阁星 - 凤阁戌宫逆起子，遇到生年是此神 ✔
        idx = (10-2 - nian_zhi_index) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('凤阁')

        
        # 红鸾星 - 卯上子年逆数之，数到当生太岁支 ✔
        idx = (3-2 - nian_zhi_index) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('红鸾')
        
        # 天喜星 - 坐守此宫红鸾位，对宫天喜不差移 ✔
        idx = (3-2 - nian_zhi_index+6) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('天喜')
        
        # 孤辰/寡宿 - 寅卯辰方安巳丑，巳午未方怕申辰，申酉戌方属亥未，亥子丑方寅戌嗔     
        if nian_zhi in ["寅", "卯", "辰"]:
            gu_chen = "巳"  # 巳宫
            gua_su = "丑"   # 丑宫
        elif nian_zhi in ["巳", "午", "未"]:
            gu_chen = "申"  # 申宫
            gua_su = "辰"   # 辰宫
        elif nian_zhi in ["申", "酉", "戌"]:
            gu_chen = "亥"  # 亥宫
            gua_su = "未"   # 未宫
        elif nian_zhi in ["亥", "子", "丑"]:
            gu_chen = "寅"  # 寅宫
            gua_su = "戌"   # 戌宫
        else:
            return None, None
        # 孤辰  ✔
        idx = DIZHI_ORDER.index(gu_chen)
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('孤辰')
        # 寡宿  ✔
        idx = DIZHI_ORDER.index(gua_su)
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('寡宿')

        # 蜚廉分方顺年移，西南东北各轮之，破碎轮排巳丑酉，不关生月与生时，
        # 辰丑戌未轮华盖，酉午卯子布咸池，龙德起羊月起巳，六星都起据年支。
        # 蜚廉安星，子年由申宫起，十二年支顺序先在西方（申酉戌），次在南方（巳午未），续在东方（寅卯辰），最后在北方（亥子丑）安立。        
        # 蜚廉星 ✔
        idx = FEILIAN_MAP_IDX[nian_zhi_index] -1-2
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('蜚廉')
        
        # 破碎星 ✔
        idx = POSUI_MAP_IDX[nian_zhi_index]-1-2
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('破碎')
        
        # 华盖星 ✔
        idx = HUAGAI_MAP_IDX[nian_zhi_index]-1-2
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('华盖')

        # 咸池星 ✔
        idx = XIANCHI_MAP_IDX[nian_zhi_index]-1-2
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('咸池')

        # 龙德 ✔
        # 定义三合局组
        fire_zhis = [2, 6, 10]   # 寅(2), 午(6), 戌(10) -> 丑(2)
        wood_zhis = [11, 3, 7]   # 亥(11), 卯(3), 未(7) -> 寅(3)
        water_zhis = [8, 0, 4]   # 申(8), 子(0), 辰(4) -> 卯(4)
        metal_zhis = [5, 9, 1]   # 巳(5), 酉(9), 丑(1) -> 辰(5)
        if nian_zhi_index in fire_zhis:
            idx= 2  # 丑宫
        elif nian_zhi_index in wood_zhis:
            idx= 3  # 寅宫
        elif nian_zhi_index in water_zhis:
            idx= 4  # 卯宫
        elif nian_zhi_index in metal_zhis:
            idx= 5  # 辰宫
        else:
            return 0
        self.ziwei_chart.palaces[idx-1-2].xiaoxing_stars.append('龙德')

        # 天德 - 天德星君起酉宫，顺至生年定其踪，  ✔
        idx = (9-2 + nian_zhi_index) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('天德')

        # 年解 - 年解戌宫逆行去，数至生年可解凶，  ✔
        idx = (10-2 - nian_zhi_index) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('年解')

        # 天才星安星规则：命宫起子年，顺数到年支 ✔
        minggong_dizhi = self.ziwei_chart.palaces[self.ziwei_chart.minggong_index].dizhi
        start_idx = DIZHI_ORDER.index(minggong_dizhi)
        tiancai_index = (start_idx + nian_zhi_index) % 12
        self.ziwei_chart.palaces[tiancai_index].xiaoxing_stars.append('天才')
        
        # 天寿星安星规则：身宫起子年，顺数到年支 ✔
        shengong_dizhi = self.ziwei_chart.palaces[self.ziwei_chart.shengong_index].dizhi
        start_idx = DIZHI_ORDER.index(shengong_dizhi)
        tianshou_index = (start_idx + nian_zhi_index) % 12
        self.ziwei_chart.palaces[tianshou_index].xiaoxing_stars.append('天寿')

        # 天刑酉上正月轮，数至生月便住脚  ✔
        # 计算位置: (酉宫索引为9 + 月份 - 1) % 12，并处理模12余0的情况
        idx = (9 + self.ziwei_chart.lunar_info['month_lunar'] -1) % 12
        if idx == 0:
            idx = 12
        self.ziwei_chart.palaces[idx-2].xiaoxing_stars.append('天刑')
        
        # 天姚上顺正月，数至生月便住脚  ✔
        # 计算位置: (丑宫索引为1 + 月份 - 1) % 12，并处理模12余0的情况
        idx = (1 + self.ziwei_chart.lunar_info['month_lunar'] -1) % 12
        if idx == 0:
            idx = 12
        self.ziwei_chart.palaces[idx-2].xiaoxing_stars.append('天姚')

        
        # 解神(月解)星安星规则：  ✔
        # 月支固定对应：正月寅、二月卯、三月辰、四月巳、五月午、六月未、七月申、八月酉、九月戌、十月亥、十一月子、十二月丑
        # 确定月支索引（0=寅,1=卯,...,10=子,11=丑）
        month_zhi_index = (month - 1) % 12
        
        # 单月（奇数月）取当月月支的对宫
        # 双月（偶数月）取前一个月月支的对宫
        if month % 2 == 1:  # 单月（奇数月）
            idx = (month_zhi_index + 6) % 12
        else:  # 双月（偶数月）
            prev_month_zhi_index = (month_zhi_index - 1) % 12
            idx = (prev_month_zhi_index + 6) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('解神')
        
        # 天巫星 - 巳申寅亥天巫位，分轮十二月星君  ✔
        if self.ziwei_chart.lunar_info['month_lunar'] in [1, 5, 9]:  # 寅、午、戌月（正月、五月、九月）
            idx =  6  # 巳宫
        elif self.ziwei_chart.lunar_info['month_lunar'] in [7, 11, 3]:  # 申、子、辰月（七月、十一月、三月）
            idx =  3  # 寅宫
        elif self.ziwei_chart.lunar_info['month_lunar'] in [10, 2, 6]:  # 亥、卯、未月（十月、二月、六月）
            idx =  9  # 申宫
        elif self.ziwei_chart.lunar_info['month_lunar'] in [4, 8, 12]:  # 巳、酉、丑月（四月、八月、十二月）
            idx =  12  # 亥宫
        else:
            idx =  -1
        self.ziwei_chart.palaces[idx-2-1].xiaoxing_stars.append('天巫')
        
        # 天月星 - 一犬二蛇三在龙，四虎五羊六兔宫，七猪八羊九在虎，十马冬犬腊寅中  ✔
        tianyue_map = {
            1: 11,  # 正月在戌
            2: 6,   # 二月在巳
            3: 5,   # 三月在辰
            4: 3,   # 四月在寅
            5: 8,   # 五月在未
            6: 4,   # 六月在卯
            7: 12,  # 七月在亥
            8: 8,   # 八月在未
            9: 3,   # 九月在寅
            10: 7,  # 十月在午
            11: 11, # 十一月在戌
            12: 3   # 十二月在寅
        }
        idx = tianyue_map.get(self.ziwei_chart.lunar_info['month_lunar'], -1)
        self.ziwei_chart.palaces[idx-2-1].xiaoxing_stars.append('天月')
        
        # 阴煞星 - 寅子戌，申午辰，分六月，阴煞临。  ✔
        yinsha_map = {
            1: 3,   # 正月在寅
            2: 1,   # 二月在子
            3: 11,  # 三月在戌
            4: 9,   # 四月在申
            5: 7,   # 五月在午
            6: 5,   # 六月在辰
            7: 3,   # 七月在寅
            8: 1,   # 八月在子
            9: 11,  # 九月在戌
            10: 9,  # 十月在申
            11: 7,  # 十一月在午
            12: 5   # 十二月在辰
        }
        idx= yinsha_map.get(self.ziwei_chart.lunar_info['month_lunar'], -1)
        self.ziwei_chart.palaces[idx-2-1].xiaoxing_stars.append('阴煞')

        # 台辅星 - 台辅午起子顺到时  ✔
        idx = (6-2 + shi_zhi_index) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('台辅')
        
        # 封诰星 - 封诰寅宫起子逆到时  ✔
        idx = (2-2 + shi_zhi_index) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('封诰')
        
        # 三台星 - 由左辅之宫位起初一，顺行至生日安三台。   ✔
        # 左辅从辰宫顺数月份
        idx = (2 + self.ziwei_chart.lunar_info['month_lunar'] - 1) % 12
        idx = (idx + self.ziwei_chart.lunar_info['day_lunar'] % 12 -1) % 12 
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('三台')

        # 八座星 - 由右弼之宫位起初一，逆行至生日安八座。   ✔
        # 右弼从戌宫逆数月份
        idx = (8 - self.ziwei_chart.lunar_info['month_lunar'] + 1) % 12
        idx = (idx - self.ziwei_chart.lunar_info['day_lunar'] % 12 +1) % 12 
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('八座')        

        
        # 恩光星 - 由文昌之宫位起初一，顺行至生日再退一步起恩光  ✔
        # 文昌星：从戌宫开始逆数时辰数
        wenchang_start = DIZHI_ORDER.index('戌')
        wenchang_idx = (wenchang_start - shi_zhi_index) % 12
        idx=(wenchang_idx + self.ziwei_chart.lunar_info['day_lunar'] % 12  -1-1) % 12 
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('恩光')
        
        # 天贵星 - 由文曲之宫位起初一，顺行至生日再退一步起天贵。  ✔
        # 文曲星：从辰宫开始顺数时辰数
        wenqu_start = DIZHI_ORDER.index('辰')
        wenqu_idx = (wenqu_start + shi_zhi_index) % 12
        idx=(wenqu_idx + self.ziwei_chart.lunar_info['day_lunar'] % 12  -1-1) % 12 
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('天贵')

        # 天伤星安星规则： ✔
        # 阳男阴女：天伤在仆役宫（交友宫）
        # 阴男阳女：天伤在疾厄宫
        if (self.ziwei_chart.gender == 'male' and nian_gan in YANG_YEARS) or \
           (self.ziwei_chart.gender == 'female' and nian_gan in YIN_YEARS):
            # 交友宫是命宫逆时针第7宫（命宫索引+6）
            idx = (self.ziwei_chart.minggong_index - 6) % 12
            self.ziwei_chart.palaces[idx-1].xiaoxing_stars.append('天伤')
        else:
            # 疾厄宫是命宫逆时针第5宫（命宫索引+4）
            idx = (self.ziwei_chart.minggong_index - 4) % 12
            self.ziwei_chart.palaces[idx-1].xiaoxing_stars.append('天伤')
        
        # 天使星安星规则： ✔
        # 阳男阴女：天使在疾厄宫
        # 阴男阳女：天使在仆役宫（交友宫）
        if (self.ziwei_chart.gender == 'male' and nian_gan in YANG_YEARS) or \
           (self.ziwei_chart.gender == 'female' and nian_gan in YIN_YEARS):
            # 疾厄宫是命宫逆时针第5宫（命宫索引+4）
            idx = (self.ziwei_chart.minggong_index - 4) % 12
            self.ziwei_chart.palaces[idx-1].xiaoxing_stars.append('天使')
        else:
            # 交友宫是命宫逆时针第7宫（命宫索引+6）
            idx = (self.ziwei_chart.minggong_index - 6) % 12
            self.ziwei_chart.palaces[idx-1].xiaoxing_stars.append('天使')

        # 天厨星 - 甲丁食蛇口，乙戊辛马方。丙从鼠口得，己食于猴房。庚食虎头上，壬鸡癸猪堂  ✔
        idx=TIANCHU_MAP[nian_gan]-2 # 转换为寅宫索引
        self.ziwei_chart.palaces[idx-1].xiaoxing_stars.append('天厨')

        # 天空星 - 生年支顺数的前一位就是  ✔
        idx = (nian_zhi_index-1) % 12
        self.ziwei_chart.palaces[idx].xiaoxing_stars.append('天空')

        # 截空/副截空 -戊癸子丑起，推至甲己止，申酉是截空，戌亥不论此
        # 阳，则阳宫为正，阴宫为副；阴，则阴宫为正，阳宫为副。
        (jiekong_idx, fujie_idx) = JIEKONG_MAP[nian_gan]
        if self.ziwei_chart.yin_yang == "阳":
            self.ziwei_chart.palaces[jiekong_idx-2-1].xiaoxing_stars.append('截空')
            self.ziwei_chart.palaces[fujie_idx-2-1].xiaoxing_stars.append('副截')
        else:
            self.ziwei_chart.palaces[fujie_idx-2-1].xiaoxing_stars.append('截空')
            self.ziwei_chart.palaces[jiekong_idx-2-1].xiaoxing_stars.append('副截')
            
        # 旬空/副旬 于[年支]宫起[年干]，干数至癸后二位为（旬空，副旬）
        # 阳，则阳宫为正，阴宫为副；阴，则阴宫为正，阳宫为副。
        # 计算旬空起始索引
        xunkong_idx = (nian_zhi_index+(9 - nian_gan_index)+1) % 12
        fuxun_idx = (nian_zhi_index+(9 - nian_gan_index)+1+1) % 12
        if self.ziwei_chart.yin_yang == "阳":
            self.ziwei_chart.palaces[xunkong_idx-2].xiaoxing_stars.append('旬空')
            self.ziwei_chart.palaces[fuxun_idx-2].xiaoxing_stars.append('副旬')
        else:
            self.ziwei_chart.palaces[fuxun_idx-2].xiaoxing_stars.append('旬空')
            self.ziwei_chart.palaces[xunkong_idx-2].xiaoxing_stars.append('副旬')

    # 长生十二神 ✔
    # 依五行局而起，金在巳，木在亥，水土在申，火在寅。阳男阴女顺行，阴男阳女逆行。
    # 太岁=岁建 大耗=岁破
    def place_changsheng_12shen(self):        
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        wuxing_ju = self.get_wuxingju()
        start_dizhi = CHANGSHENG_MAP[wuxing_ju]
        start_idx = DIZHI_ORDER.index(start_dizhi)
        
        if (self.ziwei_chart.gender == 'male' and nian_gan in YANG_YEARS) or \
           (self.ziwei_chart.gender == 'female' and nian_gan in YIN_YEARS):
            for i, name in enumerate(CHANGSHENG_STARS):
                idx = (start_idx + i) % 12
                self.ziwei_chart.palaces[idx].changsheng_stars.append(name)
        else:
            for i, name in enumerate(CHANGSHENG_STARS):
                idx = (start_idx - i) % 12
                self.ziwei_chart.palaces[idx].changsheng_stars.append(name)
    # 太岁十二神 ✔
    # 太岁晦气丧门起，贯索官符小耗比，岁破龙德白虎神，天德吊客病符止。
    def place_tai_sui_12shen(self):
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        start_idx = DIZHI_ORDER.index(nian_zhi)
        
        for i, name in enumerate(TAISUI_STARS):
            idx = (start_idx + i) % 12
            self.ziwei_chart.palaces[idx].shensha_stars.append(name)

    # 将前十二神 ✔
    def place_jiangqian_12shen(self):
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        start_idx = DIZHI_ORDER.index(nian_zhi)
        
        nian_zhi_index = DIZHI_ORDER_ZI.index(nian_zhi)
        # print("nian_gan:", nian_gan,"nian_zhi:", nian_zhi,  "nian_zhi_index:", nian_zhi_index, "start_idx:", start_idx)
        for i, name in enumerate(JIANGQIAN_STARS):
            if nian_zhi_index in [8, 0, 4]:  # 申(8), 子(0), 辰(4) -> 子(1)
                jiangxing_idx =  1
            elif nian_zhi_index in [2, 6, 10]: # 寅(2), 午(6), 戌(10) -> 午(7)
                jiangxing_idx =  7
            elif nian_zhi_index in [11, 3, 7]: # 亥(11), 卯(3), 未(7) -> 卯(4)
                jiangxing_idx =  4
            elif nian_zhi_index in [5, 9, 1]:  # 巳(5), 酉(9), 丑(1) -> 酉(10)
                jiangxing_idx =  10
            else:
                jiangxing_idx = -1            
            idx = (jiangxing_idx -1 +i -1-1)% 12
            self.ziwei_chart.palaces[idx].shensha_stars.append(name)

    # 博士十二神 ✔
    # 从禄存起，阳男阴女顺行，阴男阳女逆行。
    def place_boshi_12shen(self):
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        start_idx = self.find_lucun()  # 禄存宫为起点
       
        gan_index = NIAN_GAN.index(nian_gan)
        for i, name in enumerate(BOSHI_STARS):
            if (self.ziwei_chart.gender == 'male' and nian_gan in YANG_YEARS) or \
            (self.ziwei_chart.gender == 'female' and nian_gan in YIN_YEARS):            
                idx = (start_idx + i ) % 12
            else:
                idx = (start_idx - i ) % 12
            
            self.ziwei_chart.palaces[idx].shensha_stars.append(name)
    
    def place_mingzhu_shenzhu(self):
        """放置命主身主"""
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        
        if nian_zhi in MINGZHU_MAP:
            self.ziwei_chart.mingzhu = MINGZHU_MAP[nian_zhi]
            # self.ziwei_chart.palaces[self.ziwei_chart.minggong_index].shensha_stars.append(
            #     MINGZHU_MAP[nian_zhi] + "(命主)")
        
        if nian_zhi in SHENZHU_MAP:
            self.ziwei_chart.shenzhu = SHENZHU_MAP[nian_zhi]
            # self.ziwei_chart.palaces[self.ziwei_chart.minggong_index].shensha_stars.append(
            #     SHENZHU_MAP[nian_zhi] + "(身主)")
    
    def place_shengong(self):
        """放置身宫"""
        (hour_gan,hour_zhi) = list(self.ziwei_chart.lunar_info['hour_GZ'])
        month_index = (self.ziwei_chart.lunar_info['month_lunar'] - 1) % 12
        hour_map = {"子": 0, "丑": 1, "寅": 2, "卯": 3, "辰": 4, "巳": 5, 
                    "午": 6, "未": 7, "申": 8, "酉": 9, "戌": 10, "亥": 11}
        hour_index = hour_map.get(hour_zhi, 0)

        shengong_index = (month_index + hour_index) % 12
        shengong_dizhi = DIZHI_ORDER[shengong_index]
        self.ziwei_chart.palaces[shengong_index].shengong_flg = True
        return shengong_index, shengong_dizhi
    
    def place_laiyingong(self):
        """放置来因宫"""        
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        for i, palace in enumerate(self.ziwei_chart.palaces):
            dizhi = palace.dizhi       
            gong_gan = self.utils.get_palace_gan(nian_gan, dizhi)
            palace.gan = gong_gan
            # 地址 = 子 or 丑 的时候跳过
            if dizhi == '子' or dizhi == '丑':
                continue                  
            if gong_gan == nian_gan:
                self.ziwei_chart.laiyingong_index = i
                self.ziwei_chart.palaces[i].laiyingong_flg = True

    # 计算当前宫位所有主星和辅星的庙旺落陷状态
    def calculate_stars_brightness(self):
        for palace in self.ziwei_chart.palaces:
            # 计算主星
            for star in palace.main_stars:
                # 从全局表中获取该星在当前地支的亮度值，如果找不到则设为None或默认值（如0-平）
                brightness_value = STAR_BRIGHTNESS_TABLE.get(star, {}).get(palace.dizhi, '□') # 假设3为'平'
                palace.main_stars_brightness[star] = brightness_value

            # 计算辅星
            for star in palace.minor_stars:
                brightness_value = STAR_BRIGHTNESS_TABLE.get(star, {}).get(palace.dizhi, '□')
                palace.minor_stars_brightness[star] = brightness_value