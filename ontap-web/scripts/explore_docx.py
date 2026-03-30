import zipfile
import os
import xml.etree.ElementTree as ET

def get_xml_content(docx_path):
    with zipfile.ZipFile(docx_path, 'r') as zip_ref:
        xml_content = zip_ref.read('word/document.xml')
    return xml_content

def debug_xml(docx_path):
    content = get_xml_content(docx_path)
    # Write first 5000 chars to a file for investigation
    with open('e:/Antigravity/TNDNB/ontap-web/scripts/sample_xml.xml', 'wb') as f:
        f.write(content[:10000])
    print(f"Extracted first 10000 bytes of {docx_path} to sample_xml.xml")

debug_xml("D:/Download/dieu dong.docx")
