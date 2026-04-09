"""
Chia văn bản quy định thành các chunk theo từng Điều,
giữ lại metadata (chương, điều) và lưu ra file JSON trong data/processed.
"""

import json
import re
import os

RAW_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "raw")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed")


def chunk_by_dieu(text: str) -> list[dict]:
    """Chia văn bản thành các chunk theo từng Điều, kèm metadata chương."""
    chunks = []
    current_chuong = ""
    current_dieu = ""
    current_lines = []

    for line in text.splitlines():
        stripped = line.strip()

        # Gặp dòng CHƯƠNG mới -> cập nhật chương
        chuong_match = re.match(r"(CHƯƠNG [IVXLC]+:\s*.+)", stripped)
        if chuong_match:
            current_chuong = chuong_match.group(1)
            continue

        # Gặp Điều mới -> lưu chunk trước đó, bắt đầu chunk mới
        dieu_match = re.match(r"(Điều \d+\.\s*.+)", stripped)
        if dieu_match:
            if current_dieu and current_lines:
                chunks.append({
                    "chuong": current_chuong,
                    "dieu": current_dieu,
                    "content": "\n".join(current_lines),
                })
            current_dieu = dieu_match.group(1)
            current_lines = [stripped]
            continue

        # Dòng nội dung thông thường
        if current_dieu:
            current_lines.append(line.rstrip())

    # Lưu chunk cuối cùng
    if current_dieu and current_lines:
        chunks.append({
            "chuong": current_chuong,
            "dieu": current_dieu,
            "content": "\n".join(current_lines),
        })

    return chunks


def process_file(filename: str) -> list[dict]:
    """Đọc file raw, chia chunk, lưu JSON vào processed."""
    raw_path = os.path.join(RAW_DIR, filename)
    with open(raw_path, "r", encoding="utf-8") as f:
        text = f.read()

    doc_title = text.split("\n")[0].strip()

    chunks = chunk_by_dieu(text)
    for chunk in chunks:
        chunk["source"] = filename
        chunk["doc_title"] = doc_title

    os.makedirs(PROCESSED_DIR, exist_ok=True)
    out_name = os.path.splitext(filename)[0] + "_chunks.json"
    out_path = os.path.join(PROCESSED_DIR, out_name)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    return chunks


def process_all() -> list[dict]:
    """Xử lý tất cả file .txt trong data/raw."""
    if not os.path.exists(RAW_DIR):
        return []

    all_chunks = []
    for filename in os.listdir(RAW_DIR):
        if filename.endswith(".txt"):
            all_chunks.extend(process_file(filename))
    return all_chunks


if __name__ == "__main__":
    chunks = process_all()
    for i, c in enumerate(chunks):
        print(f"Chunk {i+1}: [{c['chuong']}] {c['dieu']}")
    print(f"Total: {len(chunks)} chunks")