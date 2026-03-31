# 四化计算文件
from constants import SIHUA_TABLE,STAR_BRIGHTNESS_TABLE
from utils import CalendarUtils


class SihuaCalculator:
    """四化计算类"""
    
    def __init__(self, ziwei_chart):
        self.ziwei_chart = ziwei_chart
        self.utils = CalendarUtils()
    
    def calculate_lixin_sihua(self):
        """自化计算（宫干）"""
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        for palace in self.ziwei_chart.palaces:
            gong_gan = self.utils.get_palace_gan(nian_gan, palace.dizhi)
            palace_sihua = SIHUA_TABLE[gong_gan]
            abcd = ['禄', '权', '科', '忌']
            
            for x in abcd:
                # 检查主星和辅星
                if palace_sihua[x] in palace.main_stars or palace_sihua[x] in palace.minor_stars:
                    # palace.lixin_sihua.append(palace_sihua[x] + "<" + x+ STAR_BRIGHTNESS_TABLE.get(x, {}).get(palace.dizhi, '□')+"%>")
                    palace.lixin_sihua.append(f"{palace_sihua[x]}<{x}{STAR_BRIGHTNESS_TABLE.get(x, {}).get(palace.dizhi, '□')}%>")
    
    def apply_nian_sihua(self):
        """应用生年四化到每个宫位"""
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        sihua_map = SIHUA_TABLE[nian_gan]
        
        star_to_sihua = {}
        for sihua_type, star in sihua_map.items():
            star_to_sihua[star] = sihua_type
        
        for palace in self.ziwei_chart.palaces:
            # 检查主星和辅星
            for star in palace.main_stars + palace.minor_stars:
                if star in star_to_sihua:
                    sihua_type = star_to_sihua[star]
                    palace.sihua.append(f"{star}化{sihua_type}")
    
    def calculate_xiangxin_sihua(self):
        """计算向心四化（对宫宫干引起的本宫四化）"""
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        for i, palace in enumerate(self.ziwei_chart.palaces):
            opposite_index = (i + 6) % 12
            opposite_palace = self.ziwei_chart.palaces[opposite_index]
            
            opposite_gan = self.utils.get_palace_gan(nian_gan, opposite_palace.dizhi)
            
            opposite_sihua = SIHUA_TABLE[opposite_gan]
            abcd = ['禄', '权', '科', '忌']
            
            for x in abcd:
                # 检查主星和辅星
                if opposite_sihua[x] in palace.main_stars or opposite_sihua[x] in palace.minor_stars:
                    # palace.xiangxin_sihua.append(opposite_sihua[x] + "<" + x + STAR_BRIGHTNESS_TABLE.get(x, {}).get(palace.dizhi, '□')+"%>")
                    palace.xiangxin_sihua.append(f"{opposite_sihua[x]}<{x}{STAR_BRIGHTNESS_TABLE.get(x, {}).get(palace.dizhi, '□')}%>")