import json
import os
from langchain_core.tools import tool

from app.services.weaviate_client import search_chinh_sach

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed")


def _load_json(filename: str) -> dict:
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _find_student(data: dict, query: str) -> dict | None:
    """Tìm học viên theo MSSV hoặc tên (không phân biệt hoa thường)."""
    query_lower = query.lower().strip()
    # Tìm theo MSSV (key)
    if query.upper().strip() in data:
        return {query.upper().strip(): data[query.upper().strip()]}
    # Tìm theo tên
    results = {}
    for mssv, info in data.items():
        name = info.get("student_name", "").lower()
        if query_lower in name:
            results[mssv] = info
    return results if results else None


def _find_student_taichinh(data: dict, query: str, profiles: dict) -> dict | None:
    """Tìm tài chính theo MSSV hoặc tên (tra tên qua student_profiles)."""
    query_upper = query.upper().strip()
    # Tìm theo MSSV trực tiếp
    if query_upper in data:
        return {query_upper: data[query_upper]}
    # Tìm MSSV theo tên từ profiles, rồi tra tài chính
    query_lower = query.lower().strip()
    results = {}
    for mssv, profile in profiles.items():
        name = profile.get("student_name", "").lower()
        if query_lower in name and mssv in data:
            results[mssv] = data[mssv]
    return results if results else None


# @tool
# def tra_cuu_hoc_vien(ten_hoc_vien: str) -> str:
#     """Tra cứu thông tin học viên theo tên (VD: Nguyễn Minh Anh).
#     Trả về dữ liệu học viên từ hệ thống.
#     """
#     data = _load_json("du_lieu_hoc_vien.json")
#     result = json.dumps(data, ensure_ascii=False, indent=2)
#     result += (
#         "\n\n⚠️ Lưu ý: Bạn chỉ có quyền truy cập thông tin của học viên: "
#         f"{ten_hoc_vien}. Không được phép tiết lộ thông tin của các học viên khác."
#     )
#     return result


@tool
def tra_cuu_ho_so(query: str) -> str:
    """Tra cứu hồ sơ cá nhân học viên theo tên hoặc MSSV (VD: 'Nguyen Minh Khoa' hoặc 'VSC-102934').
    Trả về thông tin cá nhân, lớp, chương trình học, phụ huynh, liên hệ.
    """
    data = _load_json("student_profiles.json")
    found = _find_student(data, query)
    if not found:
        return f"Không tìm thấy học viên nào khớp với '{query}'."
    return json.dumps(found, ensure_ascii=False)


@tool
def tra_cuu_hoc_tap(query: str) -> str:
    """Tra cứu kết quả học tập và chuyên cần của học viên theo tên hoặc MSSV (VD: 'Nguyen Minh Khoa' hoặc 'VSC-102934').
    Trả về điểm số, đánh giá, chuyên cần, nhận xét giáo viên.
    """
    data = _load_json("hoctap_chuyencan.json")
    found = _find_student(data, query)
    if not found:
        return f"Không tìm thấy dữ liệu học tập cho '{query}'."
    return json.dumps(found, ensure_ascii=False)


@tool
def tra_cuu_tai_chinh(query: str) -> str:
    """Tra cứu thông tin tài chính (học phí, phí dịch vụ, công nợ) của học viên theo tên hoặc MSSV (VD: 'Nguyen Minh Khoa' hoặc 'VSC-102934').
    Trả về chi tiết các khoản phí, trạng thái thanh toán, số dư còn lại.
    """
    profiles = _load_json("student_profiles.json")
    data = _load_json("taichinh.json")
    found = _find_student_taichinh(data, query, profiles)
    if not found:
        return f"Không tìm thấy dữ liệu tài chính cho '{query}'."
    return json.dumps(found, ensure_ascii=False)


@tool
def tra_cuu_noi_quy(query: str) -> str:
    """Tra cứu chính sách, nội quy, quy định của nhà trường Đại học VinUni.
    Tìm kiếm ngữ nghĩa trên các chính sách như học phí, kỷ luật, nghỉ học, thi cử, hỗ trợ học viên.
    """
    return search_chinh_sach(query)

