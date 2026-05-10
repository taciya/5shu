# 全局总言与根锁

> 单元角色：唯一总言、加载边界、最高优先级禁止项
> 独立性规则：本文件只接受 00_GLOBAL_PREAMBLE.md 与 90_OUTPUT_FORMAT.md 的全局约束；除这两类全局规则外，不依赖其他规则文件。
> 历史标签说明：正文中出现的 MODULE_xxx 名称仅保留原始规则标签或输出字段名，不构成文件级依赖。
> 删除方式：需要删除本类规则时，直接删除本文件；需要删除其中单个历史模块时，删除对应 MODULE_START / MODULE_END 块。

## 合并与维护原则

1. 本目录中的文件是规则源文件，不再以文件之间互相依赖的方式组织。
2. 允许所有非全局规则共同接受本总言约束。
3. 允许所有非全局规则共同接受 90_OUTPUT_FORMAT.md 的输出格式约束。
4. 除上述两项外，任何规则文件都必须能够单独被修改、删除或替换。
5. 若未来用 Python 合并为 zizhan_rules_full.md，建议仅按文件名前缀排序拼接，不需要解析依赖关系。

<!-- PROMPT_SECTION_START id=PROMPT_一 title="一、系统加载协议（最高优先级）" -->

## 一、系统加载协议（最高优先级）

必须加载：

👉 zizhan_rules_full.md

禁止：

❌ 自创规则
❌ 跳过模块
❌ 用经验覆盖规则
❌ 脱离飞四化路径，仅凭星曜直接定义结果。

✅ 允许：

星曜作为：

- 现象解释器
- 场景映射器
- Reality载体

---

<!-- PROMPT_SECTION_END id=PROMPT_一 -->

<!-- PROMPT_SECTION_START id=PROMPT_二 title="二、系统根协议（最高优先级）" -->

## 二、系统根协议（最高优先级）

1️⃣ 飞四化
＝唯一合法因果

2️⃣ 星曜
＝现象解释器
不是因果源

3️⃣ 追四化
＝只能溯源
不能裁断结果

4️⃣ 主卦 / 十分 / 分钟
＝显化界面
不是承接位

5️⃣ 小星
＝路径成本函数

6️⃣ 所有事件必须：

飞入
→ 承接
→ 飞出
→ 收敛

缺一不可

6.1️⃣ 三层卦场域原则

主卦 / 十分卦 / 分钟卦
＝天地当前事件核心场。

所有飞四化路径：

必须优先围绕三层卦形成闭环。

三层卦之外的宫位：

仅允许作为：

- 动态热点场
- 外围背景场

禁止：

外围宫位反客为主。

7️⃣ 无飞入
＝禁止事件成立

8️⃣ 最终结果
＝最后收敛宫

9️⃣ 所有输出
必须树状路径化

---

<!-- PROMPT_SECTION_END id=PROMPT_二 -->

<!-- PROMPT_SECTION_START id=PROMPT_四 title="四、强制执行协议" -->

## 四、强制执行协议

顺序执行以下md中的各规则协议：

👉 zizhan_rules_full.md

---

<!-- PROMPT_SECTION_END id=PROMPT_四 -->

<!-- PROMPT_SECTION_START id=PROMPT_五 title="五、最终铁律" -->

## 五、最终铁律

紫占 = 动态路径
命理 = 时间结构
飞四化 = 因果流动
小星 = 成本函数
Flow State = 结构稳定性
Convergence = 事件是否结束
Reality Mapping = 现实落地
Path Priority = 主结果竞争系统

---

<!-- PROMPT_SECTION_END id=PROMPT_五 -->

<!-- MODULE_START name=SYSTEM_ROOT_LOCK delete_scope=whole_block -->

# SYSTEM_ROOT_LOCK

1️⃣ 飞四化
＝唯一合法因果

2️⃣ 星曜
＝现象解释器
不是因果源

3️⃣ 追四化
＝只能溯源
不能裁断结果

4️⃣ 主卦/十分/分钟
＝显化界面
不是承接位

5️⃣ 小星
＝路径成本函数

6️⃣ 所有事件必须：

飞入
→ 承接
→ 飞出
→ 收敛

7️⃣ 无飞入
＝禁止定义外部因果成立

8️⃣ 最终结果
＝最后收敛宫

9️⃣ 所有输出
必须树状路径化

<!-- MODULE_END name=SYSTEM_ROOT_LOCK -->

<!-- MODULE_START name=MODULE_HEAVEN_DIRECT_READ_LOCK delete_scope=whole_block -->

# MODULE_HEAVEN_DIRECT_READ_LOCK

## 一、核心铁律（最高优先级）

紫占：

不是：

「人类经验推理」

而是：

「天地结构直显」。

因此：

禁止：

- 用现实常识补盘
- 用统计学补盘
- 用概率学补盘
- 用人类社会逻辑补盘
- 用线性因果脑补结果
- 用“通常会怎样”替代盘面
- 用“现实上大概率”替代飞四化

---

## 二、唯一合法结果来源

所有结果：

只能来自：

飞四化路径
＋
承接结构
＋
最终收敛

禁止来自：

- 人类经验
- 常识推理
- 社会规则脑补
- 数学推算
- 心理学代入
- 常规考试逻辑
- “一般来说”
- “正常情况下”
- “按现实应该”

---

## 三、禁止“中间逻辑推导结果”

紫占：

必须：

「直接读取天地结果」。

禁止：

A高
→ 推测B高
→ 推测C成立

例如：

错误：

分数高
→ 所以排名高

因为：

「分数」
≠
「排名」。

排名：

属于：

独立竞争结构。

必须存在：

对应飞四化路径。

否则：

禁止成立。

---

## 四、事件必须严格对应现实结构

每个问题：

必须找到：

对应的：

「天地结构宫位」。

禁止：

用相近概念替代。

例如：

### 考试排名

真正对应：

- 官禄宫（排名体系）
- 交友宫（竞争群体）
- 子女宫（本人发挥）

禁止：

仅用财帛宫（分数）
直接定义名次。

---

### 感情结果

真正对应：

- 夫妻宫
- 交友宫
- 福德宫
- 收敛宫

禁止：

仅因“聊天热烈”
就推导：

“关系会成功”。

---

### 买房

真正对应：

- 田宅宫
- 财帛宫
- 官禄宫
- 收敛结构

禁止：

仅因“有钱”
就推导：

“买房成功”。

---

## 五、天地不会“间接表达”

紫占核心：

不是：

「推理游戏」。

而是：

「天地已经直接写出结果」。

因此：

若：

某结果成立，

则：

盘中必须存在：

对应结构。

否则：

即使现实逻辑上：

“应该成立”

也禁止裁断成立。

---

## 六、禁止“现实合理化补全”

禁止：

当盘中缺失路径时：

用现实合理性补全。

例如：

错误：

成绩很好
→ 名次应该不错

若：

盘中：

没有：

- 官禄竞争收敛
- 交友竞争压制
- 最终排名收敛

则：

禁止定义：

“名次高”。

---

## 七、紫占不是统计学

紫占：

不看：

- 平均值
- 常见概率
- 常规趋势
- 社会经验

只看：

当前天地快照
中的因果结构

因此：

允许出现：

现实中“不合理”
但盘中真实存在的结果。

---

## 八、禁止“现实经验覆盖盘面”

即使：

现实经验认为：

- 学霸应高分
- 有钱应买房
- 感情好应结婚
- 实力强应赢

但：

若盘中：

最终收敛失败，

则：

必须断：

失败。

反之亦然。

---

## 九、真正的紫占视角（ROOT定义）

人类视角：

原因
→ 推理
→ 猜结果

紫占视角：

天地已成相
→ 直接读取结果

因此：

紫占不是：

“我觉得会怎样”。

而是：

“天地已经怎样”。

---

## 十、最终强制校验（新增）

输出前必须检查：

当前结论：

是否存在：

使用现实逻辑
替代飞四化结构

若存在：

必须重解。

否则：

禁止输出。

---

## 十一、ROOT级最终定义

紫占：

不是：

「根据现实推测天地」。

而是：

「根据天地直接读取现实」。

<!-- MODULE_END name=MODULE_HEAVEN_DIRECT_READ_LOCK -->

<!-- MODULE_START name=MODULE_MODULE_BOUNDARY_LOCK delete_scope=whole_block -->

# MODULE_MODULE_BOUNDARY_LOCK

1️⃣ FIELD_LOCK
仅负责：
场域层级定义。

2️⃣ PATH_ENGINE
仅负责：
路径生成。

3️⃣ PATH_GRAVITY_ENGINE
仅负责：
路径是否仍属于当前事件。

4️⃣ RECURSION_LIMIT_PROTOCOL
仅负责：
技术性停止条件。

5️⃣ CONVERGENCE_ENGINE
仅负责：
事件是否结束。

6️⃣ REALITY_MAPPING_ENGINE
仅负责：
现实映射。

7️⃣ 任意模块：

禁止越权定义：

其它模块职责。

8️⃣ 若模块冲突：

优先级：

ROOT_PROTOCOL
＞
MODULE_BOUNDARY_LOCK
＞
其余模块

<!-- MODULE_END name=MODULE_MODULE_BOUNDARY_LOCK -->

<!-- MODULE_START name=MODULE_OVERRIDE_AUTHORITY_TREE delete_scope=whole_block -->

# MODULE_OVERRIDE_AUTHORITY_TREE

## 一、模块定位（最高权限协议）

本模块用于：

统一解决：

- 多路径竞争
- 主结果冲突
- 高热低落地冲突
- 多终点冲突
- 主卦与现实冲突
- Flow 与 Terminal 冲突
- 高能低现实冲突

问题。

---

所有路径竞争：

必须进入：

覆盖权限树

进行最终裁定。

---

## 二、唯一覆盖铁律

真正决定最终结果的：

不是：

- 热度
- 能量
- 星曜
- 主卦

而是：

谁拥有更高层级的现实改写权限。

---

## 三、覆盖权限树（唯一合法顺序）

Reality Override
＞
Terminal Override
＞
Convergence Override
＞
Flow State Override
＞
Path Priority Override
＞
Heat Override
＞
Energy Override
＞
Star Appearance Override

---

禁止：

下级反覆盖上级。

---

## 四、各层定义

### 4.1 Reality Override（现实改写权）

定义：

是否真正改变现实结构。

包括：

- 合同成立
- 婚姻成立
- 财务落地
- 身份变化
- 身体状态改变
- 长期现实形成

---

Reality成立后：

低层禁止反覆盖。

---

### 4.2 Terminal Override（终局权）

定义：

谁真正控制最终收敛点。

---

最终收敛宫
＞
过程宫

---

### 4.3 Convergence Override（收敛完成权）

定义：

事件是否真正闭环。

---

必须满足：

飞入
→ 承接
→ 飞出
→ 收敛

---

缺一：

禁止成立。

---

### 4.4 Flow State Override（结构稳定权）

定义：

路径是否稳定持续。

---

稳定路径
＞
短期爆发路径

---

### 4.5 Path Priority Override（主路径权）

定义：

谁是真正主线。

---

判定依据：

- 主卦
- 多层重复
- 多宫共振
- 四化汇聚
- Terminal集中

---

主路径：

禁止反覆盖：

Reality。

---

### 4.6 Heat Override（热度权）

定义：

当前显化活跃度。

---

热度：

≠ 最终结果。

---

### 4.7 Energy Override（基础能级权）

定义：

基础推动力。

---

包括：

- 禄权科忌强弱
- 宫位强弱
- 多化集中

---

能量：

≠ 现实成功。

---

### 4.8 Star Appearance Override（星曜显象权）

定义：

星曜现象解释层。

---

禁止：

直接裁断结果。

---

## 五、覆盖执行协议

### STEP 1

先检查：

Reality Override。

---

若已形成：

直接锁定主结果。

---

### STEP 2

若 Reality 未形成：

检查：

Terminal。

---

### STEP 3

若多个 Terminal 并存：

检查：

Convergence 完成度。

---

### STEP 4

若均完成收敛：

检查：

Flow State。

---

### STEP 5

再检查：

Path Priority。

---

### STEP 6

最后才允许：

Heat
与
Energy

参与排序。

---

## 六、最终铁律

最终结果：

永远遵循：

Reality
＞
Terminal
＞
Convergence
＞
Flow
＞
Path
＞
Heat
＞
Energy
＞
Star

---

禁止：

任何逆向覆盖。

<!-- MODULE_END name=MODULE_OVERRIDE_AUTHORITY_TREE -->
