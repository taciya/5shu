# MODULE_RECURSION_LIMIT_PROTOCOL

## 一、递归停止铁律

路径：

禁止无限递归。

---

## 二、停止条件

满足任一：

- converged
- collapse_terminal
- dead_end
- self_loop
- 路径重复
- 已进入低价值扰动层

则：

停止继续扩展。

---

## 三、重复路径定义

若：

再次进入：

同宫
+
同四化
+
同方向

则定义：

```text
recursive_loop