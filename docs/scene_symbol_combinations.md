# 宫位 × 星曜 × 场景象意模块

## 目标与边界

本模块管理“宫位 × 星曜 × 场景”的组合象意，供 5shu 的命盘输出、问事分析和后续管理界面调用。

- **不改写根定义**：宫位仍负责事件领域，星曜仍描述结构/运行方式，四化仍描述状态如何运动。
- **只做场景映射**：把根定义映射为具体领域中的人、事、物、空间、身体、组织或信息表达。
- **不直接裁断结果**：条目不得单独输出成功/失败、成立/不成立。
- **保留来源与状态**：初始数据均为 `draft`，必须经过真实案例校验才能标记为 `verified`。

## 数据结构

每个条目包含：

| 字段 | 用途 |
|---|---|
| id | 稳定唯一标识 |
| palace | 宫位名称；`*` 表示不限定宫位的星曜×场景通用映射 |
| star | 星曜名称 |
| scene | 场景 ID |
| status | `draft` / `verified` / `deprecated` |
| interpretations | 场景表达，按人/事/物/信息等 facet 分类 |
| constraints | 防止误用的边界条件 |
| source | 根定义或资料来源 |
| note | 案例验证说明 |

## Python API

```python
from scene_symbol_manager import SceneSymbolManager

manager = SceneSymbolManager()

# 精确查询：宫位 × 星曜 × 场景
items = manager.lookup("子女宫", "巨门", "automotive_sales")

# 默认同时允许 palace="*" 的通用映射；只取已验证条目
verified = manager.lookup(
    "子女宫", "巨门", "automotive_sales", include_draft=False
)

# 管理端筛选
all_sales = manager.search(scene="automotive_sales")
drafts = manager.search(status="draft")

# 新增或更新（按 id upsert）
manager.upsert({
    "id": "example_001",
    "palace": "财帛宫",
    "star": "武曲",
    "scene": "automotive_sales",
    "status": "draft",
    "interpretations": [
        {"facet": "物", "meaning": "报价、成交金额或硬性资产价值"}
    ],
    "constraints": ["不得直接等同最终到账"],
    "source": "待补充来源"
})

# 删除
manager.delete("example_001")
```

## 与 5shu 命盘对象整合

`ZiweiChart.get_scene_interpretations(scene)` 遍历十二宫的主星，返回该场景下可匹配的组合象意；可选包含辅星。它只负责检索和组织解释，不改变安星、四化计算或原有 JSON 输出。

```python
chart = ZiweiChart(1990, 1, 1, 12, 0, "male")
matches = chart.get_scene_interpretations("automotive_sales")
```

## 场景 ID

首批场景：`automotive_sales`、`relationship`、`enterprise_operations`、`space_housing`、`medical`、`study_exam`。可在 JSON 的 `scenes` 中扩展。

## 维护原则

1. 新条目先标记 `draft`。
2. 每条解释写清来源、场景和限制条件。
3. 不把宫位或星曜根定义复制成新的“规则”。
4. 通过案例复盘验证后，才标记 `verified`。
5. 发生冲突时保留不同适用条件，不覆盖根定义。

## 案例反馈与可视化维护

启动 Flask 服务后，管理员登录并打开 `/admin`，进入“场景象意管理”标签页。

管理界面提供：

- 象意条目的新增、编辑、删除、状态维护和关键字筛选。
- 占卜案例反馈录入：原始问题、当时预测、实际结果、复核结论、拟整理象意和复盘说明。
- 案例复核结论更新；正确/部分正确的案例可以整理为一条新的象意草稿。
- 案例整理出的条目默认保持 `draft`，不会因单次案例反馈自动变成 `verified`。

### 案例反馈原则

1. 保存原始问卦内容与当时预测，避免事后改写预测。
2. 将显象是否命中与最终裁断是否命中分开记录，允许“部分正确”。
3. 记录真实结果，保留不支持原预测的反例。
4. 从正确/部分正确案例提取可复用的宫位×星曜×场景象意，先进入草稿库。
5. 只有经过人工复核、多个独立案例支持且适用边界明确后，才手动将条目改为 `verified`。
6. 不把个案中的偶然细节直接推广为通用规则；冲突案例应保留并注明条件。

### 管理 API

- `GET/POST /api/scene-symbols`：读取/新增或更新象意条目。
- `DELETE /api/scene-symbols/<entry_id>`：删除象意条目。
- `GET/POST /api/scene-cases`：读取/新增案例反馈。
- `PUT/DELETE /api/scene-cases/<case_id>`：更新复核结论/删除案例。
- `POST /api/scene-cases/<case_id>/promote`：将正确或部分正确案例整理为待验证草稿。

上述管理 API 要求管理员会话。数据保存在 `data/scene_symbol_combinations.json`，其中 `entries` 是象意库，`cases` 是案例反馈库。
