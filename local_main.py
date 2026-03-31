from main import ZiweiChart
import json
from flask import  jsonify

# chart = ZiweiChart(2014, 3, 26, 13, 31, 'male') #阳男

stars=[]
#己
chart = ZiweiChart(1979, 5, 27, 11,31, 'male') #阴男
chart.print_all_palaces(stars)
# print(chart.to_json())
exit(0)
#甲
chart = ZiweiChart(2014, 3, 26, 13,31, 'male') #东 阳男
chart.print_all_palaces(stars)
# chart.save_to_file()
#庚
chart = ZiweiChart(1980, 4, 30, 16,22, 'female') #董 阳女
chart.print_all_palaces(stars)

chart = ZiweiChart(1991, 11, 17, 23,31, 'female') #阴女
chart.print_all_palaces(stars)
exit(0)

#乙
chart = ZiweiChart(1945, 12, 19, 12,00, 'male') #尔庭 阴男
chart.print_all_palaces(stars)

#丙
chart = ZiweiChart(1996, 6, 16, 21,41, 'female') #何静 阳女
chart.print_all_palaces(stars)

#丁
chart = ZiweiChart(1977, 12, 3, 10,10, 'male') #何坤 阴男
chart.print_all_palaces(stars)

#戊
chart = ZiweiChart(1978, 8, 1, 23,22, 'female') #李杰 阳女
chart.print_all_palaces(stars)

#己
chart = ZiweiChart(1979, 5, 27, 11,31, 'male') #阴男
chart.print_all_palaces(stars)

#庚
chart = ZiweiChart(1980, 4, 30, 16,22, 'female') #董 阳女
chart.print_all_palaces(stars)

#辛
chart = ZiweiChart(1981, 6, 1, 18,0, 'male') #成范
chart.print_all_palaces(stars)

#壬
chart = ZiweiChart(1982, 4, 29, 18,2, 'female') #嘉玲
chart.print_all_palaces(stars)

#癸
chart = ZiweiChart(2023, 3, 10, 20,38, 'female') #小孩
chart.print_all_palaces(stars)


# 
# chart = ZiweiChart(1980, 4, 30, 16,31, 'female') #阳女
# chart.print_all_palaces(stars)

chart = ZiweiChart(1991, 11, 17, 23,31, 'female') #阴女
chart.print_all_palaces(stars)

# chart = ZiweiChart(2001, 3, 11, 5,00, 'female') #阴女
# chart.print_all_palaces(stars)

# 输出JSON格式命盘数据
# json_output = chart.to_json()
# file_path=chart.save_to_file()
# print(file_path)