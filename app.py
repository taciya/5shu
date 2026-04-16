
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

app = Flask(__name__)
CORS(app)  # 允许所有域的跨域请求

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
from utils import CalendarUtils
@app.route('/export_feigong', methods=['POST'])
def export_feigong():
    """专门用于生成和返回feigong_str的接口"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': '缺少命盘参数'}), 400
        utils = CalendarUtils()
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
        
        # 将列表转换为字符串
        # feigong_str = '\n'.join(feigong_str_lines) if isinstance(feigong_str_lines, list) else str(feigong_str_lines)
        feigong_str=feigong_str_lines
        
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
        utils = CalendarUtils()
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

@app.route('/api/stars/<star_name>', methods=['GET'])
def get_star(star_name):
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
                'lastUpdated': star['last_updated']
            })
        return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
            
            sihua_data[sihua_type] = {
                'star': star_name,
                'target_palace': target_palace,
                'brightness': brightness,
                # 'logic_text': logic_text,
                # 'result_text': result_text,
                'logic_sihua1': PALACE_SIHUA_MAP.get('SIHUA_ACTION', {}).get(sihua_type, "作用于").get("X"),
                'logic_source': source_motive,
                'logic_sihua2': action,
                'logic_target': result_face
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