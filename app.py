
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, request, jsonify,render_template,session
from main import ZiweiChart
from output_formatter import OutputFormatter
from flask_cors import CORS  # 处理跨域请求
import json
from datetime import datetime
import os
import time
import traceback
import sqlite3
# 在现有导入基础上添加 用户认证和管理功能
from functools import wraps
import hashlib
import secrets
from utils import CalendarUtils

app = Flask(__name__)
CORS(app)  # 允许所有域的跨域请求
utils = CalendarUtils()

@app.route('/')
def home():
    # 渲染 templates 文件夹中的 index.html
    return render_template('index.html')



@app.route('/generate_ziwei', methods=['POST'])
def generate_ziwei():
    try:
        # 获取前端发送的JSON数据
        data = request.get_json()

        # 提取参数
        birth_year = data.get('birthYear')
        birth_month = data.get('birthMonth')
        birth_day = data.get('birthDay')
        birth_hour = data.get('birthHour')
        birth_minute = data.get('birthMinute')

        Natal_year = data.get('NatalYear')
        Natal_month = data.get('NatalMonth')
        Natal_day = data.get('NatalDay')
        Natal_hour = data.get('NatalHour')
        Natal_minute = data.get('NatalMinute')

        # birth_hour_decimal = data.get('birthHour_decimal')
        gender = data.get('gender', 'male')

        # print(birth_year,birth_month,birth_day,birth_hour,gender )  #<<<<<<<<<
        # 将小时转换为整数小时和分钟
        hour_int = int(birth_hour)
        minute_int = int(birth_minute)

        # 创建紫微斗数命盘实例
        print(f"/generate_ziwei 生成命盘参数: {birth_year}-{birth_month}-{birth_day} {hour_int}:{minute_int} 性别: {gender}")
        chart = ZiweiChart(birth_year, birth_month, birth_day, hour_int, minute_int, gender)

        # 获取JSON格式的命盘数据
        json_output = chart.to_json()
        if Natal_year>0 and Natal_month>0 and Natal_day>0:
            chartNatal = ZiweiChart(Natal_year, Natal_month, Natal_day, Natal_hour, Natal_minute, gender)
            json_output_natal = chartNatal.to_json()
        else:

            json_output_natal = json.dumps(
                {'palaces': []},
                ensure_ascii=False,  # 允许中文字符直接显示
                indent=2,            # 缩进使输出更易读
                sort_keys=False      # 保持字典原有顺序
            )  # 如果原局时间无效，返回空对象
        # 将命盘数据缓存到session，避免重复计算
        # session['current_chart_params'] = {
        #     'birth_year': birth_year,
        #     'birth_month': birth_month,
        #     'birth_day': birth_day,
        #     'birth_hour': hour_int,
        #     'birth_minute': minute_int,
        #     'gender': gender
        # }
        return {
            "ziwei_chart": json_output,  # 出生时间命盘
            "natal_chart": json_output_natal ,  # 原局时间命盘
            "status": "success"
        }

    except Exception as e:
        return jsonify({'error': str(e)}), 500

EXPORT_PASSWORD = '5shu'

@app.route('/export_feigong', methods=['POST'])
def export_feigong():
    """专门用于生成和返回feigong_str的接口"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': '缺少命盘参数'}), 400
        # 验证密码
        provided_password = data.get('password').strip()
        if utils.verify_password(provided_password):
            print('密码错误')
            # 密码错误，返回空响应
            return '', 401  # 401 Unauthorized

        birth_year = data.get('birthYear')
        birth_month = data.get('birthMonth')
        birth_day = data.get('birthDay')
        birth_hour = data.get('birthHour')
        birth_minute = data.get('birthMinute')
        gender = data.get('gender', 'male')
        if  all(v is  None and v != False and v == "" for v in [birth_year, birth_month, birth_day, birth_hour]):
            return jsonify({'success': False, 'message': '参数不完整'}), 400

        hour_int = int(birth_hour)
        minute_int = int(birth_minute) if birth_minute else 0
        print(f"/export_feigong 生成命盘参数: {birth_year}-{birth_month}-{birth_day} {hour_int}:{minute_int} 性别: {gender}")
        chart = ZiweiChart(birth_year, birth_month, birth_day, hour_int, minute_int, gender)

        # 使用专门的方法生成feigong_str
        formatter = OutputFormatter(chart)
        feigong_str_lines = formatter.get_feigong_str()

        # 奇门 Runtime 输出
        qimen_output = formatter.format_qimen_runtime()

        # 将列表转换为字符串
        # feigong_str = '\n'.join(feigong_str_lines) if isinstance(feigong_str_lines, list) else str(feigong_str_lines)
        # feigong_str=feigong_str_lines

        feigong_str= f"""
{feigong_str_lines}
====================================================================================================
奇门局：

{qimen_output}
"""
        return jsonify({
            'success': True,
            'feigong_str': feigong_str,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        app.logger.error(f"生成feigong_str失败: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'生成命盘文本失败: {str(e)}'
        }), 500

# 获取PythonAnywhere用户目录
USER_HOME = os.path.expanduser('~')
# 数据文件路径 - 放在用户主目录下
DATA_FILE = os.path.join(USER_HOME, 'mingpanData.json')
# CORS支持
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, DELETE, PUT'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

app.after_request(add_cors_headers)

# 初始化数据文件
def init_data_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump({"items": []}, f, ensure_ascii=False, indent=2)
        print(f"已创建新的数据文件: {DATA_FILE}")

# 读取数据
def read_data():
    try:
        init_data_file()
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        app.logger.error(f"读取数据文件失败: {str(e)}")
        app.logger.error(traceback.format_exc())
        return {"items": []}

# 保存数据 - 使用文件锁确保安全写入
def save_data(data):
    try:
        # 创建临时文件
        temp_file = DATA_FILE + '.tmp'

        # 写入临时文件
        with open(temp_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        # 替换原文件
        os.replace(temp_file, DATA_FILE)

        # 确保文件写入完成
        time.sleep(0.1)

        return True
    except Exception as e:
        app.logger.error(f"保存数据文件失败: {str(e)}")
        app.logger.error(traceback.format_exc())
        return False

# 错误处理
@app.errorhandler(500)
def handle_server_error(e):
    app.logger.error(f"服务器错误: {str(e)}")
    app.logger.error(traceback.format_exc())
    return jsonify({
        "success": False,
        "message": "服务器内部错误",
        "error": str(e)
    }), 500

# 获取所有分类
@app.route('/get_all_categories', methods=['GET'])
def get_all_categories():
    try:
        data = read_data()
        items = data.get('items', [])

        # 提取所有唯一的分类
        categories = set()
        for item in items:
            if 'category' in item:
                categories.add(item['category'])

        return jsonify({
            "success": True,
            "categories": list(categories)
        })
    except Exception as e:
        app.logger.error(f"获取分类失败: {str(e)}")
        return jsonify({
            "success": False,
            "message": "获取分类失败",
            "error": str(e)
        }), 500

# 获取所有命盘
@app.route('/get_mingpan', methods=['GET'])
def get_mingpan():
    try:
        category = request.args.get('category', 'all')
        device_id = request.args.get('device_id')
        password = request.args.get('password', '')
        if not device_id:
            return jsonify({
                "success": False,
                "message": "缺少设备标识"
            }), 400
        # 检查密码验证
        provided_password = password.strip()
        if utils.verify_password(provided_password):
            is_verified = False
        else:
            is_verified = True


        data = read_data()
        items = data.get('items', [])

        # 根据验证状态过滤数据
        filtered_items = []
        for item in items:
            item_device_id = item.get('device_info', {}).get('device_id')

            # 添加是否为自己的命盘标记
            item_copy = item.copy()
            item_copy['is_own'] = (item_device_id == device_id)

            # 如果已验证，显示所有命盘
            if is_verified:
                filtered_items.append(item_copy)
            # 否则只显示自己的命盘
            elif item_device_id == device_id:
                filtered_items.append(item_copy)

        # 按分类筛选
        if category != 'all':
            filtered_items = [item for item in filtered_items if item.get('category') == category]

        return jsonify({
            "success": True,
            "data": filtered_items,
            "is_verified": is_verified,
        })
        # # 如果请求的是全部，则返回所有
        # if category == 'all':
        #     return jsonify({"success": True, "data": items})

        # # 否则按分类筛选
        # filtered_items = [item for item in items if item.get('category') == category]
        # return jsonify({"success": True, "data": filtered_items})
    except Exception as e:
        app.logger.error(f"获取命盘失败: {str(e)}")
        return jsonify({
            "success": False,
            "message": "获取命盘数据失败",
            "error": str(e)
        }), 500

# 保存命盘
@app.route('/save_mingpan', methods=['POST'])
def save_mingpan():
    try:
        # 获取请求数据
        new_data = request.json

        # 验证设备ID
        device_id = new_data.get('data', {}).get('deviceId')
        if not device_id:
            device_id = 'weizhi'

        # 读取现有数据
        data = read_data()
        items = data.get('items', [])

        # 检查是否已存在相同数据
        existing = next((item for item in items if
                         item.get('data', {}).get('name') == new_data.get('name') and
                         item.get('data', {}).get('birthYear') == new_data.get('data', {}).get('birthYear') and
                         item.get('data', {}).get('birthMonth') == new_data.get('data', {}).get('birthMonth') and
                         item.get('data', {}).get('birthDay') == new_data.get('data', {}).get('birthDay')), None)

        if existing:
            return jsonify({
                "success": False,
                "message": "该命盘已存在",
                "id": existing['id']
            }), 409

        # 为数据添加ID和时间戳
        new_id = max([item['id'] for item in items], default=0) + 1
        new_data['id'] = new_id
        new_data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # 添加设备信息
        new_data['device_info'] = {
            'device_id': device_id,
            'device_type': new_data.get('data', {}).get('deviceType', 'unknown'),
            'save_time': new_data.get('data', {}).get('saveTime')
        }

        # 添加到列表
        items.append(new_data)
        data['items'] = items

        # 保存数据
        if save_data(data):
            return jsonify({
                "success": True,
                "message": "命盘保存成功",
                "id": new_id
            })
        else:
            return jsonify({
                "success": False,
                "message": "保存文件失败"
            }), 500
    except Exception as e:
        app.logger.error(f"保存命盘失败: {str(e)}")
        return jsonify({
            "success": False,
            "message": "保存命盘失败",
            "error": str(e)
        }), 500

# 删除命盘
@app.route('/delete_mingpan/<int:mingpan_id>', methods=['DELETE'])
def delete_mingpan(mingpan_id):
    try:
        # 读取现有数据
        data = read_data()
        items = data.get('items', [])

        # 查找要删除的项
        original_count = len(items)
        items = [item for item in items if item['id'] != mingpan_id]

        # 如果没有删除任何项
        if len(items) == original_count:
            return jsonify({
                "success": False,
                "message": "未找到指定的命盘记录"
            }), 404

        # 更新数据
        data['items'] = items

        # 保存数据
        if save_data(data):
            return jsonify({
                "success": True,
                "message": "命盘记录已删除"
            })
        else:
            return jsonify({
                "success": False,
                "message": "保存文件失败"
            }), 500
    except Exception as e:
        app.logger.error(f"删除命盘失败: {str(e)}")
        return jsonify({
            "success": False,
            "message": "删除命盘失败",
            "error": str(e)
        }), 500


# Flask + SQLite + JSON 数据库
# 数据库文件路径
DATABASE = 'star_meanings.db'

def get_db_connection():
    """获取数据库连接"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """初始化数据库表"""
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS star_meanings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            star_name TEXT UNIQUE NOT NULL,
            basic TEXT,
            combination TEXT,
            extended TEXT,
            material TEXT,
            health TEXT,
            relationship TEXT,
            career TEXT,
            wealth TEXT,
            mindset TEXT,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# API 路由定义
@app.route('/api/stars', methods=['GET'])
def get_all_stars():
    """获取所有星曜数据"""
    try:
        conn = get_db_connection()
        stars = conn.execute('SELECT * FROM star_meanings').fetchall()
        conn.close()

        # 转换为前端需要的格式
        result = {}
        for star in stars:
            result[star['star_name']] = {
                'starName': star['star_name'],
                'basic': star['basic'] or '',
                'combination': star['combination'] or '',
                'extended': star['extended'] or '',
                'material': star['material'] or '',
                'health': star['health'] or '',
                'relationship': star['relationship'] or '',
                'career': star['career'] or '',
                'wealth': star['wealth'] or '',
                'mindset': star['mindset'] or '',
                'lastUpdated': star['last_updated']
            }

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_sihua_dizhi(star: str, dizhi: str):
    """
    根据星曜+地支取得全部四化信息
    """
    from constants import SIHUA_DIZHI_MAP
    result = ''

    star_data = SIHUA_DIZHI_MAP.get(star, {})

    for hua, hua_data in star_data.items():

        text = hua_data.get(dizhi)

        if text:
            result += f'{hua}：{text}\n'

    return result


@app.route('/api/stars/<star_name>/<dizhi>', methods=['GET'])
def get_star(star_name, dizhi):
    """获取单个星曜数据"""

    try:
        conn = get_db_connection()
        star = conn.execute(
            'SELECT * FROM star_meanings WHERE star_name = ?',
            (star_name,)
        ).fetchone()
        conn.close()

        if star:
            return jsonify({
                'starName': star['star_name'],
                'basic': star['basic'] or '',
                'combination': star['combination'] or '',
                'extended': star['extended'] or '',
                'material': star['material'] or '',
                'health': star['health'] or '',
                'relationship': star['relationship'] or '',
                'career': star['career'] or '',
                'wealth': star['wealth'] or '',
                'mindset': star['mindset'] or '',
                'sihua_dizhi': get_sihua_dizhi(star_name, dizhi) if dizhi else '',
                'lastUpdated': star['last_updated']
            })
        return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

from app_rule_db import ZiWeiEngine, Edge
@app.route('/api/sihuas/<gan>', methods=['GET'])
# @login_required  # 如果你的系统需要登录才能查看，可以把注释解开
def get_sihua(gan):
    """
    根据宫干获取飞出四化的星曜及解读（按需获取，防止业务核心字典外泄）
    请求参数:
      - gan: 宫干 (例如 '甲', '乙')
    """
    try:
        if not gan:
            return jsonify({'success': False, 'message': '缺少参数: gan(宫干)'}), 400

        source_palace = request.args.get('source')  # 飞出的 A 宫 (例如: "命宫")
        targets_str = request.args.get('targets')   # 飞入的 B 宫及星曜参数 JSON 串
        password = request.args.get('password')  # 可选的访问密码参数
        if password == '':  # 简单的访问密码验证
            return jsonify({'success': False, 'message': '当前账户没有登陆'}), 401

        if not source_palace or not targets_str:
            return jsonify({'success': False, 'message': '缺少必要参数: source 或 targets'}), 400

        # 从后端的常量库中引入核心映射表（确保 constants.py 中已定义这两个字典）
        from constants import TIANGAN_SIHUA, STAR_SIHUA_MAP,BRIGHTNESS_LEVEL_MAP,PALACE_SIHUA_MAP
        import json
        targets = json.loads(targets_str)  # 解析飞入的 B 宫及星曜参数

        if gan not in TIANGAN_SIHUA:
            return jsonify({'success': False, 'message': f'无效的宫干: {gan}'}), 400

        # 1. 获取该宫干触发的四化星曜，例如甲干返回 {'禄':'廉贞', '权':'破军', '科':'武曲', '忌':'太阳'}
        sihua_stars = TIANGAN_SIHUA[gan]

        # 2. 组装返回数据，带上对应的核心解读
        sihua_data = {}

        # 获取 A宫 动机（如果常量文件没配全，使用兜底字符）
        source_motive = PALACE_SIHUA_MAP.get('PALACE_SOURCE', {}).get(f"{source_palace}宫", f"{source_palace}的能量运作")

        for sihua_type, target_info in targets.items():
            star_name = target_info.get('star')
            target_palace = target_info.get('palace')
            brightness = target_info.get('brightness', 'mid')

            # 1. 亮度映射（获取 high/mid/low）
            level = BRIGHTNESS_LEVEL_MAP.get(brightness, 'mid')

            # 2. 提取动作与 B宫 结果
            action = STAR_SIHUA_MAP.get(star_name, {}).get(sihua_type, "作用于").get(level, "X")
            result_face = PALACE_SIHUA_MAP.get('PALACE_TARGET', {}).get(target_palace, f"{target_palace}的领域")

            # 3. 获取底层星曜四化解释
            star_explanations = STAR_SIHUA_MAP.get(star_name, {}).get(sihua_type, {})
            # 兼容带有方块 □ 的默认配置，或者回退到纯文字默认
            star_meaning = star_explanations.get(level, star_explanations.get('mid', f"关于【{star_name}】的特殊显化"))

            # 4. 拼装神级断语文案（HTML格式）
            logic_text = f"<br/><b>{source_palace}[{source_motive}]</b> ➔ <b>[{action}]</b> ➔ <b>{target_palace}[{result_face}]</b> "
            result_text = f"表现为：<b>“{star_meaning}”</b>。"

            # print(f"四化分析: {source_palace} {target_palace}")  # <<<<<<<<
            edges = [
                Edge(utils.normalize_palace(source_palace), utils.normalize_palace(target_palace), sihua_type),
            ]
            selfs = [
            ]

            engine = ZiWeiEngine(edges, selfs)

            result = engine.analyze()

            logic_sihua3=""
            for item in result["details"]:
                # print(f"分析细节: {item}")  # <<<<<<<<
                logic_sihua3+=f"<br/>&emsp;{item["meanings"]}"

            logic_sihua4=f"<br/>&emsp;{result["final"]}"


            sihua_data[sihua_type] = {
                'star': star_name,
                'target_palace': target_palace,
                'brightness': brightness,
                # 'logic_text': logic_text,
                # 'result_text': result_text,
                'logic_sihua1': PALACE_SIHUA_MAP.get('SIHUA_ACTION', {}).get(sihua_type, "作用于").get("X"),
                'logic_source': source_motive,
                'logic_sihua2': action,
                'logic_target': result_face,
                'logic_sihua3': logic_sihua3,
                # 'logic_sihua4': logic_sihua4,
            }


        # for sihua_type, star_name in sihua_stars.items():
        #     # 从核心业务字典中提取该星曜对应这种四化的全部能级解释 (high/mid/low)
        #     star_explanations = STAR_SIHUA_MAP.get(star_name, {}).get(sihua_type, {
        #         # 兜底解释，防止字典配漏
        #         'high': f'关于【{star_name}】的高阶显化',
        #         'mid': f'关于【{star_name}】的常规显化',
        #         'low': f'关于【{star_name}】的低阶显化'
        #     })

        #     sihua_data[sihua_type] = {
        #         'star': star_name,
        #         'explanations': star_explanations
        #     }

        return jsonify({
            'success': True,
            'gan': gan,
            'data': sihua_data
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': '服务器内部错误'}), 500

@app.route('/api/stars', methods=['POST'])
def save_star():
    """保存星曜数据（创建或更新）"""
    try:
        data = request.json
        conn = get_db_connection()

        # 检查是否存在
        existing = conn.execute(
            'SELECT id FROM star_meanings WHERE star_name = ?',
            (data['starName'],)
        ).fetchone()

        if existing:
            # 更新
            conn.execute('''
                UPDATE star_meanings SET
                basic=?, combination=?, extended=?, material=?, health=?,
                relationship=?, career=?, wealth=?, mindset=?, last_updated=?
                WHERE star_name=?
            ''', (
                data.get('basic', ''),
                data.get('combination', ''),
                data.get('extended', ''),
                data.get('material', ''),
                data.get('health', ''),
                data.get('relationship', ''),
                data.get('career', ''),
                data.get('wealth', ''),
                data.get('mindset', ''),
                datetime.now().isoformat(),
                data['starName']
            ))
        else:
            # 插入
            conn.execute('''
                INSERT INTO star_meanings
                (star_name, basic, combination, extended, material, health,
                 relationship, career, wealth, mindset, last_updated)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                data['starName'],
                data.get('basic', ''),
                data.get('combination', ''),
                data.get('extended', ''),
                data.get('material', ''),
                data.get('health', ''),
                data.get('relationship', ''),
                data.get('career', ''),
                data.get('wealth', ''),
                data.get('mindset', ''),
                datetime.now().isoformat()
            ))

        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': '保存成功'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stars/<star_name>', methods=['DELETE'])
def delete_star(star_name):
    """删除星曜数据"""
    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM star_meanings WHERE star_name = ?', (star_name,))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': '删除成功'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/import/batch', methods=['POST'])
def import_batch():
    """批量导入星曜数据"""
    try:
        data = request.json
        conn = get_db_connection()

        imported_count = 0
        for star_name, meaning_data in data.items():
            try:
                # 检查是否存在
                existing = conn.execute(
                    'SELECT id FROM star_meanings WHERE star_name = ?',
                    (star_name,)
                ).fetchone()

                if existing:
                    # 更新
                    conn.execute('''
                        UPDATE star_meanings SET
                        basic=?, combination=?, extended=?, material=?, health=?,
                        relationship=?, career=?, wealth=?, mindset=?, last_updated=?
                        WHERE star_name=?
                    ''', (
                        meaning_data.get('basic', ''),
                        meaning_data.get('combination', ''),
                        meaning_data.get('extended', ''),
                        meaning_data.get('material', ''),
                        meaning_data.get('health', ''),
                        meaning_data.get('relationship', ''),
                        meaning_data.get('career', ''),
                        meaning_data.get('wealth', ''),
                        meaning_data.get('mindset', ''),
                        datetime.now().isoformat(),
                        star_name
                    ))
                else:
                    # 插入
                    conn.execute('''
                        INSERT INTO star_meanings
                        (star_name, basic, combination, extended, material, health,
                         relationship, career, wealth, mindset, last_updated)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        star_name,
                        meaning_data.get('basic', ''),
                        meaning_data.get('combination', ''),
                        meaning_data.get('extended', ''),
                        meaning_data.get('material', ''),
                        meaning_data.get('health', ''),
                        meaning_data.get('relationship', ''),
                        meaning_data.get('career', ''),
                        meaning_data.get('wealth', ''),
                        meaning_data.get('mindset', ''),
                        datetime.now().isoformat()
                    ))

                imported_count += 1
            except Exception as e:
                print(f"导入失败 {star_name}: {e}")
                continue

        conn.commit()
        conn.close()
        return jsonify({'success': True, 'importedCount': imported_count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export', methods=['GET'])
def export_data():
    """导出所有数据"""
    try:
        conn = get_db_connection()
        stars = conn.execute('SELECT * FROM star_meanings').fetchall()
        conn.close()

        result = {}
        for star in stars:
            # result[star['star_name']] = dict(star)
            result[star['star_name']] = {
                'starName': star['star_name'],
                'basic': star['basic'] or '',
                'combination': star['combination'] or '',
                'extended': star['extended'] or '',
                'material': star['material'] or '',
                'health': star['health'] or '',
                'relationship': star['relationship'] or '',
                'career': star['career'] or '',
                'wealth': star['wealth'] or '',
                'mindset': star['mindset'] or '',
                'lastUpdated': star['last_updated']
            }

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# -------------------------------------------------------------------------------
# 用户认证和管理功能
def init_user_db():
    """初始化用户数据库表"""
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE NOT NULL,  -- 8位数字标识码
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            user_type TEXT NOT NULL DEFAULT 'member',  -- 'admin' 或 'member'
            points INTEGER DEFAULT 100,  -- 初始积分
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')

    # 创建默认管理员账户（如果不存在）
    admin_exists = conn.execute('SELECT id FROM users WHERE user_type = ?', ('admin',)).fetchone()
    if not admin_exists:
        admin_id = generate_user_id()
        password_hash = hash_password('admin123')
        conn.execute('''
            INSERT INTO users (user_id, username, password_hash, user_type, points)
            VALUES (?, ?, ?, ?, ?)
        ''', (admin_id, 'admin', password_hash, 'admin', 9999))

    conn.commit()
    conn.close()

def hash_password(password):
    """密码哈希"""
    # return hashlib.sha256(password.encode()).hexdigest()
    return password

def generate_user_id():
    """生成8位数字用户ID"""
    # return str(secrets.randbelow(90000000) + 10000000)
    return 'admin'

# 登录验证装饰器
def login_required(f):
    # @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'success': False, 'message': '请先登录'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    # @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('user_type') != 'admin':
            return jsonify({'success': False, 'message': '需要管理员权限'}), 403
        return f(*args, **kwargs)
    return decorated_function

# 用户认证路由
@app.route('/api/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'success': False, 'message': '用户名和密码不能为空'}), 400

        if len(password) < 6:
            return jsonify({'success': False, 'message': '密码至少6位'}), 400

        conn = get_db_connection()

        # 检查用户名是否已存在
        existing = conn.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
        if existing:
            conn.close()
            return jsonify({'success': False, 'message': '用户名已存在'}), 400

        # 生成用户ID和哈希密码
        user_id = generate_user_id()
        password_hash = hash_password(password)

        # 插入用户
        conn.execute('''
            INSERT INTO users (user_id, username, password_hash, points)
            VALUES (?, ?, ?, ?)
        ''', (user_id, username, password_hash, 100))

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': '注册成功',
            'user_id': user_id,
            'username': username
        })

    except Exception as e:
        return jsonify({'success': False, 'message': f'注册失败: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        conn = get_db_connection()
        user = conn.execute(
            'SELECT * FROM users WHERE username = ?',
            (username,)
        ).fetchone()
        conn.close()

        if user and user['password_hash'] == hash_password(password):
            # 登录成功，设置session
            session['user_id'] = user['user_id']
            session['username'] = user['username']
            session['user_type'] = user['user_type']
            session['points'] = user['points']

            # 更新最后登录时间
            conn = get_db_connection()
            conn.execute(
                'UPDATE users SET last_login = ? WHERE user_id = ?',
                (datetime.now().isoformat(), user['user_id'])
            )
            conn.commit()
            conn.close()

            return jsonify({
                'success': True,
                'message': '登录成功',
                'user': {
                    'user_id': user['user_id'],
                    'username': user['username'],
                    'user_type': user['user_type'],
                    'points': user['points']
                }
            })
        else:
            return jsonify({'success': False, 'message': '用户名或密码错误'}), 401

    except Exception as e:
        return jsonify({'success': False, 'message': f'登录失败: {str(e)}'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    """用户退出"""
    session.clear()
    return jsonify({'success': True, 'message': '退出成功'})

@app.route('/api/user/current')
def get_current_user():
    """获取当前用户信息"""
    if 'user_id' in session:
        return jsonify({
            'success': True,
            'user': {
                'user_id': session.get('user_id'),
                'username': session.get('username'),
                'user_type': session.get('user_type'),
                'points': session.get('points', 0)
            }
        })
    else:
        return jsonify({'success': False, 'message': '未登录'})

# 用户管理路由
@app.route('/api/admin/users')
# @login_required
# @admin_required
def get_all_users():
    """获取所有用户信息（仅管理员）"""
    try:
        conn = get_db_connection()
        users = conn.execute('''
            SELECT user_id, username, user_type, points, created_at, last_login
            FROM users ORDER BY created_at DESC
        ''').fetchall()
        conn.close()

        users_list = [dict(user) for user in users]
        return jsonify({'success': True, 'users': users_list})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/admin/users/<user_id>', methods=['PUT'])
# @login_required
# @admin_required
def update_user(user_id):
    """更新用户信息（仅管理员）"""
    try:
        data = request.json
        conn = get_db_connection()

        # 检查用户是否存在
        user = conn.execute('SELECT * FROM users WHERE user_id = ?', (user_id,)).fetchone()
        if not user:
            conn.close()
            return jsonify({'success': False, 'message': '用户不存在'}), 404

        # 更新用户信息
        update_fields = []
        update_values = []

        if 'user_type' in data:
            update_fields.append('user_type = ?')
            update_values.append(data['user_type'])

        if 'points' in data:
            update_fields.append('points = ?')
            update_values.append(data['points'])

        if update_fields:
            update_values.append(user_id)
            conn.execute(
                f'UPDATE users SET {", ".join(update_fields)} WHERE user_id = ?',
                update_values
            )
            conn.commit()

        conn.close()
        return jsonify({'success': True, 'message': '更新成功'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/user/update_profile', methods=['POST'])
# @login_required
def update_profile():
    """用户更新自己的信息"""
    try:
        data = request.json
        user_id = session.get('user_id')

        conn = get_db_connection()

        if 'password' in data and data['password']:
            if len(data['password']) < 6:
                conn.close()
                return jsonify({'success': False, 'message': '密码至少6位'}), 400

            password_hash = hash_password(data['password'])
            conn.execute(
                'UPDATE users SET password_hash = ? WHERE user_id = ?',
                (password_hash, user_id)
            )

        conn.commit()
        conn.close()

        # 更新session中的积分信息
        if 'points' in data:
            session['points'] = data['points']

        return jsonify({'success': True, 'message': '更新成功'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route("/api/hexagram/image/<name>", methods=['GET'])
def hexagram_image(name):
    HEXAGRAM_IMAGE = {
        "乾为天": {"page": "001.png"	,'content':'【乾】主动力发动、全面推进<br/>官人在梯上、云中鹿、发光玉石、磨玉人、工匠、官人回望<br/>①平步青云。②不求禄而禄自来。③人才待时发光。④功成仍需磨炼。⑤可自立门户创业。⑥盛极易衰。⑦升迁后须戒骄戒争，否则旦夕而败。'},
        "坤为地": {"page": "002.png"	,'content':'【坤】承载接受、资源汇聚<br/>厚土、妇人、牛马、田园、承载万物<br/>①顺势而行。②以柔克刚。③利辅佐不利争先。④包容承载。⑤守成优于开创。⑥积累终有收获。'},
        "水雷屯": {"page": "003.png"	,'content':'【屯】开局困难、局势混沌<br/>望竿、人立、犬、泥车、牛回头、射文书、合盒<br/>①创业艰难。②局势未明。③进退两难。④小人阻碍。⑤贵人在侧但未发力。⑥逆向而行反吉。⑦先成后破。'},
        "山水蒙": {"page": "004.png"	,'content':'【蒙】信息不足、认知未开<br/>宝船、水船、鹿、双钱、碗、折枝李树<br/>①图财而受蒙蔽。②远行求财。③虽有禄而不安。④财来路不正。⑤得财快失财亦快。⑥先成后破。'},
        "水天需": {"page": "005.png"	,'content':'【需】等待时机、积蓄力量<br/>明月、门户、攀龙尾、僧人、墓地<br/>①等待时机。②依附贵人。③不可躁进。④置之死地而后生。⑤静守化险。⑥修心可避灾。'},
        "天水讼": {"page": "006.png"	,'content':'【讼】利益冲突、争议形成<br/>口舌、睡虎、云中文书、人立虎下、柳树<br/>①官司诉讼。②纠纷争执。③理想大于现实。④身处险境而不自知。⑤近险反成脱险之机。⑥以柔克刚可化灾。'},
        "地水师": {"page": "007.png"	,'content':'【师】组织动员、统一行动<br/>虎马羊、文武印绶、棋盘、将军台、羊回首、虎马相随<br/>①统军掌权。②谋略胜于蛮力。③号令众人。④武职大利。⑤危机有转机。⑥得靠山而成事。'},
        "水地比": {"page": "008.png"	,'content':'【比】联盟合作、相互依附<br/>圆月、三星、秀才饮酒、自斟自饮、药炉、枯树开花<br/>①得贤人辅佐。②政事清明。③无忧无争。④独处而安。⑤无病无灾。⑥晚发成名。⑦制度既立则事成。'},
        "风天小畜": {"page": "009.png"	,'content':'【小畜】小规模积累、暂时压制<br/>两重山、山顶人、横舟、草中望竿、羊马<br/>①知险而止。②蓄势待发。③已达高处即将转折。④等待消息。⑤贵人将至。⑥不可贸然行动。'},
        "天泽履": {"page": "010.png"	,'content':'【履】在风险中谨慎前行<br/>虎尾、行人、道路、礼仪秩序<br/>①如履薄冰。②谨慎行事。③守礼则吉。④逾矩则凶。⑤能近权贵但不可犯上。⑥小心反而平安。'},
        "地天泰": {"page": "011.png"	,'content':'【泰】上下畅通、循环顺畅<br/>月中桂开、官人登梯、鹿衔书、云中小儿、羊回头<br/>①天地交泰。②升迁顺遂。③受恩得禄。④少年得志。⑤贵人扶持。⑥绝处逢生。'},
        "天地否": {"page": "012.png"	,'content':'【否】上下隔绝、循环堵塞<br/>病人、破镜、路障、小人拍掌、舌头、黑点<br/>①闭塞不通。②小人阻路。③破镜难圆。④鸟尽弓藏。⑤谣言中伤。⑥官司口舌。⑦夫妻不利。'},
        "天火同人": {"page": "013.png"	,'content':'【同人】群体同心、目标一致<br/>捧心文书、射山之箭、饮水鹿、小溪<br/>①同心协力。②得民心。③高中扬名。④财禄自来。⑤贤人出世。⑥合作成功。'},
        "火天大有": {"page": "014.png"	,'content':'【大有】资源集中、大量拥有<br/>妇人怀孕、双子、药王、发光药、受药妇人、犬<br/>①大有收获。②双喜临门。③灾中有救。④得良医。⑤表面抗拒内心接受。⑥福禄俱全。'},
        "地山谦": {"page": "015.png"	,'content':'【谦】主动退让、降低阻力<br/>明月、骑鹿人、山后乱丝、贵人捧镜、公字<br/>①谦逊得福。②才禄兼备。③小人暗藏。④公正执法。⑤以公处事得理。'},
        "雷地豫": {"page": "016.png"	,'content':'【豫】气氛轻松、准备行动<br/>两重山、官人、禄马、金银锭、钱堆<br/>①外出谋事。②经商获利。③财禄丰盛。④乐极生忧。⑤喜中藏丧。'},
        "泽雷随": {"page": "017.png"	,'content':'【随】顺势跟随、借力运行<br/>雁传书、钱堆、朱门、求仕士人、串钱、聚珠盆<br/>①喜讯到来。②财聚。③见贵人。④求名有望。⑤利有阻滞。⑥先聚后散。'},
        "山风蛊": {"page": "018.png"	,'content':'【蛊】旧问题积累待整顿<br/>云中孩儿、雁衔书、鹿、空中钱、男女相拜<br/>①天助成事。②消息到来。③大利可得。④心存图利。⑤因利结合。⑥合作多非真情。'},
        "地泽临": {"page": "019.png"	,'content':'【临】接近目标、开始介入<br/>乘风妇人、使节车、山顶人、坐虎、合盒、射箭人<br/>①有外援。②善谋可解灾。③盛极将衰。④受困于强敌。⑤先成后破。⑥外敌侵扰。'},
        "风地观": {"page": "020.png"	,'content':'【观】观察评估、形成判断<br/>日月当空、香案官人、山上鹿、金甲卫士、印信秤杆<br/>①政治清明。②神人共鉴。③高禄可得。④受保护。⑤获得授权。⑥名正言顺。'},
        "火雷噬嗑": {"page": "021.png"	,'content':'【噬嗑】强力处理、排除障碍<br/>北斗星、烧香妇人、忧喜字、鸡食稻、钱财鹿、禽鸟<br/>①求助于天。②人事无力。③忧中有喜。④所得被夺。⑤财禄之事令人忧心。⑥离多聚少。'},
        "山火贲": {"page": "022.png"	,'content':'【贲】包装修饰、外观强化<br/>甘雨、官车、扬帆船、公服登梯、云中仙女<br/>①润泽成功。②外出任职。③顺风顺水。④升迁外调。⑤得女性贵人提携。'},
        "山地剥": {"page": "023.png"	,'content':'【剥】结构剥落、逐渐失去<br/>妇人坐床、风烛、葫芦、缫丝、官人靠山、树挂冠巾<br/>①阴盛阳衰。②暗灾来临。③医药难救。④事务缠身。⑤虽有靠山仍受牵制。⑥有辞职退隐之意。'},
        "地雷复": {"page": "024.png"	,'content':'【复】回归原点、重新开始<br/>官车、双旗、东字堠、持刀将军、兔、虎<br/>①回归正道。②调职升迁。③重掌权柄。④军权司法。⑤旧事重来。⑥绝处逢生。'},
        "天雷无妄": {"page": "025.png"	,'content':'【无妄】非计划事件突然发生<br/>射鹿官人、衔书鹿、水中钱、鼠猪<br/>①意外之事。②自乱阵脚。③财讯到来。④险中求财。⑤暗藏阴谋。⑥不可妄为。'},
        "山天大畜": {"page": "026.png"	,'content':'【大畜】大规模蓄积力量<br/>鹿马、月下文书、凭栏官人、盆花<br/>①积蓄力量。②大富之象。③机缘将至未至。④静观等待。⑤能力受限。⑥厚积薄发。'},
        "山雷颐": {"page": "027.png"	,'content':'【颐】供养输入、维持生机<br/>甘雨、三孩童、太阳、香案、紫衣官人、引荐者<br/>①受恩得养。②同心协力。③君明臣贤。④有所求而得。⑤贵人提携。⑥受推荐而进身。'},
        "泽风大过": {"page": "028.png"	,'content':'【大过】结构超载、压力过大<br/>双旗官车、破喜字、朱门、门外贵人、地上文书、合盒<br/>①压力过大。②官司诉讼。③婚姻有损。④被拒门外。⑤契约失效。⑥先成后破。'},
        "坎为水": {"page": "029.png"	,'content':'【坎】陷入风险、反复受阻<br/>井中人、绳索、牛、鼠、虎头人<br/>①陷险。②牢狱官司。③劳苦奔波。④暗中陷害。⑤贵人相救。⑥险中求生。'},
        "离为火": {"page": "030.png"	,'content':'【离】光明显现、依附传播<br/>虎背之人、江心孤船、执箭官人<br/>①身处险境仍前行。②进退两难。③口舌争执。④权力与压力并存。⑤有被攻击之象。'},
        "泽山咸": {"page": "031.png"	,'content':'【咸】相互感应、关系形成<br/>空中拳、钱宝堆、山顶贵人、女人上山、合盒<br/>①感应而成。②得贵人提拔。③求财得财。④夫妻和合。⑤诚感则吉。⑥盛极将退。⑦先成后破。'},
        "雷风恒": {"page": "032.png"	,'content':'【恒】长期维持、持续运行<br/>云中日、凤衔书、行路官人、道士指斗、鼠下双口<br/>①长期经营。②喜讯到来。③贵人将至。④有出家避世之象。⑤暗藏阴谋。⑥坚持则成。'},
        "天山遁": {"page": "033.png"	,'content':'【遁】主动退出、远离是非<br/>山、水、酒旗、踏龟官人、树挂官帽、云中月、水边人、独酌者<br/>①知退保身。②避险远祸。③得人提携。④辞官退隐。⑤局势未明。⑥静观其变。⑦退一步反而平安。'},
        "雷天大壮": {"page": "034.png"	,'content':'【大壮】力量增强、强势推进<br/>北斗、执剑天神、烧香官人、猴兔犬、回头兽群<br/>①权势强盛。②民意归附。③力量巨大。④过度依赖天意则凶。⑤在野贤人将现。⑥盛极需防反转。'},
        "火地晋": {"page": "035.png"	,'content':'【晋】快速上升、向上发展<br/>破字、掩面官人、泥球、鸡衔秤、枯木花、衔书鹿、金宝、水边人、石心<br/>①晋升受阻后再升。②羞愧失势。③求事陷险。④终得公平。⑤晚发。⑥财禄将至。⑦坚守终成。'},
        "地火明夷": {"page": "036.png"	,'content':'【明夷】光明受伤、能力受压<br/>井中妇人、外虎、缺钱、逐鹿人、堠、鹿回头、木枝<br/>①光明受伤。②家中有灾。③外敌窥伺。④争名逐利反失财。⑤有人从中作梗。⑥防火灾。⑦宜藏锋守拙。'},
        "风火家人": {"page": "037.png"	,'content':'【家人】内部治理、秩序建立<br/>张弓人、水边带子、云中文书、贵人受命、妇人携手<br/>①家庭为本。②暗中有人破坏。③喜讯忽至。④受命升迁。⑤家和万事兴。⑥婚姻大吉。'},
        "火泽睽": {"page": "038.png"	,'content':'【睽】方向不同、意见分裂<br/>执斧人、破文书、牛鼠、桃花、关门、孤雁<br/>①分离背离。②契约毁约。③孤独。④牢狱阻隔。⑤悲讯。⑥人心不齐。'},
        "水山蹇": {"page": "039.png"	,'content':'【蹇】前行受阻、行动困难<br/>太阳、使旗、五鼓、鹿、千里堠<br/>①前路艰难。②远行奔波。③和平使者。④旅客带财。⑤需二次努力方成。⑥西南有利。'},
        "雷水解": {"page": "040.png"	,'content':'【解】困难解除、压力释放<br/>提字旗、地刀、奔兔、鸣鸡、云中贵人、指门道士、献书道人<br/>①解困脱险。②远走避祸。③竞争出现。④贵人虽来稍迟。⑤有出家避世象。⑥危机最终解除。'},
        "山泽损": {"page": "041.png"	,'content':'【损】主动减损、交换代价<br/>二人对饮、倒酒瓶、地上球、双册文书<br/>①先损后得。②当前希望落空。③所求不成。④需再次争取。⑤坚持二次努力方成。'},
        "风雷益": {"page": "042.png"	,'content':'【益】资源增加、获得补充<br/>抱盒官人、推车人、鹿、钱<br/>①损上益下。②顺势而动。③才禄俱备。④财有损耗。⑤明知风险仍担当。⑥利天下而成自身。'},
        "泽天夬": {"page": "043.png"	,'content':'【夬】最终决断、彻底切割<br/>同行二人、水火路、虎蛇、斩蛇勇士、文字旗、钱、火<br/>①果断决断。②先险后明。③奸邪阻路。④斩奸除恶。⑤正名出师。⑥行动有利。⑦伴随代价与牺牲。'},
        "天风姤": {"page": "044.png"	,'content':'【姤】意外相遇、突发介入<br/>射鹿官人、喜字文书、执索二人、绿衣人、双山<br/>①意外相遇。②求禄之象。③缘分不稳。④彼此牵累。⑤遇人生转折点。⑥阻碍重重。'},
        "泽地萃": {"page": "045.png"	,'content':'【萃】人事聚集、资源集中<br/>磨玉人、僧人、山路孩童、救火人、火上鱼、凤衔书<br/>①聚众成势。②专心修炼。③得人指点。④以退为进。⑤救人济世。⑥喜讯来到。'},
        "地风升": {"page": "046.png"	,'content':'【升】稳步提升、逐渐成长<br/>雨点、木匠、磨镜人、负木架、大镜<br/>①循序渐进。②有法可循。③努力终见成果。④积累财富。⑤竞争存在。⑥百废待兴。'},
        "泽水困": {"page": "047.png"	,'content':'【困】资源耗尽、陷于窘境<br/>地下车轮、病人、药炉、救鱼贵人、池草<br/>①身陷困境。②孤立无援。③病灾压力。④等待救援。⑤贵人资助。⑥尚有生机。'},
        "水风井": {"page": "048.png"	,'content':'【井】基础资源持续供应<br/>金甲神、抱盒女子、发光财宝、井中人、救人官人<br/>①基础资源。②先成后破。③财不外露。④陷害受困。⑤贵人援救。⑥策略胜过蛮力。'},
        "泽火革": {"page": "049.png"	,'content':'【革】旧体系被替换<br/>全柿人、半柿人、兔、虎、带印官车、虎兔同行、大路<br/>①变革更新。②真话与半真话并存。③跃进突破。④掌权改革。⑤挂印封侯。⑥旧人退新人成。⑦改革后道路畅通。'},
        "火风鼎": {"page": "050.png"	,'content':'【鼎】新体系建立完成<br/><待补充>新体系建立完成<br/>①鼎新革故。②拨云见月。③名位稳定。④事业定型。⑤吉庆将临。'},
        "震为雷": {"page": "051.png"	,'content':'【震】突发变化、强力启动<br/><待补充>突发变化、强力启动<br/>①突发事件。②惊而后定。③先恐后吉。④行动开始。⑤停滞被打破。'},
        "艮为山": {"page": "052.png"	,'content':'【艮】停止行动、边界形成<br/><待补充>停止行动、边界形成<br/>①停止。②守静。③不宜妄动。④见好即收。⑤守成有利。'},
        "风山渐": {"page": "053.png"	,'content':'【渐】缓慢推进、逐步成熟<br/><待补充>缓慢推进、逐步成熟<br/>①逐步发展。②婚姻渐成。③事业渐进。④急不得。'},
        "雷泽归妹": {"page": "054.png"	,'content':'【归妹】非正常结合、仓促配对<br/><待补充>非正常结合、仓促配对<br/>①婚嫁之事。②关系不稳。③名份问题。④仓促结合易生变。'},
        "雷火丰": {"page": "055.png"	,'content':'【丰】达到高峰、极度繁盛<br/>竹简、龙蛇、官人、合盒、吹笙人、踏虎、旱池、落珠<br/>①盛大丰收。②正邪并存。③喜事临门。④先成后破。⑤临危不乱。⑥繁华之后易衰。⑦聚而后散。'},
        "火山旅": {"page": "056.png"	,'content':'【旅】暂时寄居、流动状态<br/><待补充>暂时寄居、流动状态<br/>①漂泊。②外出。③寄人篱下。④不宜久留。'},
        "巽为风": {"page": "057.png"	,'content':'【巽】渗透扩散、逐渐影响<br/>赐衣贵人、跪受者、传书雁、人坐虎下、射虎者、逃虎<br/>①受恩得助。②贵人提拔。③意外喜讯。④身在险中。⑤关键时刻有人相救。⑥最终脱险。'},
        "兑为泽": {"page": "058.png"	,'content':'【兑】交流沟通、愉悦互动<br/><待补充>交流沟通、愉悦互动<br/>①喜悦。②交流。③口才。④人际和谐。⑤过度享乐则损。'},
        "风水涣": {"page": "059.png"	,'content':'【涣】组织松散、力量分散<br/>山寺、僧人、跟随者、鬼、金甲神<br/>①离散。②逃避现实。③寻求帮助。④内心恐惧。⑤正义力量出现。⑥等待时机。'},
        "水泽节": {"page": "060.png"	,'content':'【节】建立限制、规范行为<br/>大雨、火鱼、屋顶鸡、井中犬、开门屋舍<br/>①节制。②过度则凶。③徒劳无功。④陷入困局。⑤仍留生机。⑥需贵人帮助。'},
        "风泽中孚": {"page": "061.png"	,'content':'【中孚】信任形成、诚信传递<br/><待补充>信任形成、诚信传递<br/>①诚信立身。②以诚感人。③内外一致。④契约可成。⑤欺诈必败。'},
        "雷山小过": {"page": "062.png"	,'content':'【小过】小幅超越、局部突破<br/><待补充>小幅超越、局部突破<br/>①小事可成。②大事不宜。③谨慎行事。④过犹不及。⑤低飞比高飞安全。'},
        "水火既济": {"page": "063.png"	,'content':'【既济】事情完成、结构稳定<br/><待补充>事情完成、结构稳定<br/>①事情完成。②功成名就。③盛极防衰。④完成不是结束。⑤守成最难。'},
        "火水未济": {"page": "064.png"	,'content':'【未济】尚未完成、仍待推进<br/>刀斧人、坐虎、山头旗、取旗人、梯子<br/>①大业未成。②革命未竟。③正义之师已起。④新旧权力交替。⑤受困受制。⑥距离成功只差最后一步。'},
    }

    return jsonify({'success': True,
        "image_url":f"/static/hexagrams/pages/{HEXAGRAM_IMAGE[name]['page']}",
        "content":HEXAGRAM_IMAGE[name]['content']
    })

@app.route("/api/hexagram/<year_gz>/<month_gz>/<day_gz>/<hour_gz>", methods=['GET'])
def hexagram(year_gz,month_gz,day_gz,hour_gz):

    GAN_NUM = {
        "甲":1,"乙":2,"丙":3,"丁":4,"戊":5,
        "己":6,"庚":7,"辛":8,"壬":9,"癸":10
    }

    ZHI_NUM = {
        "子":1,"丑":2,"寅":3,"卯":4,
        "辰":5,"巳":6,"午":7,"未":8,
        "申":9,"酉":10,"戌":11,"亥":12
    }

    BAGUA_NUM = {
        1:"乾",
        2:"兑",
        3:"离",
        4:"震",
        5:"巽",
        6:"坎",
        7:"艮",
        8:"坤"
    }

    HEXAGRAM_MAP = {
        ("乾","乾"): ("乾为天",1),
        ("坤","坤"): ("坤为地",2),

        ("坎","震"): ("水雷屯",3),
        ("艮","坎"): ("山水蒙",4),
        ("坎","乾"): ("水天需",5),
        ("乾","坎"): ("天水讼",6),
        ("坤","坎"): ("地水师",7),
        ("坎","坤"): ("水地比",8),

        ("巽","乾"): ("风天小畜",9),
        ("乾","兑"): ("天泽履",10),
        ("坤","乾"): ("地天泰",11),
        ("乾","坤"): ("天地否",12),

        ("乾","离"): ("天火同人",13),
        ("离","乾"): ("火天大有",14),
        ("坤","艮"): ("地山谦",15),
        ("震","坤"): ("雷地豫",16),

        ("兑","震"): ("泽雷随",17),
        ("艮","巽"): ("山风蛊",18),
        ("坤","兑"): ("地泽临",19),
        ("巽","坤"): ("风地观",20),

        ("离","震"): ("火雷噬嗑",21),
        ("艮","离"): ("山火贲",22),
        ("艮","坤"): ("山地剥",23),
        ("坤","震"): ("地雷复",24),

        ("乾","震"): ("天雷无妄",25),
        ("艮","乾"): ("山天大畜",26),
        ("艮","震"): ("山雷颐",27),
        ("兑","巽"): ("泽风大过",28),

        ("坎","坎"): ("坎为水",29),
        ("离","离"): ("离为火",30),

        ("兑","艮"): ("泽山咸",31),
        ("震","巽"): ("雷风恒",32),
        ("乾","艮"): ("天山遁",33),
        ("震","乾"): ("雷天大壮",34),

        ("离","坤"): ("火地晋",35),
        ("坤","离"): ("地火明夷",36),
        ("巽","离"): ("风火家人",37),
        ("离","兑"): ("火泽睽",38),

        ("坎","艮"): ("水山蹇",39),
        ("震","坎"): ("雷水解",40),

        ("艮","兑"): ("山泽损",41),
        ("巽","震"): ("风雷益",42),
        ("兑","乾"): ("泽天夬",43),
        ("乾","巽"): ("天风姤",44),

        ("兑","坤"): ("泽地萃",45),
        ("坤","巽"): ("地风升",46),
        ("兑","坎"): ("泽水困",47),
        ("坎","巽"): ("水风井",48),

        ("兑","离"): ("泽火革",49),
        ("离","巽"): ("火风鼎",50),

        ("震","震"): ("震为雷",51),
        ("艮","艮"): ("艮为山",52),
        ("巽","艮"): ("风山渐",53),
        ("震","兑"): ("雷泽归妹",54),

        ("震","离"): ("雷火丰",55),
        ("离","艮"): ("火山旅",56),
        ("巽","巽"): ("巽为风",57),
        ("兑","兑"): ("兑为泽",58),

        ("巽","坎"): ("风水涣",59),
        ("坎","兑"): ("水泽节",60),
        ("巽","兑"): ("风泽中孚",61),
        ("震","艮"): ("雷山小过",62),

        ("坎","离"): ("水火既济",63),
        ("离","坎"): ("火水未济",64),
    }

    yg,yz = year_gz[0], year_gz[1]
    mg,mz = month_gz[0], month_gz[1]
    dg,dz = day_gz[0], day_gz[1]
    hg,hz = hour_gz[0], hour_gz[1]

    upper_total = (
        GAN_NUM[yg] + ZHI_NUM[yz] +
        GAN_NUM[mg] + ZHI_NUM[mz] +
        GAN_NUM[dg] + ZHI_NUM[dz]
    )

    lower_total = (
        upper_total +
        GAN_NUM[hg] + ZHI_NUM[hz]
    )

    upper = upper_total % 8
    upper = 8 if upper == 0 else upper

    lower = lower_total % 8
    lower = 8 if lower == 0 else lower

    moving = lower_total % 6
    moving = 6 if moving == 0 else moving

    upper_name = BAGUA_NUM[upper]
    lower_name = BAGUA_NUM[lower]

    hexagram_name, index = HEXAGRAM_MAP[
        (upper_name, lower_name)
    ]
    return jsonify({'success': True,
        "hexagram": hexagram_name,
        "upper": upper_name,
        "lower": lower_name,
        "moving": moving,
        "index": index,})


@app.route('/admin')
# @login_required
# @admin_required
def admin_page():
    """后台管理页面"""
    return render_template('index.admin.html')

if __name__ == '__main__':
    init_db()
    init_user_db()  # 新增用户表初始化
    app.secret_key = 'f#1321DDsa@s3)_E(#d'  # 设置session密钥
    # 设置session密钥

    app.run(debug=True, port=5001)
