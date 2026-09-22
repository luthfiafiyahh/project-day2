import pymupdf

def test_ro_rendering():
    # Test with a long RO name (the problematic case reported by user)
    doc_out = pymupdf.open("analysis/sample_output.pdf")
    p1 = doc_out[0]
    
    # Crop the problematic area: y_top 310-430 (RO label through KRO label)
    crop = pymupdf.Rect(50, 310, 546, 450)
    pix = p1.get_pixmap(dpi=200, clip=crop)
    pix.save("analysis/page1_ro_crop.png")
    
    # Also do template for comparison
    doc_tmpl = pymupdf.open("public/template.pdf")
    p1t = doc_tmpl[0]
    pixt = p1t.get_pixmap(dpi=200, clip=crop)
    pixt.save("analysis/page1_ro_template.png")
    
    print("Saved crops:")
    print("  - analysis/page1_ro_crop.png (output)")
    print("  - analysis/page1_ro_template.png (template)")
    
    # Print text in that area
    words = p1.get_text("words", clip=crop)
    print("\nWords in output RO block:")
    for w in sorted(words, key=lambda x: (x[1], x[0])):
        print(f"  y={w[1]:.0f}-{w[3]:.0f} x={w[0]:.0f}: '{w[4]}'")

test_ro_rendering()
