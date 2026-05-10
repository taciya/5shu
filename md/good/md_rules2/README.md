# md_rules2 清单

本目录是基于 md_rules 的修正版。

## 本轮处理原则

- 只修改 Prompt.md 与单独规则文件。
- 不修改合并版 zizhan_rules_full.md；本目录不放旧合并版，避免误用旧重复定义。
- 后续请按 MERGE_ORDER.txt 合并单独规则文件，重新生成 zizhan_rules_full.md。
- Prompt.md 只作为启动器，不再重复定义 ROOT、模式、角色细则或输出模板。

## 主要修正

- 删除规则源中的 PROMPT_一 / PROMPT_二 / PROMPT_三 / PROMPT_四 / PROMPT_五 重复定义。
- 保留 SYSTEM_ROOT_LOCK 作为规则库 ROOT，并补强禁止现实经验补盘。
- 将小星定义扩展为：路径成本函数 + 现实结构细节函数 + 形态显化函数。
- 将最终结果定义修正为：默认最后收敛宫；存在 Reality Override 时 Reality 层优先。
- 增加模块执行顺序锁：FIELD → PATH → FLOW → CONVERGENCE → OVERRIDE → REALITY → OUTPUT → SELF_CHECK。
- 给角色映射协议增加权限边界，禁止直接定义 Terminal / Reality / Final Result / 收敛成立。
- 修正 MODULE_SCENE_MAPPING 与 MODULE_MINOR_STAR_LOGIC 的边界缩进，保证可按块删除。

## 规则文件清单

| 文件 | 单元开始/结束数 | 字节数 |
| --- | --- | --- |
| 00_GLOBAL_PREAMBLE.md | 4 / 4 | 10389 |
| 10_MODE_CORE_AND_STAR_MODEL.md | 2 / 2 | 32443 |
| 11_ROLE_MAPPING_PROTOCOL.md | 1 / 1 | 5990 |
| 20_FIELD_LAYER_AND_MANIFEST.md | 6 / 6 | 6914 |
| 30_CAUSAL_PATH_AND_TRACE.md | 6 / 6 | 17101 |
| 40_SCAN_OVERLAY_AND_COMPOSITE.md | 3 / 3 | 12968 |
| 50_FLOW_CONVERGENCE_AND_TERMINAL.md | 5 / 5 | 13534 |
| 60_REALITY_SCENE_AND_SPATIAL.md | 4 / 4 | 15744 |
| 70_MINOR_STAR_AND_COST.md | 3 / 3 | 13579 |
| 80_PRIORITY_ENERGY_RANK_AND_STRATEGY.md | 4 / 4 | 14798 |
| 85_STRUCTURED_REASONING_AND_COMPRESSION.md | 1 / 1 | 5507 |
| 90_OUTPUT_FORMAT.md | 1 / 1 | 10952 |
| 99_SELF_CHECK.md | 1 / 1 | 4540 |