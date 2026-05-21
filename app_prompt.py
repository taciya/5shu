from pathlib import Path

base = Path("./md_5术")

parts = [
    "prompt_5术.md",
    "紫占.md",
    "奇门.md",
]

system_rules = "\n\n".join(
    (base / p).read_text(encoding="utf-8")
    for p in parts
)

template = f"""
<|im_start|>system
{system_rules}
<|im_end|>

{{% for message in messages %}}
<|im_start|>{{{{ message['role'] }}}}
{{{{ message['content'] }}}}
<|im_end|>
{{% endfor %}}

<|im_start|>assistant
"""


Path(
    "./md_5术/prompt.jinja"
).write_text(
    template,
    encoding="utf-8"
)

print("done")
