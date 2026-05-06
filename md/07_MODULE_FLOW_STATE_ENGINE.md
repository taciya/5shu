# MODULE_FLOW_STATE_ENGINE

## 一、核心定义（新增最高优先级）

⚠️ 所有：

* 路径状态
* 承接状态
* Terminal状态

必须统一归属：


MODULE_FLOW_STATE_ENGINE


其他模块：

❌ 禁止重新定义状态
❌ 禁止重复解释稳定性
❌ 禁止覆盖 Flow State

---

## 二、模块职责边界（新增最高优先级）

### 2.1 MODULE_PATH_ENGINE

仅负责：


路径是否存在


即：

| 状态         | 定义    |
| ---------- | ----- |
| normal     | 正常路径  |
| dead_end   | 无继续飞出 |
| self_loop  | 飞回本宫  |
| split_flow | 多飞出   |

⚠️ 不负责：

* 稳定性
* 承接质量
* 是否崩塌

---

### 2.2 MODULE_MINOR_STAR_ENGINE

仅负责：


小星如何影响流动质量


⚠️ 不负责：

* 最终状态判定
* Terminal稳定性

---

### 2.3 MODULE_TERMINAL_CAPACITY_ENGINE

仅负责：


落点是否有能力承载


⚠️ 不负责：

* 路径是否成立
* 小星动力学

---

### 2.4 MODULE_FLOW_STATE_ENGINE

统一负责：


最终流动状态


即：


路径结构
+
小星影响
+
Terminal承载


最终融合。

---

## 三、Flow State 总公式（核心）


最终流动状态
=
路径状态
×
承接质量
×
Terminal承载


---

## 四、路径状态（来自 PATH_ENGINE）

| 状态         | 来源   |
| ---------- | ---- |
| normal     | 正常流动 |
| dead_end   | 断流   |
| self_loop  | 自循环  |
| split_flow | 分流   |

---

## 五、承接质量（来自 MINOR_STAR_ENGINE）

| 状态            | 定义   |
| ------------- | ---- |
| valid_flow    | 承接稳定 |
| weak_flow     | 承接弱化 |
| collapse_flow | 承接崩塌 |

---

## 六、Terminal 状态（来自 TERMINAL_CAPACITY）

| 状态                | 定义   |
| ----------------- | ---- |
| stable_terminal   | 长期承载 |
| weak_terminal     | 短期承载 |
| overload_terminal | 超载   |
| collapse_terminal | 无法承载 |

---

## 七、最终稳定性判定（新增）

### 7.1 稳定结构

满足：


normal
+
valid_flow
+
stable_terminal


判定：


stable_structure


---

### 7.2 虚假稳定

满足：


normal
+
weak_flow
+
weak_terminal


判定：


pseudo_stable



---

### 7.3 崩塌结构

满足任一：


collapse_flow
or
collapse_terminal


判定：


collapse_structure


---

### 7.4 无限循环结构

满足：


self_loop
+
阻力型小星


判定：


loop_structure



---

## 八、Flow State 优先级（新增）

最终状态优先级：


collapse_structure
>
loop_structure
>
pseudo_stable
>
stable_structure


⚠️ 即：


崩塌优先于稳定


---

## 九、Flow State 输出协议（新增）

最终输出：

必须：


路径状态
+
承接状态
+
Terminal状态
+
最终结构状态


---

### 示例


路径状态：normal
承接状态：weak_flow
Terminal状态：weak_terminal
最终结构：pseudo_stable


---

## 十、Flow State 最终铁律（新增）

⚠️ 必须明确：


路径存在
≠
结构稳定


真正稳定：

必须：


路径
+
承接
+
Terminal


同时成立。

---



