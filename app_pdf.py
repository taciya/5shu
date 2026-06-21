import fitz
from pathlib import Path

pdf_path = Path("static/hexagrams/hexagrams.pdf")

output_dir = Path("static/hexagrams/pages")
output_dir.mkdir(parents=True, exist_ok=True)

pdf = fitz.open(str(pdf_path))

print(f"总页数: {pdf.page_count}")

for page_no in range(pdf.page_count):

    page = pdf.load_page(page_no)

    pix = page.get_pixmap(
        matrix=fitz.Matrix(4, 4),
        alpha=False
    )

    filename = output_dir / f"{page_no + 1:03d}.png"

    pix.save(str(filename))

    print("生成:", filename)

pdf.close()

print("完成")
