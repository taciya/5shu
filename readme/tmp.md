以下为：

```md
最终仍需修改的内容
```

仅给：

```md
可直接替换的 md
```

不再解释原因。
基于当前版本检查：  

---

# ① 替换 MODULE_TERMINAL_CAPACITY_ENGINE

## 删除整个：

```md
## 八、现实层判断（新增）
```

到：

```md
无法收敛
```

全部删除。

---

# ② 在 MODULE_TERMINAL_CAPACITY_ENGINE 新增

````md
## 八、Terminal 输出协议（新增）

### stable_terminal

```text
具备长期承载能力
````

---

### weak_terminal

```text
存在长期衰减风险
```

---

### overload_terminal

```text
当前负载超过结构上限
```

---

### collapse_terminal

```text
结构无法继续承载
```

````

---

# ③ 替换 MODULE_FLOW_STATE_ENGINE
## 删除整个：

```md
现实：
````

相关内容。

包括：

```md
真正稳定
长期可持续
可形成结构
```

```md
表面正常
实际持续损耗
后期逐渐崩
```

```md
最终崩盘
无法长期维持
必然断裂
```

```md
长期卡死
无限重复
难以结束
```

全部删除。

---

# ④ 在 MODULE_FLOW_STATE_ENGINE 新增

````md
## 七点五、Flow State 仅负责结构（新增铁律）

⚠️ Flow State：

只允许输出：

```text
结构状态
````

禁止输出：

❌ 现实事件
❌ 现实结果
❌ 人生结论
❌ 感情成败
❌ 财务成败

现实层：

必须交给：

```text
MODULE_REALITY_MAPPING_ENGINE
```

````

---

# ⑤ 替换 MODULE_CONVERGENCE_ENGINE
## 删除整个：

```md
## 七、现实收敛协议（新增）
````

全部。

---

# ⑥ 替换 MODULE_CONVERGENCE_ENGINE

## 十、收敛输出协议（新增）

替换为：

````md
## 十、收敛输出协议（新增）

最终输出：

必须写：

```text
收敛类型
+
是否继续扩散
+
是否允许停止路径分析
````

---

### 示例

```text
收敛类型：pseudo_converged

是否继续扩散：
存在内部损耗残留

路径分析：
允许停止主路径延伸
```

````

---

# ⑦ 在 MODULE_OUTPUT_TEMPLATE
## 输出来源必须来自

新增：

```md
| MODULE_FLOW_STATE_ENGINE | 结构状态 |
| MODULE_CONVERGENCE_ENGINE | 收敛状态 |
| MODULE_REALITY_MAPPING_ENGINE | 现实结果 |
| MODULE_TERMINAL_CAPACITY_ENGINE | Terminal状态 |
````

---

# ⑧ 在 MODULE_OUTPUT_TEMPLATE

## 删除：

```md
最终结果
```

这种自由裁断词。

---

# ⑨ 在 MODULE_OUTPUT_TEMPLATE

## 替换：

```md
###### 最终结果
```

为：

```md
###### 最终状态引用
```

---

# ⑩ 在 MODULE_OUTPUT_TEMPLATE

## 替换：

```md
##### 🌪️ 综合裁断
```

为：

```md
##### 🌪️ 模块合成输出
```

---

# ⑪ 新增 MODULE_PATH_PRIORITY_ENGINE

````md
# MODULE_PATH_PRIORITY_ENGINE

## 一、核心定义

⚠️ 多路径：

不代表同时成立。

必须：

```text
决定哪条路径主导现实
````

---

## 二、路径评分公式

```text
路径评分
=
四化强度
×
事件相关度
×
承接有效度
×
Terminal稳定度
×
现实影响等级
```

---

## 三、四化优先级

默认：

```text
化忌
>
化权
>
化禄
>
化科
```

---

## 四、路径状态修正

### dead_end

```text
降低现实持续性
```

---

### self_loop

```text
提高重复发生概率
```

---

### split_flow

```text
降低单一路径收敛度
```

---

## 五、小星优先级修正

### 击穿型

```text
优先覆盖其他小星
```

---

### 支撑型

```text
可降低崩塌概率
```

---

## 六、最终主路径协议

最终：

```text
评分最高路径
=
主现实结果
```

---

## 七、禁止事项

禁止：

❌ 同时输出多个互斥现实
❌ 又好又坏不做排序
❌ 所有路径平权

````

---

# ⑫ 在 Prompt 主文件
## 模块加载协议

新增：

```md
* MODULE_FLOW_STATE_ENGINE
* MODULE_CONVERGENCE_ENGINE
* MODULE_TERMINAL_CAPACITY_ENGINE
* MODULE_PATH_PRIORITY_ENGINE
````

---

# ⑬ 在 Prompt 主文件

## STEP 2.3 后新增

````md
## STEP 2.4｜路径优先级计算（新增）

必须：

```text
① 计算路径评分
→ ② 计算Terminal权重
→ ③ 计算小星修正
→ ④ 锁定主路径
→ ⑤ 锁定主现实结果
````

````

---

# ⑭ 在 MODULE_SELF_CHECK
## 模块职责自检

新增：

```md
| PATH_PRIORITY 是否遗漏 | ❌ |
| FLOW_STATE 是否输出现实结果 | ❌ |
| CONVERGENCE 是否重新解释结构 | ❌ |
````

---

# ⑮ 在 MODULE_CONVERGENCE_ENGINE

## 三、收敛检测总公式

替换为：

````md
## 三、收敛检测总公式（新增）

```text
事件收敛
=
路径停止扩散
×
Flow State稳定
×
Terminal可承载
×
无继续飞忌
````

```
```
