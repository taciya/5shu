import json
import datetime
import hashlib
import sqlite3
from main import ZiweiChart
import csv

DB_NAME = "plates_cache.db"
TARGET_COUNT = 40000  # 目标命盘数量（理论最大值）

# 配置参数
START_YEAR = 1971 # 
END_YEAR = 2030
GENDERS = ['male']  # 可扩展为 ['male', 'female']

# 创建数据库连接
conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

# 初始化数据库表结构
cursor.execute("""
    CREATE TABLE IF NOT EXISTS destiny_plates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER,
        month INTEGER,
        day INTEGER,
        hour INTEGER,
        gender TEXT,
        ming TEXT,
        xiongdi TEXT,
        fuqi TEXT,
        zinv TEXT,
        caibo TEXT,
        jie TEXT,
        qianyi TEXT,
        jiaoyou TEXT,
        guanlu TEXT,
        tianzhai TEXT,
        fude TEXT,
        fumu TEXT,
        UNIQUE(ming, xiongdi, fuqi, zinv, caibo, jie, qianyi, jiaoyou, guanlu, tianzhai, fude, fumu)
    )
""")
conn.commit()

# 定义宫位映射关系
PALACE_MAP = {
    "命  宫": "ming",
    "兄弟宫": "xiongdi",
    "夫妻宫": "fuqi",
    "子女宫": "zinv",
    "财帛宫": "caibo",
    "疾厄宫": "jie",
    "迁移宫": "qianyi",
    "交友宫": "jiaoyou",
    "官禄宫": "guanlu",
    "田宅宫": "tianzhai",
    "福德宫": "fude",
    "父母宫": "fumu"
}

def clean_star_list(star_list):
    """清洗星曜列表（去空格、去空项）"""
    return [s.strip() for s in star_list if s.strip()]

def parse_chart(chart_json):
    """解析命盘JSON数据，提取宫位星曜信息"""
    palaces = chart_json['palaces']
    data = {}
    for palace in palaces:
        name = palace['name']
        if name not in PALACE_MAP:
            continue
        
        # 清洗主星和辅星列表
        main_stars = clean_star_list(palace.get('main_stars', []))
        minor_stars = clean_star_list(palace.get('minor_stars', []))
        
        data[PALACE_MAP[name]] = {
            'main': ','.join(main_stars),
            'minor': ','.join(minor_stars)
        }
    return data

def generate_unique_plates():
    """生成唯一命盘并直接插入数据库"""
    attempt_count = 0
    success_count = 0
    
    for year in range(START_YEAR, END_YEAR + 1):
        for month in range(1, 13):
            max_day = get_max_lunar_day(year, month)
            if max_day is None:
                continue
                
            for day in range(1, max_day + 1):
                for hour in range(0, 24, 2):  # 12时辰制
                    for gender in GENDERS:
                        attempt_count += 1
                        current_tuple = (year, month, day, hour, gender)
                        
                        # 生成命盘并验证日期有效性
                        try:
                            chart = ZiweiChart(
                                year=year,
                                month=month,
                                day=day,
                                hour=hour,
                                minute=0,
                                gender=gender
                            )
                            plate_str = chart.to_json144()
                        except Exception as e:
                            continue  # 跳过无效命盘

                        # 解析命盘数据
                        try:
                            parsed_data = parse_chart(json.loads(plate_str))
                        except Exception as e:
                            continue

                        # 构建数据库记录
                        record = {
                            'year': year,
                            'month': month,
                            'day': day,
                            'hour': hour,
                            'gender': gender
                        }
                        for palace, stars in parsed_data.items():
                            record[palace] = f"{stars['main']},{stars['minor']}".strip(',')

                        # 执行数据库插入
                        try:
                            columns = ', '.join(record.keys())
                            placeholders = ', '.join('?' * len(record))
                            query = f"INSERT OR IGNORE INTO destiny_plates ({columns}) VALUES ({placeholders})"
                            cursor.execute(query, tuple(record.values()))
                            conn.commit()
                            
                            # 写入CSV文件
                            if cursor.rowcount > 0:
                                # write_csv_record(current_tuple, parsed_data)
                                write_csv_record(current_tuple, record)
                                success_count += 1
                                print(f"成功插入 ✅ {success_count}/{attempt_count}")
                                if success_count >= TARGET_COUNT:
                                    return
                        except sqlite3.IntegrityError:
                            conn.rollback()
                            pass

# def write_csv_record(timestamp, parsed_data):
#     """将单条记录写入CSV文件"""
#     with open('destiny_plates.csv', 'a', newline='', encoding='utf-8-sig') as csvfile:
#         writer = csv.writer(csvfile)
        
#         # 写入main_stars部分
#         main_row = ['main_stars'] + [parsed_data[palace]['main'] for palace in PALACE_MAP.values()]
#         writer.writerow(main_row)
        
#         # 写入minor_stars部分
#         minor_row = ['minor_stars'] + [parsed_data[palace]['minor'] for palace in PALACE_MAP.values()]
#         writer.writerow(minor_row)
def write_csv_record(timestamp, record):
    """将单条记录写入CSV文件"""
    with open('destiny_plates.csv', 'a', newline='', encoding='utf-8-sig') as csvfile:
        writer = csv.writer(csvfile)
        
        # 写入main_stars部分
        row =  [timestamp] + [record[palace] for palace in PALACE_MAP.values()]
        writer.writerow(row)
        

def get_max_lunar_day(year: int, month: int) -> int:
    """
    计算指定农历年份和月份的最大天数（支持闰月）
    :param year: 农历年份（1900-2100）
    :param month: 农历月份（1-12）
    :return: 该月的最大天数（29或30）
    """
    # 农历数据表（1900-2100年）
    lunar_info = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,# 1900-1909 
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,# 1910-1919 
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,# 1920-1929 
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,# 1930-1939 
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,# 1940-1949 
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,# 1950-1959 
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,# 1960-1969 
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,# 1970-1979 
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,# 1980-1989 
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,# 1990-1999 
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,# 2000-2009 
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,# 2010-2019 
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,# 2020-2029 
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,# 2030-2039 
        0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,# 2040-2049 
        0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,# 2050-2059 
        0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,# 2060-2069 
        0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,# 2070-2079 
        0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,# 2080-2089 
        0x0d520, 0x0d4a0, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,# 2090-2099 
        0x0d520                                                                                  # 2100年 	
    ]

    # 验证年份范围
    if year < 1900 or year > 2100:
        raise ValueError("农历数据仅支持1900-2100年")

    # 获取当年农历信息
    lunar_data = lunar_info[year - 1900]

    # 判断是否有闰月
    leap_month = (lunar_data & 0xF)  # 取低4位
    if leap_month > 0 and month > leap_month:
        month -= 1  # 闰月占用一个月份编号

    # 计算当月天数
    if month < 1 or month > 12:
        raise ValueError("月份必须在1-12之间")

    # 月份参数调整（闰月处理）
    if leap_month != 0 and month == leap_month + 1:
        # 闰月天数与上一月相同
        prev_month = leap_month
        bit_offset = (prev_month - 1) * 2
        day_count = (lunar_data >> (bit_offset + 16)) & 0x3
    else:
        # 非闰月天数
        bit_offset = (month - 1) * 2
        day_count = (lunar_data >> bit_offset) & 0x3

    return day_count + 29  # 基础29天 + 0-3天的调整

if __name__ == "__main__":
    generate_unique_plates()