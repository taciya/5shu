import sxtwl
from constants import DIZHI_ORDER_ZI, NIAN_GAN, BA_GUA

class CalendarUtils:
    """历法工具类（改进版）"""
    
    def __init__(self, config=None):
        """
        构造函数
        :param config: 可选配置字典，用于未来扩展
        """
        self.config = config or {}
        # 初始化常用列表（避免重复定义）
        self.Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
        self.Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
        self.ShX = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]
        self.jqmc = ["冬至", "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏",
                    "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", 
                    "立冬", "小雪", "大雪"]
        self.WeekCn = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    
    def get_lunar_info(self, year, month, day, hour=None, minute=None):
        """
        获取农历和干支信息（主要对外接口）
        :param year: 公历年份
        :param month: 公历月份
        :param day: 公历日期
        :param hour: 小时（可选，用于时干支）
        :param minute: 分钟（可选，用于精确计算）
        :return: 字典包含农历日期、干支、八卦等信息
        """
        # 使用 sxtwl 获取公历对应的农历日
        day_obj = sxtwl.fromSolar(year, month, day)
        
        # 基本信息
        lunar_year = day_obj.getLunarYear()
        lunar_month = day_obj.getLunarMonth()
        lunar_day = day_obj.getLunarDay()
        is_leap = day_obj.isLunarLeap()
        
        # 获取干支
        # year_gan, year_zhi = self._calculate_year_gan_zhi(year)
        # month_gan, month_zhi = self._calculate_month_gan_zhi(year, month)
        # day_gan, day_zhi = self._calculate_day_gan_zhi(year, month, day)
        # 时干支（如果提供小时）
        # hour_gan, hour_zhi = None, None
        # if hour is not None:
        #     hour_gan, hour_zhi = self._calculate_hour_gan_zhi(day_gan, hour)

        # 获取干支
        # 以春节为界的天干地支 
        # yTG = day.getYearGZ(True)
        # 以立春为界的天干地支
        yTG = day_obj.getYearGZ()
        year_gan, year_zhi = self.Gan[yTG.tg], self.Zhi[yTG.dz]
        shx = self.ShX[yTG.dz]
        #月干支
        mTG = day_obj.getMonthGZ()        
        month_gan, month_zhi = self.Gan[mTG.tg], self.Zhi[mTG.dz]
        #日干支
        dTG  = day_obj.getDayGZ()        
        day_gan, day_zhi = self.Gan[dTG.tg], self.Zhi[dTG.dz]
        #时干支,传24小时制的时间，分早晚子时
        sTG = day_obj.getHourGZ(hour)      
        hour_gan, hour_zhi  = self.Gan[sTG.tg], self.Zhi[sTG.dz] 

        # 计算八卦（如果提供小时）
        bagua = None
        if hour is not None:
            bagua = self._calculate_bagua(year_gan, year_zhi, month_gan, month_zhi, day_gan, day_zhi, hour_gan, hour_zhi)   
                 
        return {
            'solar_date': f"{year}/{month}/{day} {hour}:{minute}",
            'year': year,
            'month': month,
            'day': day,
            'hour': hour,
            'minute': minute,

            'year_lunar': lunar_year,
            'month_lunar': lunar_month,
            'day_lunar': lunar_day,
            'is_leap': is_leap,

            'year_GZ': f"{year_gan}{year_zhi}",
            'month_GZ': f"{month_gan}{month_zhi}",
            'day_GZ': f"{day_gan}{day_zhi}",
            'hour_GZ': f"{hour_gan}{hour_zhi}" if hour_gan else None,

            'shengxiao': shx,
            'bagua': bagua,
            'week': self.WeekCn[day_obj.getWeek()],
        }

    # 流年计算
    def calculate_liunian(self, dizhi, birth_year):
        # zhi_nian = {zhi: 2020 + i for i, zhi in enumerate(DIZHI_ORDER_ZI)}
        # current_age = (zhi_nian[dizhi] - birth_year + 1) % 12+2
        # flow_years = []
        # while current_age <= 84:
        #     if current_age > 0:
        #         flow_years.append(current_age)
        #     current_age += 12
        # return flow_years
        DIZHI_ORDER_ZI = [ "子", "丑","寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]  
        zhi_nian={}
        for i,zhi in enumerate(DIZHI_ORDER_ZI):
            zhi_nian[zhi] = 2020+i

        # 计算流年列表
        flow_years = []
        current_age = (zhi_nian[dizhi]-birth_year+1) % 12
        
        while current_age <= 84:
            if current_age >0 :
                flow_years.append(current_age)
            current_age += 12  # 每12年一个周期
        
        return flow_years    
    
    def _calculate_bagua(self, year_gan, year_zhi, month_gan, month_zhi, day_gan, day_zhi, hour_gan, hour_zhi):
        """
        计算八卦（内部方法）
        :param 四柱的天干地支
        :return: 八卦名称
        """
        gan_zhi_to_num = {
            "甲": 1, "乙": 2, "丙": 3, "丁": 4, "戊": 5, "己": 6, "庚": 7, "辛": 8, "壬": 9, "癸": 10,
            "子": 1, "丑": 2, "寅": 3, "卯": 4, "辰": 5, "巳": 6, "午": 7, "未": 8, "申": 9, "酉": 10, "戌": 11, "亥": 12
        }
        
        upper_num = (gan_zhi_to_num[year_gan] + gan_zhi_to_num[year_zhi] + 
                    gan_zhi_to_num[month_gan] + gan_zhi_to_num[month_zhi])
        upper_num = (upper_num % 8) or 8
        
        lower_num = (gan_zhi_to_num[day_gan] + gan_zhi_to_num[day_zhi] + 
                    gan_zhi_to_num[hour_gan] + gan_zhi_to_num[hour_zhi])
        lower_num = (lower_num % 8) or 8
        
        return BA_GUA[upper_num - 1] + BA_GUA[lower_num - 1]    
    
    @staticmethod
    # 根据地支 取得 宫干 🆗比如寅宫戊干 ：输入 寅 ，输出 戊
    def get_palace_gan(nian_gan, gong_zhi):
        """根据地支取得宫干"""
        from constants import WUHU_DUN, DIZHI_ORDER
        # 五虎遁规则表（年干 -> 寅宫天干）      
        # 获取年干对应的起始天干
        start_gan = WUHU_DUN[nian_gan]
        # 生成十天干循环序列
        tian_gan = NIAN_GAN
        start_idx = tian_gan.index(start_gan)
        gan_cycle = (tian_gan * 2)[start_idx: start_idx+12]
        # print("十天干循环序列 : " , gan_cycle)
        # 构建地支-天干映射表
        dizhi_gan_map = {
            DIZHI_ORDER[i]: gan_cycle[i] 
            for i in range(12)
        }
        
        return dizhi_gan_map.get(gong_zhi, "")    
    
    # 计算三层卦象定位
    # @staticmethod
    def calculate_three_level_hexagram(self,ziwei_chart):
        """
        计算三层卦象定位
        :param ziwei_chart: 紫微斗数命盘对象
        :return: 主卦, 二层卦, 三层卦的宫位索引
        """
        # ziwei_chart.true_solar_time = f'{year}年{month}月{day}日 {hour}:{minute}'
        (true_sun_hour, true_sun_minute)=ziwei_chart.true_solar_time.split(" ")[1].split(":")
        
        if (ziwei_chart.yin_yang == "阳" and ziwei_chart.gender == "male") \
            or (ziwei_chart.yin_yang == "阴" and ziwei_chart.gender == "female"):
            yun_direction = '顺'
        else:
            yun_direction = '逆'

        for idx,palace in enumerate(ziwei_chart.palaces):
            if palace.laiyingong_flg :
                laiyin_palace_index = idx

        # 移动步数函数
        def move_step(start_index, steps, direction):
            if direction == '顺':
                return (start_index + steps) % 12
            else:  # 逆时针
                return (start_index - steps) % 12
        
        # 1. 主卦（来因宫） - 年干对应的宫位
        main_index = laiyin_palace_index
        
        # 2. 二层卦（10分钟卦）
        step_2 = int(true_sun_minute) // 10  # 每10分钟移动一宫
        
        # 判断单双数时辰
        if int(true_sun_hour) % 2 == 1:  # 单数时辰
            start_index_2 = main_index
        else:  # 双数时辰
            start_index_2 = (main_index + 6) % 12  # 对宫
        
        second_index = move_step(start_index_2, step_2, yun_direction)
        
        # 3. 三层卦（分钟卦）
        step_3 = int(true_sun_minute) % 12  # 分钟数除以12的余数
        third_index = move_step(main_index, step_3, yun_direction)

        return {
            'main_index':main_index, 
            'second_index':second_index, 
            'third_index':third_index,
            'main_hexagram':ziwei_chart.palaces[main_index].palace_name ,     
            'second_hexagram':ziwei_chart.palaces[second_index].palace_name, 
            'third_hexagram':ziwei_chart.palaces[third_index].palace_name            
            }    
