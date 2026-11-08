"""场景化宫位-星曜象意管理。

根定义不在本模块内改写；本模块只保存“宫位 × 星曜 × 场景”的映射。
数据文件中的 draft 条目是待验证的工作假设，不是自动裁断规则。
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Iterable, Optional


DEFAULT_DATA_PATH = Path(__file__).parent / "data" / "scene_symbol_combinations.json"


def _norm(value: Optional[str]) -> str:
    return "".join(str(value or "").split()).lower()


class SceneSymbolManager:
    """读取、检索和维护场景化宫位-星曜象意。"""

    def __init__(self, data_path: Optional[str | Path] = None):
        self.data_path = Path(data_path) if data_path else DEFAULT_DATA_PATH
        self._document = self._load()

    def _load(self) -> dict[str, Any]:
        if not self.data_path.exists():
            return {"schema_version": 1, "scenes": [], "entries": []}
        with self.data_path.open("r", encoding="utf-8") as file:
            document = json.load(file)
        if not isinstance(document, dict) or not isinstance(document.get("entries", []), list):
            raise ValueError("场景象意数据格式错误：根对象必须包含 entries 数组")
        document.setdefault("schema_version", 1)
        document.setdefault("scenes", [])
        document.setdefault("entries", [])
        document.setdefault("cases", [])
        return document

    @property
    def entries(self) -> list[dict[str, Any]]:
        return list(self._document["entries"])

    def list_scenes(self) -> list[dict[str, Any]]:
        return list(self._document.get("scenes", []))

    def lookup(
        self,
        palace: str,
        star: str,
        scene: str,
        *,
        include_draft: bool = True,
    ) -> list[dict[str, Any]]:
        """按宫位、星曜、场景查找；支持 palace='*' 的通用星曜场景映射。"""
        p, s, c = _norm(palace), _norm(star), _norm(scene)
        matches = []
        for entry in self._document["entries"]:
            if _norm(entry.get("star")) != s or _norm(entry.get("scene")) != c:
                continue
            entry_palace = _norm(entry.get("palace", "*"))
            if entry_palace not in ("*", p):
                continue
            if not include_draft and entry.get("status", "draft") != "verified":
                continue
            result = dict(entry)
            result["_match"] = "exact" if entry_palace == p else "star_scene_fallback"
            matches.append(result)
        matches.sort(key=lambda item: (item["_match"] != "exact", item.get("status") != "verified"))
        return matches

    def search(
        self,
        *,
        scene: Optional[str] = None,
        palace: Optional[str] = None,
        star: Optional[str] = None,
        status: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        """按任意维度筛选象意条目，便于管理界面构建索引。"""
        result = []
        for entry in self._document["entries"]:
            if scene and _norm(entry.get("scene")) != _norm(scene):
                continue
            if palace and _norm(entry.get("palace", "*")) not in ("*", _norm(palace)):
                continue
            if star and _norm(entry.get("star")) != _norm(star):
                continue
            if status and entry.get("status", "draft") != status:
                continue
            result.append(dict(entry))
        return result

    def upsert(self, entry: dict[str, Any]) -> dict[str, Any]:
        """按 id 新增或替换条目；必须显式提供 id/palace/star/scene/interpretations。"""
        required = ("id", "palace", "star", "scene", "interpretations")
        missing = [key for key in required if key not in entry]
        if missing:
            raise ValueError("缺少必填字段：" + ", ".join(missing))
        if not isinstance(entry["interpretations"], list) or not entry["interpretations"]:
            raise ValueError("interpretations 必须是非空数组")
        normalized = dict(entry)
        normalized.setdefault("status", "draft")
        normalized.setdefault("source", "未注明")
        normalized.setdefault("constraints", [])
        for index, current in enumerate(self._document["entries"]):
            if current.get("id") == normalized["id"]:
                self._document["entries"][index] = normalized
                self.save()
                return dict(normalized)
        self._document["entries"].append(normalized)
        self.save()
        return dict(normalized)

    def delete(self, entry_id: str) -> bool:
        before = len(self._document["entries"])
        self._document["entries"] = [
            entry for entry in self._document["entries"] if entry.get("id") != entry_id
        ]
        if len(self._document["entries"]) == before:
            return False
        self.save()
        return True


    @property
    def cases(self) -> list[dict[str, Any]]:
        return list(self._document.get("cases", []))

    def add_case(self, case: dict[str, Any]) -> dict[str, Any]:
        """保存一次占卜反馈；反馈只作为案例证据，不自动升级象意状态。"""
        required = ("id", "scene", "question", "prediction", "actual_result", "verdict")
        missing = [key for key in required if not case.get(key)]
        if missing:
            raise ValueError("缺少必填字段：" + ", ".join(missing))
        normalized = dict(case)
        normalized.setdefault("status", "unreviewed")
        normalized.setdefault("created_at", "")
        normalized.setdefault("notes", "")
        normalized.setdefault("proposed_meaning", "")
        for index, current in enumerate(self._document["cases"]):
            if current.get("id") == normalized["id"]:
                self._document["cases"][index] = normalized
                self.save()
                return dict(normalized)
        self._document["cases"].append(normalized)
        self.save()
        return dict(normalized)

    def update_case(self, case_id: str, updates: dict[str, Any]) -> Optional[dict[str, Any]]:
        for index, current in enumerate(self._document["cases"]):
            if current.get("id") == case_id:
                updated = dict(current)
                updated.update(updates)
                updated["id"] = case_id
                self._document["cases"][index] = updated
                self.save()
                return dict(updated)
        return None

    def delete_case(self, case_id: str) -> bool:
        before = len(self._document["cases"])
        self._document["cases"] = [
            item for item in self._document["cases"] if item.get("id") != case_id
        ]
        if len(self._document["cases"]) == before:
            return False
        self.save()
        return True

    def promote_case_to_draft(self, case_id: str) -> dict[str, Any]:
        """把已复核为正确/部分正确的案例整理成 draft 象意，仍需人工审核。"""
        case = next((item for item in self._document["cases"] if item.get("id") == case_id), None)
        if not case:
            raise KeyError(case_id)
        if case.get("verdict") not in ("correct", "partial"):
            raise ValueError("只有判定为正确或部分正确的案例可以整理")
        meaning = str(case.get("proposed_meaning") or "").strip()
        if not meaning:
            raise ValueError("请先填写拟整理的象意")
        entry = {
            "id": "case_" + case_id,
            "palace": case.get("palace") or "*",
            "star": case.get("star") or "*",
            "scene": case["scene"],
            "status": "draft",
            "interpretations": [{"facet": "场景显象", "meaning": meaning}],
            "constraints": ["由案例反馈整理，尚未完成独立验证；不得自动作为确定裁断规则"],
            "source": "案例反馈：" + case_id,
            "note": "原问：" + case.get("question", "") + "；实际结果：" + case.get("actual_result", "")
        }
        self.upsert(entry)
        self.update_case(case_id, {"status": "organized_as_draft", "related_entry_id": entry["id"]})
        return entry

    def save(self) -> None:
        """原子写入 JSON，避免写入中断造成数据文件损坏。"""
        self.data_path.parent.mkdir(parents=True, exist_ok=True)
        temporary = self.data_path.with_suffix(self.data_path.suffix + ".tmp")
        with temporary.open("w", encoding="utf-8") as file:
            json.dump(self._document, file, ensure_ascii=False, indent=2)
            file.write("\n")
        temporary.replace(self.data_path)
