import re
import json

DIZHI_ALL = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]

DIZHI_PATTERN = r"[子丑寅卯辰巳午未申酉戌亥]"


def parse_dizhi(dizhi_str):
    """
    解析地支字段
    """

    dizhi_str = dizhi_str.strip()

    if dizhi_str == "全部":
        return DIZHI_ALL.copy()

    return re.findall(DIZHI_PATTERN, dizhi_str)


def build_sihua_dict(markdown_text):

    result = {}

    for line in markdown_text.splitlines():

        line = line.strip()

        if not line.startswith("|"):
            continue

        cols = [x.strip() for x in line.split("|")]

        cols = [x for x in cols if x]

        if len(cols) < 4:
            continue

        star = cols[0]
        hua = cols[1]
        dizhi_group = cols[2]
        text = cols[3]

        result.setdefault(star, {})
        result[star].setdefault(hua, {})

        dizhis = parse_dizhi(dizhi_group)

        for dz in dizhis:
            result[star][hua][dz] = text

    return result


def getSiHua(data, star, hua, dizhi):

    return (
        data
        .get(star, {})
        .get(hua, {})
        .get(dizhi)
    )


if __name__ == "__main__":

    with open("sihua.md", "r", encoding="utf-8") as f:
        markdown = f.read()

    data = build_sihua_dict(markdown)

    with open(
        "sihua.json",
        "w",
        encoding="utf-8"
    ) as f:
        json.dump(
            data,
            f,
            ensure_ascii=False,
            indent=2
        )

    print("生成完成：sihua.json")

    print(
        getSiHua(
            data,
            "天同",
            "禄",
            "申"
        )
    )
