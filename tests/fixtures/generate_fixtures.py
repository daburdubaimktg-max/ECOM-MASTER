"""
Generates the demonstration documents used by the automated tests and the demo seed.

Everything here describes a FICTIONAL brand ("Demo Botanics"). No real brand, product, claim or
market data is represented. Run with:  python3 tests/fixtures/generate_fixtures.py
Requires: reportlab, python-docx, python-pptx, openpyxl, Pillow.
"""
from pathlib import Path

OUT = Path(__file__).parent

# ---------------------------------------------------------------- PDF brand book
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

styles = getSampleStyleSheet()
story = []


def page(title, paragraphs):
    story.append(Paragraph(title, styles["Title"]))
    story.append(Spacer(1, 12))
    for text in paragraphs:
        story.append(Paragraph(text, styles["BodyText"]))
        story.append(Spacer(1, 8))
    story.append(PageBreak())


page(
    "Demo Botanics Brand Book (DEMONSTRATION DOCUMENT)",
    [
        "This is a fictional brand book created only to demonstrate the Brand Intelligence Engine. Demo Botanics is not a real company.",
        "Brand essence: everyday botanical care rooted in traditional herbal knowledge and proven by modern testing.",
        "Brand positioning: Demo Botanics offers affordable, plant-based hair and personal care for families who want natural ingredients without compromising on results.",
    ],
)
page(
    "Tone of voice",
    [
        "We speak warmly and plainly, like a knowledgeable friend. We explain what an ingredient does instead of using scientific jargon.",
        "We never exaggerate. We avoid words such as miracle, cure, guaranteed and instant.",
        "We write in short sentences. We address the reader as you. We always name the key botanical ingredient in the first sentence.",
    ],
)
page(
    "Visual guidelines",
    [
        "The primary brand colour is leaf green with a warm cream background. The logo always sits on the top left with clear space equal to the height of the letter D.",
        "Product photography uses a pure white background for marketplace main images, with the full pack visible and occupying most of the frame.",
        "Lifestyle photography shows real hair textures in natural daylight. We do not retouch hair to look unrealistically glossy.",
    ],
)
page(
    "Claims policy",
    [
        "Approved claim: Nourishing Hair Oil helps reduce hair breakage caused by dryness when used three times a week.",
        "Approved claim: Enriched with almond oil and coconut oil.",
        "Restricted claim: We must never say that any product cures dandruff, treats hair loss or regrows hair. These are medical claims and are not permitted.",
        "Restricted claim: Do not describe products as chemical free.",
    ],
)
SimpleDocTemplate(str(OUT / "demo-brand-book.pdf"), pagesize=A4, title="Demo Botanics Brand Book (demonstration)").build(story)

# ---------------------------------------------------------------- DOCX product catalogue (English + Arabic)
import docx

d = docx.Document()
d.add_heading("Demo Botanics Product Catalogue (DEMONSTRATION DOCUMENT)", level=1)
d.add_paragraph("Fictional products created to demonstrate the Brand Intelligence Engine.")
d.add_heading("Nourishing Hair Oil", level=2)
d.add_paragraph("A lightweight daily hair oil with almond and coconut that soothes a dry, flaky scalp and leaves hair soft and shiny. Available in 100 ml, 200 ml and 300 ml bottles.")
d.add_paragraph("Directions: massage a small amount into the scalp and hair, leave for at least thirty minutes, then wash with shampoo.")
d.add_heading("Herbal Toothpaste", level=2)
d.add_paragraph("A clove and mint toothpaste for everyday gum care and fresh breath. Contains fluoride. Not suitable for children under six years.")
d.add_heading("Arabic description", level=2)
d.add_paragraph("زيت شعر مغذي باللوز وجوز الهند يرطب فروة الرأس الجافة ويمنح الشعر نعومة ولمعاناً.")
d.save(str(OUT / "demo-product-catalogue.docx"))

# ---------------------------------------------------------------- PPTX range presentation with speaker notes
from pptx import Presentation
from pptx.util import Inches

prs = Presentation()
for title, body, notes in [
    ("Demo Botanics range overview (DEMO)", "Hair care, oral care and skin care for the whole family.", "Fictional content for demonstration only."),
    ("Hair care range", "Nourishing Hair Oil, Strengthening Shampoo and Leave-in Conditioner.", "The hero product is Nourishing Hair Oil in the 200 ml size."),
    ("Oral care range", "Herbal Toothpaste with clove and mint.", "Position against mainstream fluoride toothpastes on botanical ingredients."),
]:
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = title
    slide.placeholders[1].text = body
    slide.notes_slide.notes_text_frame.text = notes
prs.save(str(OUT / "demo-range-presentation.pptx"))

# ---------------------------------------------------------------- XLSX claims register
import openpyxl

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Claims register"
ws.append(["Product", "Claim", "Status", "Market"])
ws.append(["Nourishing Hair Oil", "Helps reduce hair breakage caused by dryness", "Approved", "All"])
ws.append(["Nourishing Hair Oil", "Clinically proven to regrow hair", "Restricted", "All"])
ws.append(["Herbal Toothpaste", "Fights germs for twelve hours", "Unverified", "UAE"])
ws2 = wb.create_sheet("Pack sizes")
ws2.append(["SKU", "Size (ml)", "Units per case"])
ws2.append(["DB-HO-ALM-200", 200, 24])
wb.save(str(OUT / "demo-claims-register.xlsx"))

# ---------------------------------------------------------------- PNG hero image (plain placeholder pack shot)
from PIL import Image, ImageDraw

img = Image.new("RGB", (1600, 1600), (255, 255, 255))
draw = ImageDraw.Draw(img)
draw.rounded_rectangle((600, 250, 1000, 1400), radius=60, fill=(46, 110, 78))
draw.rectangle((700, 150, 900, 260), fill=(30, 60, 45))
draw.rectangle((640, 700, 960, 1000), fill=(246, 240, 225))
draw.text((690, 820), "DEMO BOTANICS", fill=(30, 60, 45))
img.save(str(OUT / "demo-hero-image.png"), optimize=True)

# ---------------------------------------------------------------- CSV product import sample
(OUT / "demo-products.csv").write_text(
    "product_name,sub_brand,category,description,benefits,ingredients,directions_for_use,target_audience,status,variant_name,size_value,size_unit,pack_quantity,sku_code,gtin,countries\n"
    '"Nourishing Hair Oil","","Hair Care > Hair Oil","A lightweight daily hair oil with almond and coconut.","Soothes dry scalp|Adds shine|Helps reduce breakage caused by dryness","Coconut oil, almond oil, fragrance","Massage into scalp and hair, leave for thirty minutes, then wash.","Adults with dry hair","active","Almond","100","ml","1","DB-HO-ALM-100","","AE|SA"\n'
    '"Nourishing Hair Oil","","","","","","","","","Almond","200","ml","1","DB-HO-ALM-200","","AE|SA|IN"\n'
    '"Nourishing Hair Oil","","","","","","","","","Almond","200","ml","2","DB-HO-ALM-200X2","","AE"\n'
    '"Herbal Toothpaste","","Oral Care > Toothpaste","Clove and mint toothpaste for everyday gum care.","Fresh breath|Everyday gum care","Calcium carbonate, clove oil, mint, sodium fluoride","Brush twice daily.","Adults and children over six","active","Clove & Mint","150","g","1","DB-TP-CLV-150","","AE|KE|NG"\n'
    '"Broken Row Product","","","","","","","","","Mint","abc","g","1","DB-BAD-1","","AE"\n',
    encoding="utf-8",
)
print("fixtures written to", OUT)
