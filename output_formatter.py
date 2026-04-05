# 输出格式化文件
import json
from constants import PALACE_NAMES,STAR_BRIGHTNESS_TABLE,MAIN_STARS,TAISUI_STARS,JIANGQIAN_STARS,BOSHI_STARS,CHANGSHENG_STARS,SIHUA_TABLE
from utils import CalendarUtils
import os
from datetime import datetime

class OutputFormatter:
    """输出格式化类"""
    
    def __init__(self, ziwei_chart):
        self.ziwei_chart = ziwei_chart
        self.utils = CalendarUtils()
    
    def print_all_palaces(self, stars=[]):
        """打印所有12宫位信息（只显示包含指定星耀的宫位）"""
        ordered_names = []
        for i in range(12):
            idx = (self.ziwei_chart.minggong_index - i) % 12
            ordered_names.append(PALACE_NAMES[idx])
        return_str = []
        return_str.append("=" * 100)
       
        for i, palace in enumerate(self.ziwei_chart.palaces):

            # 检查宫位是否包含指定的星耀
            contains_star = False
            # 检查主星
            if stars and palace.main_stars:
                for star in stars:
                    if star in palace.main_stars:
                        contains_star = True
                        break
            
            # 检查辅星
            if not contains_star and stars and palace.minor_stars:
                for star in stars:
                    if star in palace.minor_stars:
                        contains_star = True
                        break
            # 检查小星
            if not contains_star and stars and palace.xiaoxing_stars:
                for star in stars:
                    if star in palace.xiaoxing_stars:
                        contains_star = True
                        break        
            # 检查神煞星
            if not contains_star and stars and palace.shensha_stars:
                for star in stars:
                    if star in palace.shensha_stars:
                        contains_star = True
                        break
            
            # 检查长生星
            if not contains_star and stars and palace.changsheng_stars:
                for star in stars:
                    if star in palace.changsheng_stars:
                        contains_star = True
                        break
            
            # 检查生年四化
            if not contains_star and stars and palace.sihua:
                for star in stars:
                    for sihua in palace.sihua:
                        if star in sihua:  # 检查星耀名是否在四化字符串中
                            contains_star = True
                            break
                    if contains_star:
                        break
            
            # 检查离心自化
            if not contains_star and stars and palace.lixin_sihua:
                for star in stars:
                    for sihua in palace.lixin_sihua:
                        if star in sihua:  # 检查星耀名是否在四化字符串中
                            contains_star = True
                            break
                    if contains_star:
                        break
            
            # 检查向心四化
            if not contains_star and stars and palace.xiangxin_sihua:
                for star in stars:
                    for sihua in palace.xiangxin_sihua:
                        if star in sihua:  # 检查星耀名是否在四化字符串中
                            contains_star = True
                            break
                    if contains_star:
                        break
            
            # 如果没有指定星耀列表，或者宫位包含指定星耀，则打印该宫位信息
            (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
            if not stars or contains_star:
                dizhi = palace.dizhi
                gan = self.utils.get_palace_gan(nian_gan, dizhi)
                palace_name = ordered_names[i]
                
                main_stars_str = ', '.join(palace.main_stars) if palace.main_stars else "无"
                minor_stars_str = ', '.join(palace.minor_stars) if palace.minor_stars else "无"
                xiaoxing_stars_str = ', '.join(palace.xiaoxing_stars) if palace.xiaoxing_stars else "无"
                shensha_stars_str = ', '.join(palace.shensha_stars) if palace.shensha_stars else "无"
                changsheng_stars_str = ', '.join(palace.changsheng_stars) if palace.changsheng_stars else "无"
                nian_sihua = ', '.join(palace.sihua) if palace.sihua else "无"
                lixin_sihua = ', '.join(palace.lixin_sihua) if palace.lixin_sihua else "无"
                xiangxin_sihua = ', '.join(palace.xiangxin_sihua) if palace.xiangxin_sihua else "无"
                shengong_flg = "是" if palace.shengong_flg else "否" 

                entry=self.ziwei_chart.feigong_map[dizhi]
                feigong_arr = []
                for sihua_type in ['禄', '权', '科', '忌']:
                    feigong_arr.append(f" 飞出<{entry[sihua_type]['star']}{sihua_type}{STAR_BRIGHTNESS_TABLE.get(sihua_type, {}).get(entry[sihua_type]['target'], '□')}%>到<{entry[sihua_type]['target_palace_name']}>")

                # 获取飞入四化信息
                feiru_arr = []
                if dizhi in self.ziwei_chart.feiru_map:
                    for sihua_type, sources in self.ziwei_chart.feiru_map[dizhi].items():
                        for src in sources:
                            star = src['star']
                            source_palace = src['source_palace']
                            feiru_arr.append(f"从<{source_palace}>飞入<{star}{sihua_type}{STAR_BRIGHTNESS_TABLE.get(sihua_type, {}).get(dizhi, '□')}%>")
                age_range = palace.age_range                 

                return_str.append(f"{palace_name} ({gan}{dizhi}) [{age_range}岁]:")
                return_str.append(f"  主星: {main_stars_str}")
                return_str.append(f"  主星亮度: {palace.main_stars_brightness}")    
                return_str.append(f"  辅星: {minor_stars_str}")
                return_str.append(f"  辅星亮度: {palace.minor_stars_brightness}")    
                return_str.append(f"  小星: {xiaoxing_stars_str}")
                return_str.append(f"  神煞: {shensha_stars_str}")
                return_str.append(f"  长生: {changsheng_stars_str}")                            
                return_str.append(f"  四化-生年: {nian_sihua}")
                return_str.append(f"  四化-离心: {lixin_sihua}")
                return_str.append(f"  四化-向心: {xiangxin_sihua}")                
                return_str.append(f"  四化-飞出: [{' ,'.join(feigong_arr)}]")            
                return_str.append(f"  四化-飞入: [{', '.join(feiru_arr)}]")
                return_str.append(f"  身宫标记: {shengong_flg}")
                return_str.append("-" * 100)

        # print('\r\n'.join(return_str))   
        return return_str
    
    def to_json(self):
        """将命盘数据转换为JSON格式"""
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        
        palaces_json = []
        for i, palace in enumerate(self.ziwei_chart.palaces):
            dizhi = palace.dizhi
            # gan = self.utils.get_palace_gan(nian_gan, dizhi)
            # print(self.ziwei_chart.lunar_info['year'])
            # 计算流年
            palace.ages=self.utils.calculate_liunian(dizhi,self.ziwei_chart.lunar_info['year'])
            # print(dizhi,palace.ages)
            # 构建宫位字典
            palace_dict = {
                "name": palace.palace_name.strip(),
                "dizhi": dizhi,
                "gan": palace.gan,
                "main_stars": palace.main_stars,
                "minor_stars": palace.minor_stars,
                "xiaoxing_stars": palace.xiaoxing_stars,
                "shensha_stars": palace.shensha_stars,
                "changsheng_stars": palace.changsheng_stars,
                "sihua": palace.sihua,
                "lixin_sihua": palace.lixin_sihua,
                "xiangxin_sihua": palace.xiangxin_sihua,
                "age_range": palace.age_range,
                "ages": palace.ages,
                "shengong_flg": palace.shengong_flg,
                "main_stars_brightness": palace.main_stars_brightness,
                "minor_stars_brightness": palace.minor_stars_brightness,
              }
            palaces_json.append(palace_dict)


        # 构建完整的数据字典
        data_dict = {
            "birth_info": {
                "year": self.ziwei_chart.lunar_info['year_lunar'],
                "gan_zhi": nian_gan+nian_zhi,
                "month": self.ziwei_chart.lunar_info['month_lunar'],
                "day": self.ziwei_chart.lunar_info['day_lunar'],
                "hour": self.ziwei_chart.lunar_info['hour'],
                "gender": self.ziwei_chart.gender,
                "true_solar_time": self.ziwei_chart.lunar_info['solar_date']
            },
            "sizhu_bagua":self.ziwei_chart.sizhu_bagua,
            "minggong_index": self.ziwei_chart.minggong_index,
            "wuxingju": self.ziwei_chart.wuxingju,
            "mingzhu": self.ziwei_chart.mingzhu,
            "shenzhu": self.ziwei_chart.shenzhu,
            "palaces": palaces_json,
            "yin_yang": self.ziwei_chart.yin_yang,
            "feigong_str":self.print_all_palaces(),
            "three_level_hexagram": self.utils.calculate_three_level_hexagram(self.ziwei_chart),
            "feigong_map": self.ziwei_chart.feigong_map  # 追加的飞四化映射

        }
        
        # 使用json.dumps确保输出双引号格式的JSON字符串
        return json.dumps(
            data_dict,
            ensure_ascii=False,  # 允许中文字符直接显示
            indent=2,            # 缩进使输出更易读
            sort_keys=False      # 保持字典原有顺序
        )
    
    # 新增专门生成feigong_str的方法
    def get_feigong_str(self):  
        """专门生成feigong_str，包含飞宫四化追踪"""
        
        # 先生成基本的宫位信息
        basic_feigong = self.print_all_palaces()
        
        # 确保是列表格式
        if isinstance(basic_feigong, str):
            feigong_lines = basic_feigong.split('\n')
        else:
            feigong_lines = basic_feigong
        
        # 添加飞宫四化追踪信息
        feigong_with_tracking = self.add_sihua_tracking_to_feigong(feigong_lines)
        
        # 返回字符串格式
        if isinstance(feigong_with_tracking, list):
            return '\n'.join(feigong_with_tracking)
        else:
            return feigong_with_tracking

    def save_to_file(self, filename="ziwei.json"):
        """
        将命盘数据保存到本地JSON文件
        
        参数:
            filename (str): 要保存的文件名，默认为 "ziwei.json"
        """
        # 生成JSON字符串
        json_data = self.to_json()
        
        # 获取用户主目录路径
        home_dir = os.path.expanduser("~")
        
        # 创建保存目录（如果不存在）
        save_dir = os.path.join(home_dir, "紫微斗数命盘")
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        
        # 创建唯一的文件名（包含时间戳）
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_name, ext = os.path.splitext(filename)
        # unique_filename = f"{base_name}_{timestamp}{ext}"
        # file_path = os.path.join(save_dir, unique_filename)
        file_path = os.path.join(save_dir,f"{base_name}{ext}")
        
        # 写入文件
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(json_data)
        
        # 创建备份文件
        backup_path = os.path.join(save_dir, f"{base_name}_backup_{timestamp}{ext}")
        with open(backup_path, "w", encoding="utf-8") as f:
            f.write(json_data)

        return file_path    
    
    def to_json144(self):        
        (nian_gan,nian_zhi) = list(self.ziwei_chart.lunar_info['year_GZ'])
        palaces_json = []
        for i, palace in enumerate(self.ziwei_chart.palaces):
            dizhi = palace.dizhi
            # gan = self.utils.get_palace_gan(nian_gan, dizhi)
        
            # 计算流年
            palace.ages=self.utils.calculate_liunian(dizhi,self.ziwei_chart.lunar_info['year_lunar'])
            # 构建宫位字典
            palace_dict = {
                "name": palace.palace_name.strip(),
                # "dizhi": dizhi,
                # "gan": palace.gan,
                "main_stars": palace.main_stars,
                "minor_stars": palace.minor_stars,
                # "xiaoxing_stars": palace.xiaoxing_stars,
                # "shensha_stars": palace.shensha_stars,
                # "changsheng_stars": palace.changsheng_stars,
                # "sihua": palace.sihua,
                # "lixin_sihua": palace.lixin_sihua,
                # "xiangxin_sihua": palace.xiangxin_sihua,
              }
            palaces_json.append(palace_dict)


        # 构建完整的数据字典
        data_dict = {
            "palaces": palaces_json,
        }
        
        # 使用json.dumps确保输出双引号格式的JSON字符串
        return json.dumps(
            data_dict,
            ensure_ascii=False,  # 允许中文字符直接显示
            indent=2,            # 缩进使输出更易读
            sort_keys=False      # 保持字典原有顺序
        )    
    
    def add_sihua_tracking_to_feigong(self, feigong_str_lines):
        """添加飞宫四化追踪信息到 feigong_str 末尾"""
        
        # 获取三层卦象信息
        three_level_hexagram = self.utils.calculate_three_level_hexagram(self.ziwei_chart)        
        
        # 创建一个列表来存储所有追四化信息
        tracking_sections = []
        
        # 遍历所有宫位，为属于卦象层级的宫位生成追踪信息
        for palace in self.ziwei_chart.palaces:
            palace_name = palace.palace_name.strip()
            
            # 检查宫位属于哪个卦象层级
            level = None
            if palace_name == three_level_hexagram['main_hexagram']:
                level = 'zhu'
                # 为该宫位生成飞宫四化追踪信息
                tracking_info = self.generate_sihua_tracking_for_palace(palace, level)
                if tracking_info:
                    tracking_sections.append(tracking_info)
            if palace_name == three_level_hexagram['second_hexagram']:
                level = 'ci'  
                # 为该宫位生成飞宫四化追踪信息
                tracking_info = self.generate_sihua_tracking_for_palace(palace, level)
                if tracking_info:
                    tracking_sections.append(tracking_info)
            if palace_name == three_level_hexagram['third_hexagram']:
                level = 'san'
                # 为该宫位生成飞宫四化追踪信息
                tracking_info = self.generate_sihua_tracking_for_palace(palace, level)
                if tracking_info:
                    tracking_sections.append(tracking_info)
        
        # 如果有追四化信息，将其添加到 feigong_str_lines 的末尾
        if tracking_sections and False: # 目前先不添加追四化信息到飞宫字符串中，后续可以根据需要开启
            # 添加分隔线
            if isinstance(feigong_str_lines, list):
                
                # 添加所有追四化信息
                for section in tracking_sections:
                    feigong_str_lines.append(section)
                    feigong_str_lines.append("")  # 每个部分后加空行
            else:
                # 如果是字符串，先转换为列表
                lines = feigong_str_lines.split('\n') if isinstance(feigong_str_lines, str) else [feigong_str_lines]
                
                for section in tracking_sections:
                    lines.append(section)
                    lines.append("")
                
                feigong_str_lines = lines
        
        return feigong_str_lines

    def generate_sihua_tracking_for_palace(self, palace, level):
        """为指定宫位生成飞宫四化追踪信息（优化版）"""
        
        hexagram_templates = {
            'zhu': "追四化-主卦({}) ：",
            'ci': "追四化-十分卦({}) ：", 
            'san': "追四化-分钟卦({}) ："
        }
        
        # 直接构建追踪信息字典
        tracking_dict = {}  # {(star, sihua_type): [source_palaces]}
        
        # 收集所有星曜的四化信息
        all_stars = []
        if hasattr(palace, 'main_stars') and palace.main_stars:
            all_stars.extend(palace.main_stars)
        if hasattr(palace, 'minor_stars') and palace.minor_stars:
            all_stars.extend(palace.minor_stars)
        
        for star_name in all_stars:
            sources = self.get_sihua_sources(star_name, palace)
            for source in sources:
                key = (star_name, source['sihua_type'])
                if key not in tracking_dict:
                    tracking_dict[key] = []
                if source['palace'] not in tracking_dict[key]:
                    tracking_dict[key].append(source['palace'])
        
        # 如果没有四化信息，返回None
        if not tracking_dict:
            return None
        
        # 构建最终输出
        tracking_lines = [hexagram_templates[level].format(palace.palace_name)]
        
        for (star_name, sihua_type), source_palaces in tracking_dict.items():
            # 获取所有来源宫位的显示信息
            palace_displays = []
            for palace_dizhi in source_palaces:
                display = self.get_palaces_by_dizhi(palace_dizhi)
                if display:
                    palace_displays.append(display)
            
            if palace_displays:
                # 合并所有宫位到一行，用空格分隔
                merged_palaces = "  ".join(palace_displays)
                tracking_lines.append(f"  追{sihua_type}({star_name}) : {merged_palaces}")
        
        return '\n'.join(tracking_lines)

    def get_sihua_sources(self, star_name, current_palace):
        """获取星曜的四化来源信息（后端实现）"""
        
        sources = []
        
        # 这里需要访问后端的飞宫四化映射数据
        # 假设我们在 ziwei_chart 中有类似前端的 zhui4Map 的数据结构
        if hasattr(self.ziwei_chart, 'feigong_map') and self.ziwei_chart.feigong_map:
            for sihua_type in ['禄', '权', '科', '忌']:
                # 在飞宫映射中查找该星曜的四化信息
                for source_palace, sihua_data in self.ziwei_chart.feigong_map.items():
                    # print(source_palace,sihua_data)
                    if sihua_type in sihua_data:
                        target_info = sihua_data[sihua_type]
                        if (target_info.get('star') == star_name and 
                            target_info.get('target') == current_palace.dizhi):
                            
                            sources.append({
                                'palace': source_palace,  # 来源宫位的天干
                                'sihua_type': sihua_type,
                                'full_name': star_name
                            })
                            # print("四化来源",sources)
        
        return sources

    def get_palaces_by_dizhi(self, dizhi):
        """获取指定地支对应的所有宫位信息，并合并显示"""
        
        palaces_info = []
        
        # 遍历所有宫位，查找匹配的地支
        for palace in self.ziwei_chart.palaces:
            if hasattr(palace, 'dizhi') and palace.dizhi == dizhi:
                # 获取宫位的显示信息（宫名 + 天干地支）
                # 确保宫名长度一致，使用空格填充对齐
                palace_name = palace.palace_name.strip()
                # 统一宫名长度为3个字符（用空格填充）
                padded_palace_name = palace_name.ljust(3)  # 左对齐，用空格填充到3字符
                
                palace_display = f"{padded_palace_name} ({palace.gan}{palace.dizhi})"
                palaces_info.append(palace_display)

        # 将多个宫位信息用空格连接
        if palaces_info:
            return '  '.join(palaces_info)  # 使用两个空格作为分隔符
        else:
            return "未找到对应宫位"

    
