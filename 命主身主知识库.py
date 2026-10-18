# 命主/身主知识库联动补丁

基于 `taciya/5shu` 当前结构准备，包含：

- `命主身主知识库.json`：从 `紫微斗数-命主身主.xlsx / Sheet1` 抽取的十二地支宫主星、身主星映射及逐宫宫主入宫原文。
- `mingzhu_shenzhu_knowledge.py`：知识库读取、地支映射、宫位名归一化、原文象义查询与 Flask API 注册方法。
- `patch_sanhe_api.py`：向 `sanhe_api.py` 追加 `/api/sanhe/analyze` 响应的命主/身主模块；不会覆盖原三合响应结构。
- `patch_sanhe_palace_analysis.js`：向前端同一面板追加命主/身主模块。
- `patch_app.py`：在 `app.py` 中确认导入并注册接口所需路径。

## 安装

把 `mingzhu_shenzhu_knowledge.py` 放在项目根目录，并把 JSON 文件放在项目根目录或 `static/` 目录中。运行：

```bash
python patch_app.py
python patch_sanhe_api.py
python patch_sanhe_palace_analysis.py
```

脚本会更新原文件前先建立 `.bak` 备份。