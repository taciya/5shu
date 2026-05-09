# qimen_runtime_engine.py
# -*- coding: utf-8 -*-

from collections import defaultdict


class QimenRuntimeEngine:
    """
    紫占 · 奇门 Runtime 引擎

    核心定位：
    不是传统奇门排盘器，
    而是：

        「紫占动态场状态引擎」

    铁律：
    - 飞四化 = 因果
    - QimenRuntime = 场状态
    - 不允许奇门覆盖飞四化
    """

    def __init__(self, ziwei_chart):

        self.chart = ziwei_chart

        self.result = {
            "值符": {},
            "值使": {},
            "门态": [],
            "九星态": [],
            "空亡": {},
            "驿马": {},
            "场状态": [],
            "危险等级": "",
            "推进等级": "",
            "真实性": "",
        }

    # =========================================================
    # 主入口
    # =========================================================

    def build(self):

        self.result["值符"] = self.calculate_zhifu()

        self.result["值使"] = self.calculate_zhishi()

        self.result["门态"] = self.calculate_men_state()

        self.result["九星态"] = self.calculate_jiuxing_state()

        self.result["空亡"] = self.calculate_kongwang()

        self.result["驿马"] = self.calculate_yima()

        self.result["场状态"] = self.calculate_runtime_state()

        self.result["危险等级"] = self.calculate_risk_level()

        self.result["推进等级"] = self.calculate_progress_level()

        self.result["真实性"] = self.calculate_reality_level()

        return self.result

    # =========================================================
    # 值符
    # =========================================================

    def calculate_zhifu(self):

        """
        当前局势的控制源
        """

        palace_scores = defaultdict(int)

        for palace in self.chart.palaces:

            palace_name = palace.palace_name

            # 飞出统计
            feigong = self.chart.feigong_map.get(palace.dizhi, {})

            for sihua_type in ["禄", "权", "科", "忌"]:

                if not feigong.get(sihua_type):
                    continue

                if sihua_type == "禄":
                    palace_scores[palace_name] += 3

                elif sihua_type == "权":
                    palace_scores[palace_name] += 5

                elif sihua_type == "科":
                    palace_scores[palace_name] += 2

                elif sihua_type == "忌":
                    palace_scores[palace_name] += 6

            # 离心自化加强控制
            palace_scores[palace_name] += len(palace.lixin_sihua) * 2

        if not palace_scores:
            return {}

        target = max(palace_scores, key=palace_scores.get)

        return {
            "宫位": target,
            "分数": palace_scores[target],
            "性质": "当前局势控制源"
        }

    # =========================================================
    # 值使
    # =========================================================

    def calculate_zhishi(self):

        """
        当前真正执行流程的位置
        """

        palace_scores = defaultdict(int)

        for palace in self.chart.palaces:

            palace_name = palace.palace_name

            feiru = self.chart.feiru_map.get(palace.dizhi, {})

            for sihua_type, arr in feiru.items():

                palace_scores[palace_name] += len(arr)

            # 向心加强承接
            palace_scores[palace_name] += len(palace.xiangxin_sihua)

        if not palace_scores:
            return {}

        target = max(palace_scores, key=palace_scores.get)

        return {
            "宫位": target,
            "分数": palace_scores[target],
            "性质": "当前执行承接位"
        }

    # =========================================================
    # 门态系统
    # =========================================================

    def calculate_men_state(self):

        result = []

        for palace in self.chart.palaces:

            stars = (
                palace.main_stars
                + palace.minor_stars
                + palace.xiaoxing_stars
            )

            sihua_text = (
                palace.sihua
                + palace.lixin_sihua
                + palace.xiangxin_sihua
            )

            # -------------------------------------------------
            # 开门
            # -------------------------------------------------

            if (
                "左辅" in stars
                or "右弼" in stars
                or "天魁" in stars
                or "天钺" in stars
            ):
                result.append({
                    "门": "开门",
                    "宫位": palace.palace_name,
                    "原因": "贵人/开放流通"
                })

            # -------------------------------------------------
            # 生门
            # -------------------------------------------------

            if (
                "天府" in stars
                or "太阴" in stars
                or "禄存" in stars
            ):
                result.append({
                    "门": "生门",
                    "宫位": palace.palace_name,
                    "原因": "资源增长"
                })

            # -------------------------------------------------
            # 休门
            # -------------------------------------------------

            if (
                "天同" in stars
                and not self.has_ji(sihua_text)
            ):
                result.append({
                    "门": "休门",
                    "宫位": palace.palace_name,
                    "原因": "低压稳定"
                })

            # -------------------------------------------------
            # 伤门
            # -------------------------------------------------

            if (
                "擎羊" in stars
                or "陀罗" in stars
                or "火星" in stars
                or "铃星" in stars
            ):

                result.append({
                    "门": "伤门",
                    "宫位": palace.palace_name,
                    "原因": "冲突/损耗"
                })

            # -------------------------------------------------
            # 杜门
            # -------------------------------------------------

            if (
                self.contains_any(
                    stars,
                    ["巨门", "地空", "天空"]
                )
                and self.has_ji(sihua_text)
            ):

                result.append({
                    "门": "杜门",
                    "宫位": palace.palace_name,
                    "原因": "阻塞/封闭"
                })

            # -------------------------------------------------
            # 景门
            # -------------------------------------------------

            if (
                "贪狼" in stars
                or "文曲" in stars
            ):

                result.append({
                    "门": "景门",
                    "宫位": palace.palace_name,
                    "原因": "表现/传播"
                })

            # -------------------------------------------------
            # 惊门
            # -------------------------------------------------

            if (
                "七杀" in stars
                or "破军" in stars
                or "天机" in stars
            ):

                result.append({
                    "门": "惊门",
                    "宫位": palace.palace_name,
                    "原因": "不稳定/突变"
                })

            # -------------------------------------------------
            # 死门
            # -------------------------------------------------

            if (
                "廉贞" in stars
                and self.has_ji(sihua_text)
            ):

                result.append({
                    "门": "死门",
                    "宫位": palace.palace_name,
                    "原因": "终止/冻结"
                })

        return result

    # =========================================================
    # 九星态
    # =========================================================

    def calculate_jiuxing_state(self):

        result = []

        for palace in self.chart.palaces:

            stars = palace.main_stars

            if "七杀" in stars or "破军" in stars:
                result.append({
                    "九星": "天冲",
                    "宫位": palace.palace_name
                })

            if "巨门" in stars:
                result.append({
                    "九星": "天芮",
                    "宫位": palace.palace_name
                })

            if "紫微" in stars or "天府" in stars:
                result.append({
                    "九星": "天辅",
                    "宫位": palace.palace_name
                })

            if "廉贞" in stars:
                result.append({
                    "九星": "天柱",
                    "宫位": palace.palace_name
                })

            if "贪狼" in stars:
                result.append({
                    "九星": "天英",
                    "宫位": palace.palace_name
                })

            if "太阴" in stars:
                result.append({
                    "九星": "天心",
                    "宫位": palace.palace_name
                })

        return result

    # =========================================================
    # 空亡
    # =========================================================

    def calculate_kongwang(self):

        kong_count = 0

        for palace in self.chart.palaces:

            stars = (
                palace.main_stars
                + palace.minor_stars
                + palace.xiaoxing_stars
            )

            if self.contains_any(
                stars,
                ["地空", "天空", "天虚"]
            ):
                kong_count += 1

        return {
            "存在": kong_count >= 2,
            "强度": kong_count
        }

    # =========================================================
    # 驿马
    # =========================================================

    def calculate_yima(self):

        score = 0

        for palace in self.chart.palaces:

            stars = (
                palace.main_stars
                + palace.minor_stars
            )

            if "天马" in stars:
                score += 4

            if "七杀" in stars:
                score += 2

            if "破军" in stars:
                score += 2

        return {
            "动态等级": score,
            "高动态": score >= 6
        }

    # =========================================================
    # 场状态
    # =========================================================

    def calculate_runtime_state(self):

        states = []

        # 高冲突
        if self.count_star("火星") + self.count_star("铃星") >= 2:
            states.append("高压冲突态")

        # 多忌
        if self.count_ji() >= 3:
            states.append("多重阻塞态")

        # 多禄
        if self.count_lu() >= 3:
            states.append("资源流动态")

        # 空亡
        if self.result["空亡"]["存在"]:
            states.append("虚化态")

        return states

    # =========================================================
    # 危险等级
    # =========================================================

    def calculate_risk_level(self):

        risk = 0

        risk += self.count_star("擎羊")
        risk += self.count_star("陀罗")
        risk += self.count_star("火星")
        risk += self.count_star("铃星")

        risk += self.count_ji()

        if risk <= 3:
            return "低"

        elif risk <= 6:
            return "中"

        else:
            return "高"

    # =========================================================
    # 推进等级
    # =========================================================

    def calculate_progress_level(self):

        score = 0

        score += self.count_lu() * 2

        score += self.count_quan() * 3

        if score <= 4:
            return "低"

        elif score <= 8:
            return "中"

        else:
            return "高"

    # =========================================================
    # 真实性
    # =========================================================

    def calculate_reality_level(self):

        kong = self.result["空亡"]["强度"]

        if kong >= 4:
            return "低"

        elif kong >= 2:
            return "中"

        return "高"

    # =========================================================
    # 工具函数
    # =========================================================

    def count_star(self, star_name):

        count = 0

        for palace in self.chart.palaces:

            stars = (
                palace.main_stars
                + palace.minor_stars
                + palace.xiaoxing_stars
            )

            if star_name in stars:
                count += 1

        return count

    def count_ji(self):

        count = 0

        for palace in self.chart.palaces:

            arr = (
                palace.sihua
                + palace.lixin_sihua
                + palace.xiangxin_sihua
            )

            for x in arr:
                if "忌" in x:
                    count += 1

        return count

    def count_lu(self):

        count = 0

        for palace in self.chart.palaces:

            arr = (
                palace.sihua
                + palace.lixin_sihua
                + palace.xiangxin_sihua
            )

            for x in arr:
                if "禄" in x:
                    count += 1

        return count

    def count_quan(self):

        count = 0

        for palace in self.chart.palaces:

            arr = (
                palace.sihua
                + palace.lixin_sihua
                + palace.xiangxin_sihua
            )

            for x in arr:
                if "权" in x:
                    count += 1

        return count

    def contains_any(self, arr, target):

        for x in target:
            if x in arr:
                return True

        return False

    def has_ji(self, arr):

        for x in arr:
            if "忌" in x:
                return True

        return False
