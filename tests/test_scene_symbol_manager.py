import json
import tempfile
import unittest
from pathlib import Path

from scene_symbol_manager import SceneSymbolManager


class SceneSymbolManagerTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.path = Path(self.temp_dir.name) / "scene.json"
        self.path.write_text(json.dumps({
            "schema_version": 1,
            "scenes": [],
            "entries": [
                {
                    "id": "exact",
                    "palace": "子女宫",
                    "star": "巨门",
                    "scene": "automotive_sales",
                    "status": "verified",
                    "interpretations": [{"facet": "事", "meaning": "订单通道"}]
                },
                {
                    "id": "fallback",
                    "palace": "*",
                    "star": "巨门",
                    "scene": "automotive_sales",
                    "status": "draft",
                    "interpretations": [{"facet": "信息", "meaning": "信息入口"}]
                }
            ]
        }, ensure_ascii=False), encoding="utf-8")
        self.manager = SceneSymbolManager(self.path)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_lookup_prefers_exact_palace(self):
        matches = self.manager.lookup("子女宫", "巨门", "automotive_sales")
        self.assertEqual([item["id"] for item in matches], ["exact", "fallback"])
        self.assertEqual(matches[0]["_match"], "exact")

    def test_lookup_can_exclude_drafts(self):
        matches = self.manager.lookup(
            "子女宫", "巨门", "automotive_sales", include_draft=False
        )
        self.assertEqual([item["id"] for item in matches], ["exact"])

    def test_upsert_persists_and_delete_removes(self):
        self.manager.upsert({
            "id": "new",
            "palace": "财帛宫",
            "star": "武曲",
            "scene": "automotive_sales",
            "interpretations": [{"facet": "物", "meaning": "成交金额"}]
        })
        reloaded = SceneSymbolManager(self.path)
        self.assertEqual(len(reloaded.search(star="武曲")), 1)
        self.assertTrue(reloaded.delete("new"))
        self.assertFalse(reloaded.delete("missing"))


if __name__ == "__main__":
    unittest.main()
