import gzip
import hashlib
import html
import json
import re
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from typing import Dict, List, Optional, Tuple

from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/news", tags=["news"])

_REQUEST_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Encoding": "identity",
}

_RSS_SOCKET_TIMEOUT = 3.0
_RSS_TOTAL_BUDGET_SEC = 4.5
_OVERALL_BUDGET_SEC = 5.5
_GTX_TIMEOUT_SEC = 1.2
_GTX_MAX_ITEMS = 3
_MIN_VI_WORDS = 35

_TOPIC_ALIASES: Dict[str, str] = {
    "": "general",
    "all": "general",
    "general": "general",
    "tin moi": "general",
    "tin tuc": "general",
    "tong hop": "general",
    "thoi su": "general",
    "news": "general",
    "moi nhat": "general",
    "tech": "technology",
    "technology": "technology",
    "cong nghe": "technology",
    "so hoa": "technology",
    "ai": "technology",
    "khoa hoc": "technology",
    "science": "technology",
    "it": "technology",
    "khoa hoc cong nghe": "technology",
    "nhip song so": "technology",
    "environment": "environment",
    "env": "environment",
    "climate": "environment",
    "moi truong": "environment",
    "khi hau": "environment",
    "xanh": "environment",
    "green": "environment",
    "thien nhien": "environment",
    "nang luong": "environment",
    "education": "education",
    "edu": "education",
    "giao duc": "education",
    "hoc tap": "education",
    "dai hoc": "education",
    "ielts": "education",
    "school": "education",
    "tuyen sinh": "education",
    "economy": "economy",
    "econ": "economy",
    "business": "economy",
    "kinh te": "economy",
    "kinh doanh": "economy",
    "tai chinh": "economy",
    "finance": "economy",
    "thi truong": "economy",
    "health": "health",
    "suc khoe": "health",
    "y te": "health",
    "medical": "health",
    "dinh duong": "health",
    "culture": "culture",
    "van hoa": "culture",
    "giai tri": "culture",
    "entertainment": "culture",
    "du lich": "culture",
    "travel": "culture",
    "lifestyle": "culture",
    "nghe thuat": "culture",
    "sports": "sports",
    "sport": "sports",
    "the thao": "sports",
    "bong da": "sports",
    "football": "sports",
    "world": "world",
    "the gioi": "world",
    "quoc te": "world",
    "current affairs": "world",
    "international": "world",
}

_TOPIC_FEEDS: Dict[str, List[Tuple[str, str]]] = {
    "general": [
        ("VnExpress", "https://vnexpress.net/rss/tin-moi-nhat.rss"),
        ("BBC Vietnamese", "https://feeds.bbci.co.uk/vietnamese/rss.xml"),
        ("Thanh Niên", "https://thanhnien.vn/rss/home.rss"),
        ("Tuổi Trẻ", "https://tuoitre.vn/rss/tin-moi-nhat.rss"),
    ],
    "technology": [
        ("VnExpress Số hóa", "https://vnexpress.net/rss/so-hoa.rss"),
        ("VnExpress Khoa học", "https://vnexpress.net/rss/khoa-hoc.rss"),
        ("VietnamNet Công nghệ", "https://vietnamnet.vn/rss/cong-nghe.rss"),
        ("Tuổi Trẻ Công nghệ", "https://tuoitre.vn/rss/nhip-song-so.rss"),
    ],
    "environment": [
        ("VnExpress Khoa học", "https://vnexpress.net/rss/khoa-hoc.rss"),
        ("Tuổi Trẻ Khoa học", "https://tuoitre.vn/rss/khoa-hoc.rss"),
        ("BBC Vietnamese", "https://feeds.bbci.co.uk/vietnamese/rss.xml"),
    ],
    "education": [
        ("VnExpress Giáo dục", "https://vnexpress.net/rss/giao-duc.rss"),
        ("Tuổi Trẻ Giáo dục", "https://tuoitre.vn/rss/giao-duc.rss"),
    ],
    "economy": [
        ("VnExpress Kinh doanh", "https://vnexpress.net/rss/kinh-doanh.rss"),
        ("Tuổi Trẻ Kinh doanh", "https://tuoitre.vn/rss/kinh-doanh.rss"),
    ],
    "health": [
        ("VnExpress Sức khỏe", "https://vnexpress.net/rss/suc-khoe.rss"),
        ("Tuổi Trẻ Sức khỏe", "https://tuoitre.vn/rss/suc-khoe.rss"),
    ],
    "culture": [
        ("VnExpress Giải trí", "https://vnexpress.net/rss/giai-tri.rss"),
        ("Tuổi Trẻ Văn hóa", "https://tuoitre.vn/rss/van-hoa.rss"),
    ],
    "sports": [
        ("VnExpress Thể thao", "https://vnexpress.net/rss/the-thao.rss"),
        ("Tuổi Trẻ Thể thao", "https://tuoitre.vn/rss/the-thao.rss"),
    ],
    "world": [
        ("BBC Vietnamese", "https://feeds.bbci.co.uk/vietnamese/rss.xml"),
        ("VnExpress Thế giới", "https://vnexpress.net/rss/the-gioi.rss"),
        ("Tuổi Trẻ Thế giới", "https://tuoitre.vn/rss/the-gioi.rss"),
    ],
}

_TOPIC_ENGLISH_LABELS: Dict[str, str] = {
    "general": "current affairs",
    "technology": "technology and science",
    "environment": "environment and climate",
    "education": "education",
    "economy": "economy and business",
    "health": "health and medicine",
    "culture": "culture and lifestyle",
    "sports": "sports",
    "world": "world affairs",
}

_ENV_KEYWORDS = (
    "moi truong",
    "khi hau",
    "nang luong",
    "o nhiem",
    "rung",
    "bien",
    "thien nhien",
    "bao",
    "lu",
    "rac thai",
    "phat thai",
    "xanh",
    "thien tai",
)


def _normalize_text(text: Optional[str]) -> str:
    if not text:
        return ""
    s = str(text).replace("đ", "d").replace("Đ", "D")
    s = unicodedata.normalize("NFD", s)
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def _compute_length_tier(word_count: int) -> str:
    if word_count < 90:
        return "short"
    if word_count <= 180:
        return "medium"
    return "long"


def _resolve_topic(raw_topic: Optional[str]) -> Tuple[str, str]:
    norm = _normalize_text(raw_topic)
    if norm in _TOPIC_ALIASES:
        return _TOPIC_ALIASES[norm], ""
    return "general", norm


def _local_name(tag: str) -> str:
    if not tag:
        return ""
    if "}" in tag:
        return tag.rsplit("}", 1)[-1].lower()
    return tag.lower()


def _decode_xml_bytes(raw: bytes) -> str:
    if not raw:
        return ""
    if raw[:2] == b"\x1f\x8b":
        try:
            raw = gzip.decompress(raw)
        except Exception:
            return ""
    if raw.startswith(b"\xef\xbb\xbf"):
        raw = raw[3:]

    declared_encoding = None
    head = raw[:256].decode("ascii", errors="ignore")
    m = re.search(r"""encoding\s*=\s*['"]([A-Za-z0-9._-]+)['"]""", head, flags=re.IGNORECASE)
    if m:
        declared_encoding = m.group(1)

    xml_text = ""
    for enc in ([declared_encoding] if declared_encoding else []) + ["utf-8"]:
        try:
            xml_text = raw.decode(enc, errors="strict")
            break
        except (LookupError, UnicodeDecodeError):
            xml_text = ""
    if not xml_text:
        xml_text = raw.decode("utf-8", errors="replace")

    xml_text = xml_text.lstrip("\ufeff")
    xml_text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", xml_text)
    xml_text = re.sub(r"<!DOCTYPE\b[^>]*?(?:\[[^\]]*\]\s*)?>", "", xml_text, flags=re.IGNORECASE | re.DOTALL)
    xml_text = re.sub(r"<!ENTITY\b[^>]*>", "", xml_text, flags=re.IGNORECASE)
    return xml_text.strip()


def _clean_html_text(raw: Optional[str]) -> str:
    if not raw:
        return ""
    text = html.unescape(str(raw))
    text = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", " ", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", " ", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = text.replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"(?:\s*(?:Đọc thêm|Xem chi tiết|\[\.\.\.\]|\.\.\.))\s*$", "", text, flags=re.IGNORECASE).strip()
    return text


def _child_text(el: ET.Element, candidate_names: Tuple[str, ...]) -> str:
    for child in el:
        if _local_name(child.tag) in candidate_names:
            val = "".join(child.itertext()).strip()
            if val:
                return val
    return ""


def _extract_entry_link(el: ET.Element) -> str:
    text_link = _child_text(el, ("link", "guid", "id"))
    if text_link:
        return text_link
    fallback_href = ""
    for child in el:
        if _local_name(child.tag) == "link":
            href = (child.attrib.get("href") or "").strip()
            if not href:
                continue
            rel = (child.attrib.get("rel") or "alternate").lower()
            if rel == "alternate":
                return href
            if not fallback_href:
                fallback_href = href
    return fallback_href


def _extract_longest_body(el: ET.Element) -> str:
    candidates: List[str] = []
    for child in el:
        if _local_name(child.tag) in ("encoded", "content", "description", "summary"):
            raw_val = "".join(child.itertext()).strip()
            cleaned = _clean_html_text(raw_val)
            if cleaned:
                candidates.append(cleaned)
    if not candidates:
        return ""
    return max(candidates, key=len)


def _parse_feed_xml(raw_bytes: bytes, source_label: str) -> List[Dict[str, str]]:
    xml_text = _decode_xml_bytes(raw_bytes)
    if not xml_text:
        return []
    try:
        root = ET.fromstring(xml_text)
    except Exception:
        return []

    parsed: List[Dict[str, str]] = []
    for el in root.iter():
        if _local_name(el.tag) not in ("item", "entry"):
            continue
        title = _clean_html_text(_child_text(el, ("title",)))
        body = _extract_longest_body(el)
        link = _extract_entry_link(el)
        if not title and not body:
            continue
        parsed.append(
            {
                "title": title,
                "body": body,
                "link": link,
                "sourceLabel": source_label,
            }
        )
    return parsed


def _fetch_feed_bytes(url: str, timeout: float) -> bytes:
    req = urllib.request.Request(url, headers=_REQUEST_HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
        headers = getattr(resp, "headers", None)
        if headers is not None:
            encoding = (headers.get("Content-Encoding") or "").lower()
            if "gzip" in encoding and data and data[:2] != b"\x1f\x8b":
                try:
                    return gzip.decompress(data)
                except Exception:
                    return data
        return data


def _combine_title_and_body(title: str, body: str) -> str:
    if not body:
        return title
    if not title:
        return body
    norm_title = _normalize_text(title)
    norm_body = _normalize_text(body)
    if norm_title and norm_body.startswith(norm_title):
        return body
    sep = " " if title[-1] in ".!?…:" else ". "
    return f"{title}{sep}{body}"


def _try_gtx_translate_vi_to_en(title: str, text_vi: str, timeout: float) -> Optional[Tuple[str, str]]:
    combined = f"{title}\n\n{text_vi}"
    if len(combined) > 1200:
        combined = combined[:1200].rsplit(" ", 1)[0]
    url = (
        "https://translate.googleapis.com/translate_a/single"
        "?client=gtx&sl=vi&tl=en&dt=t&q=" + urllib.parse.quote(combined)
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            payload = json.loads(resp.read().decode("utf-8", errors="replace"))
        if not isinstance(payload, list) or not payload or not isinstance(payload[0], list):
            return None
        translated = "".join(
            part[0] for part in payload[0] if isinstance(part, list) and part and isinstance(part[0], str)
        ).strip()
        if not translated:
            return None
        if "\n\n" in translated:
            en_title, en_body = translated.split("\n\n", 1)
            en_title = en_title.strip()
            en_body = en_body.strip()
        elif "\n" in translated:
            en_title, en_body = translated.split("\n", 1)
            en_title = en_title.strip()
            en_body = en_body.strip()
        else:
            en_title = translated[:120].strip()
            en_body = translated
        if not en_title or not en_body:
            return None
        if _normalize_text(en_body) == _normalize_text(text_vi):
            return None
        return en_title, en_body
    except Exception:
        return None


def _extract_ascii_highlights(text_vi: str) -> List[str]:
    tokens = re.findall(r"\b(?:[A-Z0-9][A-Za-z0-9.\-%]{1,24})\b", text_vi)
    seen = set()
    out: List[str] = []
    for tok in tokens:
        clean = tok.strip(".,;:!?\"'()[]")
        if len(clean) < 2:
            continue
        if not clean.isascii():
            continue
        low = clean.lower()
        if low in seen:
            continue
        seen.add(low)
        out.append(clean)
        if len(out) >= 4:
            break
    return out


def _build_fallback_en(
    title: str,
    text_vi: str,
    source_label: str,
    canonical_topic: str,
    word_count_vi: int,
) -> Tuple[str, str]:
    topic_en = _TOPIC_ENGLISH_LABELS.get(canonical_topic, "current affairs")
    highlights = _extract_ascii_highlights(f"{title} {text_vi}")
    if highlights:
        title_en = f"{topic_en.title()} News Brief: {', '.join(highlights[:2])} ({source_label})"
        detail_clause = f" Key terms and figures mentioned include {', '.join(highlights)}."
    else:
        title_en = f"{topic_en.title()} News Brief ({source_label})"
        detail_clause = ""
    reference_en = (
        f"This Vietnamese news report from {source_label} covers recent developments in {topic_en}."
        f"{detail_clause} Read the {word_count_vi}-word Vietnamese passage carefully and translate its core "
        f"facts, actors, and timeline into clear, natural English."
    )
    return title_en, reference_en


def _build_curated_item(
    item_id: str,
    topic: str,
    title: str,
    title_en: str,
    text_vi: str,
    reference_en: str,
    source_label: str,
) -> Dict[str, object]:
    clean_vi = re.sub(r"\s+", " ", text_vi).strip()
    wc = len(clean_vi.split())
    return {
        "id": item_id,
        "_topic": topic,
        "title": title.strip(),
        "titleEn": title_en.strip(),
        "textVi": clean_vi,
        "referenceEn": re.sub(r"\s+", " ", reference_en).strip(),
        "sourceLabel": source_label.strip(),
        "lengthTier": _compute_length_tier(wc),
        "wordCountVi": wc,
    }


def _to_public_item(item: Dict[str, object]) -> Dict[str, object]:
    return {
        "id": item["id"],
        "title": item["title"],
        "titleEn": item["titleEn"],
        "textVi": item["textVi"],
        "referenceEn": item["referenceEn"],
        "sourceLabel": item["sourceLabel"],
        "lengthTier": item["lengthTier"],
        "wordCountVi": item["wordCountVi"],
    }


CURATED_NEWS_ITEMS: List[Dict[str, object]] = [
    # --- SHORT (6 items: ~55-80 words each) ---
    _build_curated_item(
        "curated_tech_01",
        "technology",
        "Việt Nam đẩy nhanh phủ sóng 5G tại các khu công nghệ cao",
        "Vietnam Accelerates 5G Coverage Across High-Tech Parks",
        (
            "Các doanh nghiệp viễn thông lớn tại Việt Nam đang tăng tốc lắp đặt trạm phát sóng 5G "
            "tại các khu công nghệ cao ở Hà Nội, Đà Nẵng và Thành phố Hồ Chí Minh. Hạ tầng mạng "
            "tốc độ cao giúp nhà máy thông minh kết nối hàng nghìn cảm biến theo thời gian thực, "
            "giảm độ trễ truyền dữ liệu và nâng cao năng suất sản xuất công nghiệp trong giai đoạn "
            "chuyển đổi số mạnh mẽ hiện nay."
        ),
        (
            "Major telecommunications operators in Vietnam are accelerating the installation of 5G "
            "base stations across high-tech parks in Hanoi, Da Nang, and Ho Chi Minh City. High-speed "
            "network infrastructure enables smart factories to connect thousands of sensors in real "
            "time, lowering data latency and boosting industrial productivity during the current "
            "digital transformation."
        ),
        "VnExpress Số hóa (Curated)",
    ),
    _build_curated_item(
        "curated_env_01",
        "environment",
        "Thành phố ven biển mở rộng dự án trồng rừng ngập mặn chống xói lở",
        "Coastal Cities Expand Mangrove Planting Projects Against Erosion",
        (
            "Nhiều địa phương ven biển miền Trung đang phối hợp với chuyên gia khí hậu mở rộng "
            "diện tích rừng ngập mặn nhằm giảm tác động của triều cường và bão lớn. Theo báo cáo "
            "môi trường mới nhất, các dải rừng ven bờ không chỉ giữ phù sa ổn định đường bờ biển "
            "mà còn tạo sinh kế bền vững cho người dân nuôi trồng thủy sản địa phương."
        ),
        (
            "Several central coastal localities are partnering with climate experts to expand mangrove "
            "forest coverage in order to reduce the impact of high tides and severe storms. According "
            "to the latest environmental report, coastal forest belts not only trap silt to stabilize "
            "shorelines but also create sustainable livelihoods for local aquaculture farmers."
        ),
        "VnExpress Khoa học (Curated)",
    ),
    _build_curated_item(
        "curated_edu_01",
        "education",
        "Nhiều trường đại học tích hợp kỹ năng dữ liệu vào chương trình cử nhân",
        "Universities Integrate Data Skills Into Undergraduate Curricula",
        (
            "Từ năm học mới, nhiều trường đại học công lập và tư thục đã bổ sung học phần phân "
            "tích dữ liệu và tư duy phản biện vào chương trình đào tạo đại cương. Nhà trường kỳ "
            "vọng sinh viên thuộc mọi chuyên ngành đều biết cách đọc biểu đồ, đánh giá thông tin "
            "khách quan và sử dụng công cụ số an toàn trước khi bước vào thị trường lao động."
        ),
        (
            "Starting in the new academic year, many public and private universities have added data "
            "analytics and critical thinking modules to their general education curricula. Institutions "
            "expect students across all majors to read charts, evaluate information objectively, and use "
            "digital tools safely before entering the labor market."
        ),
        "VnExpress Giáo dục (Curated)",
    ),
    _build_curated_item(
        "curated_econ_01",
        "economy",
        "Xuất khẩu nông sản chế biến sâu ghi nhận mức tăng trưởng ấn tượng",
        "Deep-Processed Agricultural Exports Record Impressive Growth",
        (
            "Kim ngạch xuất khẩu rau quả và cà phê chế biến sâu của Việt Nam tăng trưởng tích cực "
            "nhờ doanh nghiệp đầu tư mạnh vào dây chuyền bảo quản lạnh và truy xuất nguồn gốc. Việc "
            "đáp ứng tiêu chuẩn xanh của thị trường châu Âu và Nhật Bản giúp sản phẩm nâng cao giá "
            "trị gia tăng thay vì chỉ xuất khẩu nguyên liệu thô như trước đây."
        ),
        (
            "Vietnam's export turnover of deep-processed fruits, vegetables, and coffee has grown "
            "strongly thanks to heavy corporate investment in cold-chain preservation and traceability "
            "systems. Meeting green standards in European and Japanese markets enables producers to raise "
            "added value rather than relying solely on raw commodity exports as before."
        ),
        "VnExpress Kinh doanh (Curated)",
    ),
    _build_curated_item(
        "curated_health_01",
        "health",
        "Bác sĩ khuyến cáo duy trì thói quen vận động nhẹ giữa giờ làm việc",
        "Doctors Recommend Light Physical Activity Breaks During Work Hours",
        (
            "Các chuyên gia y tế cảnh báo thói quen ngồi liên tục nhiều giờ trước màn hình máy tính "
            "làm tăng nguy cơ đau cột sống và rối loạn chuyển hóa ở nhân viên văn phòng. Chỉ cần "
            "đứng dậy đi bộ năm phút sau mỗi giờ làm việc, kết hợp uống đủ nước và hít thở sâu, "
            "người lao động có thể cải thiện tuần hoàn máu và sự tập trung rõ rệt."
        ),
        (
            "Medical experts warn that sitting continuously for hours in front of a computer screen "
            "raises the risk of spinal pain and metabolic disorders among office workers. Simply "
            "standing up to walk for five minutes every hour, combined with staying hydrated and "
            "breathing deeply, helps employees noticeably improve blood circulation and focus."
        ),
        "VnExpress Sức khỏe (Curated)",
    ),
    _build_curated_item(
        "curated_sports_01",
        "sports",
        "Giải chạy cộng đồng thu hút hàng nghìn người tham gia vào sáng cuối tuần",
        "Community Marathon Attracts Thousands of Weekend Participants",
        (
            "Sáng chủ nhật vừa qua, giải chạy bộ vì sức khỏe cộng đồng tại khu vực hồ trung tâm đã "
            "thu hút hơn năm nghìn người ở nhiều độ tuổi tham dự. Ban tổ chức bố trí các cự ly "
            "linh hoạt từ năm đến hai mươi mốt kilômét cùng nhiều trạm tiếp nước y tế, lan tỏa "
            "tinh thần rèn luyện thể thao bền bỉ trong đời sống đô thị."
        ),
        (
            "Last Sunday morning, a community health marathon around the central lake drew more than "
            "five thousand participants of various ages. Organizers arranged flexible distances ranging "
            "from five to twenty-one kilometers alongside medical hydration stations, promoting a spirit "
            "of consistent physical exercise in urban life."
        ),
        "VnExpress Thể thao (Curated)",
    ),
    # --- MEDIUM (6 items: ~110-150 words each) ---
    _build_curated_item(
        "curated_tech_02",
        "technology",
        "Trí tuệ nhân tạo hỗ trợ cảnh báo sớm thiên tai và điều phối cứu hộ",
        "Artificial Intelligence Supports Early Disaster Warnings and Rescue Coordination",
        (
            "Các viện nghiên cứu công nghệ trong nước đang thử nghiệm mô hình trí tuệ nhân tạo kết "
            "hợp dữ liệu vệ tinh và cảm biến lượng mưa để dự báo nguy cơ lũ quét tại khu vực miền "
            "núi phía Bắc. Thay vì chỉ dựa vào bảng đo thủ công truyền thống, hệ thống mới có khả "
            "năng phân tích hàng triệu điểm dữ liệu địa hình và gửi cảnh báo sớm đến điện thoại của "
            "chính quyền địa phương trước nhiều giờ. Ngoài công tác dự báo, phần mềm bản đồ số còn "
            "hỗ trợ lực lượng cứu hộ xác định tuyến đường an toàn khi giao thông bị chia cắt. Các "
            "chuyên gia nhấn mạnh rằng công nghệ không thể thay thế hoàn toàn sự chuẩn bị của con "
            "người, nhưng sự kết hợp giữa dữ liệu chính xác và phản ứng nhanh sẽ giảm thiểu đáng kể "
            "thiệt hại về người và tài sản mỗi mùa mưa bão."
        ),
        (
            "Domestic technology research institutes are piloting an artificial intelligence model that "
            "combines satellite imagery and rainfall sensors to forecast flash-flood risks in the "
            "northern mountainous region. Instead of relying solely on traditional manual gauges, the "
            "new system can analyze millions of terrain data points and send early alerts to local "
            "authorities' phones several hours in advance. Beyond forecasting, digital mapping software "
            "also helps rescue teams identify safe routes when roads are cut off. Experts emphasize "
            "that technology cannot fully replace human preparedness, yet combining accurate data with "
            "rapid response will significantly reduce casualties and property damage each storm season."
        ),
        "VietnamNet Công nghệ (Curated)",
    ),
    _build_curated_item(
        "curated_env_02",
        "environment",
        "Hệ thống giao thông công cộng chạy điện giúp giảm tiếng ồn đô thị",
        "Electric Public Transit Fleet Helps Cut Urban Noise and Emissions",
        (
            "Sau hai năm đưa vào vận hành hàng trăm tuyến xe buýt điện tại các đô thị lớn, cơ quan "
            "quản lý giao thông ghi nhận mức độ hài lòng của hành khách tăng cao nhờ không gian sạch "
            "sẽ và vận hành êm ái. Không chỉ cắt giảm hàng chục nghìn tấn khí thải các-bon mỗi năm, "
            "đội xe chạy điện còn làm giảm rõ rệt tiếng ồn động cơ dọc các trục đường đông đúc giờ "
            "cao điểm. Để khuyến khích người dân chuyển từ xe máy cá nhân sang phương tiện công cộng, "
            "thành phố đang mở rộng mạng lưới trạm sạc nhanh, tích hợp vé điện tử liên thông với tàu "
            "điện đô thị và cải tạo vỉa hè cho người đi bộ. Các chuyên gia quy hoạch nhận định đầu tư "
            "vào giao thông xanh là giải pháp lâu dài giúp cải thiện chất lượng không khí và giảm ùn "
            "tắc bền vững."
        ),
        (
            "After two years of operating hundreds of electric bus routes in major cities, transport "
            "authorities have recorded higher passenger satisfaction thanks to clean cabins and quiet "
            "rides. In addition to cutting tens of thousands of tons of carbon emissions annually, the "
            "electric fleet noticeably lowers engine noise along congested corridors during rush hours. "
            "To encourage residents to shift from private motorbikes to public transit, municipalities "
            "are expanding fast-charging stations, integrating e-tickets across urban rail lines, and "
            "upgrading pedestrian sidewalks. Urban planners note that investing in green transit is a "
            "long-term solution for cleaner air and sustainable congestion relief."
        ),
        "Tuổi Trẻ Khoa học (Curated)",
    ),
    _build_curated_item(
        "curated_edu_02",
        "education",
        "Phương pháp học ngoại ngữ qua dự án thực tế giúp học sinh tự tin giao tiếp",
        "Project-Based Language Learning Boosts Students' Communication Confidence",
        (
            "Thay vì chỉ ghi chép từ vựng rời rạc và làm bài tập ngữ pháp trên giấy, nhiều lớp học "
            "tiếng Anh tại bậc trung học đang chuyển sang mô hình học tập dựa trên dự án thực tế. "
            "Trong mỗi học kỳ, học sinh làm việc theo nhóm để thực hiện bản tin ngắn, phỏng vấn khách "
            "mời hoặc thuyết trình về một vấn đề xã hội bằng tiếng Anh. Cách tiếp cận này buộc người "
            "học phải vận dụng linh hoạt kỹ năng đọc hiểu, dịch thuật, viết kịch bản và phát âm trước "
            "đám đông. Giáo viên đóng vai trò người hướng dẫn, góp ý trực tiếp về cách dùng từ tự nhiên "
            "và cấu trúc câu phù hợp ngữ cảnh. Kết quả khảo sát cho thấy tỷ lệ học sinh chủ động phát "
            "biểu và ghi nhớ từ vựng lâu dài tăng rõ rệt so với phương pháp truyền thống."
        ),
        (
            "Instead of merely memorizing isolated vocabulary lists and completing paper grammar drills, "
            "many secondary English classes are shifting toward project-based learning. Each semester, "
            "students collaborate in groups to produce short news bulletins, interview guests, or "
            "present on a social issue in English. This approach requires learners to flexibly apply "
            "reading comprehension, translation, scriptwriting, and public speaking skills. Teachers "
            "act as mentors, providing direct feedback on natural phrasing and context-appropriate "
            "sentence structure. Survey results show that the proportion of students who speak up "
            "voluntarily and retain vocabulary long-term increases significantly compared with "
            "traditional methods."
        ),
        "Tuổi Trẻ Giáo dục (Curated)",
    ),
    _build_curated_item(
        "curated_econ_02",
        "economy",
        "Doanh nghiệp vừa và nhỏ tận dụng thương mại điện tử xuyên biên giới",
        "Small and Medium Enterprises Leverage Cross-Border E-Commerce",
        (
            "Thương mại điện tử xuyên biên giới đang mở ra cơ hội tiếp cận khách hàng quốc tế cho "
            "hàng nghìn doanh nghiệp vừa và nhỏ tại Việt Nam mà không cần chi phí mở văn phòng đại "
            "diện ở nước ngoài. Nhờ các nền tảng thanh toán số và mạng lưới logistics ngày càng hoàn "
            "thiện, sản phẩm thủ công mỹ nghệ, gốm sứ và thời trang bền vững có thể được đặt mua "
            "trực tiếp từ Bắc Mỹ hay châu Âu chỉ trong vài ngày. Tuy nhiên, đại diện hiệp hội xuất "
            "khẩu lưu ý rằng cạnh tranh trên sàn trực tuyến rất khốc liệt, đòi hỏi doanh nghiệp phải "
            "đầu tư nghiêm túc vào hình ảnh thương hiệu, mô tả sản phẩm song ngữ chuẩn xác và dịch "
            "vụ chăm sóc khách hàng minh bạch để giữ vững uy tín lâu dài."
        ),
        (
            "Cross-border e-commerce is opening access to international buyers for thousands of small "
            "and medium enterprises in Vietnam without the overhead of overseas representative offices. "
            "Thanks to digital payment gateways and maturing logistics networks, handicrafts, ceramics, "
            "and sustainable apparel can be ordered directly from North America or Europe within days. "
            "However, export association representatives caution that competition on online marketplaces "
            "is intense, requiring firms to invest seriously in brand visuals, accurate bilingual "
            "product descriptions, and transparent customer service to protect long-term credibility."
        ),
        "Tuổi Trẻ Kinh doanh (Curated)",
    ),
    _build_curated_item(
        "curated_culture_01",
        "culture",
        "Lễ hội sách ngoài trời khơi dậy văn hóa đọc trong giới trẻ thành thị",
        "Outdoor Book Festival Sparks Reading Culture Among Urban Youth",
        (
            "Cuối tuần qua, đường sách và công viên trung tâm trở nên nhộn nhịp khi hàng chục nhà "
            "xuất bản phối hợp tổ chức lễ hội sách với chủ đề tri thức và sáng tạo. Bên cạnh các gian "
            "hàng giới thiệu tác phẩm văn học, sách kỹ năng và ấn phẩm song ngữ Việt-Anh, ban tổ chức "
            "còn mở khu vực trao đổi sách cũ miễn phí và nhiều buổi tọa đàm cùng dịch giả trẻ. Nhiều "
            "bạn trẻ cho biết việc trực tiếp lật từng trang giấy và lắng nghe câu chuyện hậu trường "
            "của người viết mang lại cảm hứng đọc sâu sắc hơn hẳn việc lướt tin ngắn trên mạng xã hội. "
            "Sự kiện góp phần duy trì thói quen đọc sách bền vững và kết nối cộng đồng yêu tri thức "
            "tại các thành phố lớn."
        ),
        (
            "Over the past weekend, the book street and central park bustled with activity as dozens of "
            "publishers jointly hosted a book festival themed around knowledge and creativity. Alongside "
            "booths showcasing literature, self-development titles, and bilingual Vietnamese-English "
            "editions, organizers set up a free used-book swap zone and panels with young translators. "
            "Many young visitors noted that flipping through physical pages and hearing behind-the-scenes "
            "stories from authors inspired far deeper reading than scrolling through short social media "
            "posts. The event helps sustain reading habits and connect knowledge-loving communities across "
            "major cities."
        ),
        "Tuổi Trẻ Văn hóa (Curated)",
    ),
    _build_curated_item(
        "curated_world_01",
        "world",
        "Nhiều quốc gia đẩy mạnh hợp tác nghiên cứu lưới điện thông minh liên vùng",
        "Nations Strengthen Cooperation on Cross-Regional Smart Power Grids",
        (
            "Tại hội nghị năng lượng quốc tế diễn ra tuần này, đại diện nhiều quốc gia khu vực "
            "châu Á - Thái Bình Dương đã thống nhất tăng cường chia sẻ công nghệ điều độ lưới điện "
            "thông minh nhằm tích hợp hiệu quả nguồn điện gió và điện mặt trời. Thách thức lớn nhất "
            "của năng lượng tái tạo là tính biến động theo thời tiết, đòi hỏi hệ thống lưu trữ pin "
            "quy mô lớn và phần mềm dự báo phụ tải chính xác. Thông qua cơ chế kết nối truyền tải "
            "liên vùng, các nước có thể điều tiết nguồn điện dư thừa vào giờ thấp điểm sang khu vực "
            "thiếu hụt, qua đó nâng cao an ninh năng lượng và giảm phụ thuộc vào nhiên liệu hóa thạch "
            "trong thập kỷ tới."
        ),
        (
            "At an international energy summit held this week, representatives from multiple "
            "Asia-Pacific nations agreed to deepen cooperation on smart-grid dispatch technologies to "
            "integrate wind and solar power effectively. The primary challenge of renewable energy lies "
            "in weather-driven variability, which requires large-scale battery storage and accurate "
            "load-forecasting software. Through cross-regional transmission interconnections, countries "
            "can route surplus off-peak electricity toward areas experiencing shortages, thereby "
            "strengthening energy security and reducing reliance on fossil fuels over the coming decade."
        ),
        "BBC Vietnamese (Curated)",
    ),
    # --- LONG (6 items: ~190-220 words each) ---
    _build_curated_item(
        "curated_health_02",
        "health",
        "Hồ sơ bệnh án điện tử giúp rút ngắn thời gian chờ đợi tại bệnh viện tuyến đầu",
        "Electronic Health Records Cut Waiting Times at Frontline Hospitals",
        (
            "Việc triển khai đồng bộ hồ sơ bệnh án điện tử đang tạo ra bước chuyển mình rõ rệt trong "
            "công tác khám chữa bệnh tại nhiều bệnh viện đa khoa lớn trên cả nước. Trước đây, người "
            "bệnh thường phải mang theo nhiều tập giấy xét nghiệm và phim chụp cồng kềnh mỗi khi "
            "chuyển viện hoặc tái khám, dẫn đến nguy cơ thất lạc thông tin y tế quan trọng. Với hệ "
            "thống lưu trữ số liên thông bảo mật, bác sĩ có thể tra cứu nhanh lịch sử dùng thuốc, "
            "kết quả chẩn đoán hình ảnh và tiền sử dị ứng của bệnh nhân chỉ trong vài giây ngay trên "
            "màn hình làm việc. Điều này không chỉ giảm thiểu tình trạng chỉ định trùng lặp các xét "
            "nghiệm tốn kém mà còn rút ngắn đáng kể thời gian chờ đợi ở khu vực tiếp đón. Song song "
            "với tiện ích kỹ thuật, các bệnh viện cũng chú trọng tập huấn quy trình bảo vệ dữ liệu "
            "cá nhân cho đội ngũ điều dưỡng và kỹ thuật viên, đảm bảo thông tin sức khỏe nhạy cảm "
            "luôn được mã hóa và truy cập đúng thẩm quyền. Đại diện ngành y tế đánh giá chuyển đổi số "
            "lấy người bệnh làm trung tâm sẽ tiếp tục mở rộng tới tuyến y tế cơ sở trong thời gian tới, "
            "giúp người dân vùng xa được tiếp cận dịch vụ tư vấn chuyên khoa kịp thời và minh bạch hơn."
        ),
        (
            "The synchronized rollout of electronic health records is driving a tangible transformation "
            "in patient care across major general hospitals nationwide. Previously, patients often had "
            "to carry bulky folders of lab sheets and imaging films whenever transferring hospitals or "
            "attending follow-up visits, risking the loss of critical medical history. With an "
            "interconnected, secure digital repository, physicians can retrieve medication histories, "
            "diagnostic scans, and allergy records within seconds directly on their workstations. This "
            "not only reduces redundant and costly laboratory tests but also substantially shortens "
            "waiting times at reception desks. Alongside technical upgrades, hospitals are prioritizing "
            "personal data protection training for nurses and technicians to ensure sensitive health "
            "information remains encrypted and accessible only to authorized staff. Health sector "
            "officials note that patient-centered digital transformation will continue expanding to "
            "grassroots clinics in the near future, enabling residents in remote areas to access timely "
            "and transparent specialist consultations."
        ),
        "VnExpress Sức khỏe (Curated)",
    ),
    _build_curated_item(
        "curated_culture_02",
        "culture",
        "Bảo tồn di sản kiến trúc đô thị gắn liền với phát triển du lịch bền vững",
        "Preserving Urban Architectural Heritage Alongside Sustainable Tourism",
        (
            "Trong bối cảnh tốc độ đô thị hóa diễn ra nhanh chóng, câu chuyện cân bằng giữa xây dựng "
            "hiện đại và bảo tồn những công trình kiến trúc trăm năm tuổi đang thu hút sự quan tâm "
            "lớn của giới chuyên môn và người dân. Tại nhiều khu phố cổ và trung tâm văn hóa lâu đời, "
            "chính quyền địa phương đã lựa chọn giải pháp trùng tu nguyên bản kết hợp chuyển đổi công "
            "năng bên trong thành bảo tàng tương tác, phòng trưng bày nghệ thuật và không gian sáng tạo "
            "cộng đồng. Thay vì đóng cửa giữ nguyên hiện trạng khô cứng, các ngôi nhà cổ được kể lại "
            "lịch sử hình thành thông qua thuyết minh đa ngôn ngữ, triển lãm ảnh tư liệu và trải nghiệm "
            "nghề thủ công truyền thống cho du khách. Nhiều hướng dẫn viên nhận xét du khách quốc tế "
            "ngày càng ưu tiên những hành trình chậm, tìm hiểu chiều sâu đời sống bản địa và tôn trọng "
            "quy tắc ứng xử tại di tích. Nguồn thu hợp lý từ vé tham quan và dịch vụ văn hóa được tái "
            "đầu tư trực tiếp cho công tác bảo trì mái ngói, khung gỗ và cảnh quan xung quanh, chứng "
            "minh rằng di sản hoàn toàn có thể tự nuôi sống mình một cách văn minh nếu được quy hoạch "
            "bài bản và có sự đồng hành của cộng đồng cư dân địa phương."
        ),
        (
            "Amid rapid urbanization, striking a balance between modern construction and preserving "
            "century-old architectural landmarks is drawing strong interest from specialists and "
            "residents alike. In several historic quarters and cultural hubs, local authorities have "
            "adopted authentic restoration paired with adaptive reuse, turning interior spaces into "
            "interactive museums, art galleries, and community creative venues. Rather than locking "
            "buildings away as static exhibits, heritage houses tell their stories through multilingual "
            "audio guides, archival photography shows, and hands-on traditional craft workshops for "
            "visitors. Tour guides observe that international travelers increasingly favor slow travel "
            "focused on understanding local life and respecting heritage etiquette. Fair revenue from "
            "admission tickets and cultural services is reinvested directly into maintaining tiled roofs, "
            "wooden beams, and surrounding streetscapes, proving that heritage can sustain itself "
            "responsibly when thoughtfully planned alongside local residents."
        ),
        "VnExpress Giải trí (Curated)",
    ),
    _build_curated_item(
        "curated_sports_02",
        "sports",
        "Khoa học thể thao giúp vận động viên trẻ tối ưu phục hồi và phòng ngừa chấn thương",
        "Sports Science Helps Young Athletes Optimize Recovery and Prevent Injuries",
        (
            "Những năm gần đây, khoa học thể thao hiện đại ngày càng giữ vai trò then chốt trong công "
            "tác huấn luyện tại các trung tâm đào tạo vận động viên trẻ quốc gia. Thay vì tập luyện "
            "theo cảm tính hoặc tăng khối lượng vận động đồng loạt cho cả đội, ban huấn luyện hiện "
            "nay sử dụng thiết bị đeo theo dõi nhịp tim, quãng đường bứt tốc và mức độ căng cơ của "
            "từng cá nhân sau mỗi buổi tập. Dữ liệu thu thập được giúp bác sĩ thể thao và chuyên gia "
            "dinh dưỡng xây dựng thực đơn bù điện giải, thời lượng ngủ phục hồi và bài tập giãn cơ "
            "chuyên biệt nhằm giảm thiểu nguy cơ chấn thương dây chằng hay quá tải khớp gối. Bên cạnh "
            "yếu tố thể chất, tâm lý thi đấu cũng được quan tâm đúng mức thông qua các buổi rèn luyện "
            "khả năng tập trung dưới áp lực khán đài và quản lý cảm xúc sau thất bại. Nhiều huấn luyện "
            "viên kỳ cựu chia sẻ rằng sự kết hợp giữa kỷ luật tập luyện truyền thống và phân tích dữ "
            "liệu y sinh học giúp vận động viên trẻ duy trì phong độ ổn định hơn khi bước ra các giải "
            "đấu châu lục, đồng thời kéo dài tuổi nghề đỉnh cao một cách bền vững."
        ),
        (
            "In recent years, modern sports science has played an increasingly decisive role in coaching "
            "at national youth athlete training centers. Rather than training by intuition or assigning "
            "uniform workloads across an entire squad, coaching staffs now use wearable sensors to track "
            "each athlete's heart rate, sprint distance, and muscle strain after every session. The "
            "collected data enables sports physicians and nutritionists to tailor electrolyte recovery "
            "plans, sleep schedules, and targeted stretching routines that reduce ligament injuries and "
            "knee joint overload. Alongside physical conditioning, competitive psychology receives proper "
            "attention through sessions on maintaining focus under stadium pressure and managing emotions "
            "after defeats. Veteran coaches note that combining traditional training discipline with "
            "biomedical data analysis helps young athletes maintain steadier form at continental "
            "tournaments while sustainably extending their peak competitive careers."
        ),
        "Tuổi Trẻ Thể thao (Curated)",
    ),
    _build_curated_item(
        "curated_world_02",
        "world",
        "Xu hướng làm việc linh hoạt thúc đẩy các thành phố tái thiết kế không gian công cộng",
        "Flexible Work Trends Prompt Cities to Redesign Public Spaces",
        (
            "Sự phổ biến của mô hình làm việc kết hợp giữa văn phòng và từ xa đang làm thay đổi sâu "
            "sắc nhịp sống tại nhiều đô thị lớn ở châu Âu và châu Á. Khi không còn bị ràng buộc hoàn "
            "toàn vào những tòa nhà cao ốc ở khu trung tâm từ chín giờ sáng đến năm giờ chiều, người "
            "lao động có xu hướng tìm đến thư viện khu phố, công viên xanh và không gian làm việc chung "
            "gần nơi sinh sống. Nắm bắt sự dịch chuyển này, chính quyền nhiều thành phố đã cải tạo "
            "các trục đường cũ thành phố đi bộ rợp bóng cây, bổ sung bàn ghế công cộng có mái che, "
            "điểm truy cập mạng không dây ổn định và làn đường riêng an toàn cho xe đạp. Các chuyên "
            "gia xã hội học nhận định mô hình đô thị đa trung tâm giúp giảm áp lực giao thông giờ cao "
            "điểm, đồng thời kích thích kinh tế dịch vụ tại các khu dân cư vệ tinh phát triển đồng "
            "đều hơn. Tuy vậy, bài toán đặt ra cho nhà quản lý là phải bảo đảm mức chi phí thuê nhà "
            "hợp lý và duy trì sự gắn kết cộng đồng để mọi nhóm cư dân đều được hưởng lợi công bằng "
            "từ hạ tầng đô thị mới."
        ),
        (
            "The widespread adoption of hybrid office and remote work is reshaping daily rhythms across "
            "major cities in Europe and Asia. No longer strictly tied to downtown high-rise offices from "
            "nine to five, workers increasingly gravitate toward neighborhood libraries, green parks, "
            "and coworking hubs near their homes. Responding to this shift, municipal governments have "
            "redesigned older streets into shaded pedestrian corridors equipped with sheltered public "
            "seating, reliable wireless hotspots, and dedicated bike lanes. Sociologists observe that "
            "this polycentric urban model eases peak-hour traffic congestion while stimulating balanced "
            "service-sector growth in outer residential districts. Nevertheless, city planners still "
            "face the challenge of keeping housing affordable and preserving community cohesion so that "
            "all resident groups benefit fairly from upgraded urban infrastructure."
        ),
        "VnExpress Thế giới (Curated)",
    ),
    _build_curated_item(
        "curated_gen_01",
        "general",
        "Chuyển đổi số dịch vụ công giúp người dân hoàn tất thủ tục trực tuyến thuận tiện",
        "Digital Public Services Enable Citizens to Complete Procedures Online",
        (
            "Trong những năm gần đây, cổng dịch vụ công trực tuyến tại nhiều tỉnh thành đã nâng cấp "
            "giao diện thân thiện và kết nối dữ liệu dân cư nhằm giảm bớt giấy tờ hành chính cho người "
            "dân và doanh nghiệp. Thay vì phải xếp hàng từ sáng sớm để nộp hồ sơ bản cứng và chờ đóng "
            "dấu xác nhận qua nhiều cấp, công dân có thể đăng nhập bằng định danh điện tử, tải lên "
            "tài liệu cần thiết và theo dõi tiến độ xử lý theo thời gian thực ngay trên điện thoại "
            "thông minh. Đối với người cao tuổi hoặc người ít tiếp xúc với công nghệ, các trung tâm "
            "hành chính công vẫn bố trí tình nguyện viên và cán bộ hướng dẫn trực tiếp tại quầy hỗ "
            "trợ số để bảo đảm không ai bị bỏ lại phía sau. Thống kê cho thấy thời gian giải quyết "
            "hồ sơ đất đai, đăng ký kinh doanh và cấp đổi giấy tờ tùy thân đã rút ngắn đáng kể, đồng "
            "thời hạn chế phát sinh chi phí đi lại không cần thiết. Đây được xem là nền tảng quan "
            "trọng hướng tới chính quyền minh bạch, hiệu quả và phục vụ người dân tốt hơn trong kỷ "
            "nguyên số."
        ),
        (
            "In recent years, online public service portals across numerous provinces have upgraded "
            "their user interfaces and connected population databases to cut administrative paperwork "
            "for citizens and businesses. Instead of queuing early in the morning to submit paper "
            "dossiers across multiple desks, residents can log in via digital identity, upload required "
            "documents, and track processing progress in real time on a smartphone. For elderly citizens "
            "or those less familiar with technology, public administration centers continue to station "
            "volunteers and staff at digital assistance counters so no one is left behind. Statistics "
            "indicate that processing times for land records, business registrations, and identity "
            "renewals have shortened significantly while eliminating unnecessary travel expenses. This "
            "progress represents an important foundation toward a transparent, efficient, and "
            "citizen-focused government in the digital era."
        ),
        "VTV Thời Sự (Curated)",
    ),
    _build_curated_item(
        "curated_gen_02",
        "general",
        "Mạng lưới tình nguyện viên trẻ lan tỏa thói quen phân loại rác tại khu dân cư",
        "Young Volunteers Spread Household Waste Sorting Habits Across Neighborhoods",
        (
            "Vào mỗi sáng thứ bảy, nhóm tình nguyện viên trẻ tại các khu dân cư lại tổ chức điểm "
            "thu gom rác tái chế và hướng dẫn hộ gia đình cách phân loại rác hữu cơ ngay tại bếp. "
            "Ban đầu, nhiều người dân còn e ngại vì cho rằng việc tách riêng chai nhựa, giấy bìa và "
            "thức ăn thừa tốn thêm thời gian sinh hoạt hằng ngày. Tuy nhiên, sau khi được giải thích "
            "rõ về hành trình tái chế và nhìn thấy khu phố trở nên sạch sẽ, gọn gàng hơn, số lượng "
            "hộ gia đình tham gia đều đặn đã tăng gấp đôi chỉ trong ba tháng. Các điểm đổi rác tái "
            "chế lấy cây xanh hoặc túi vải dùng nhiều lần cũng tạo thêm niềm vui nhỏ cho trẻ em và "
            "người cao tuổi trong khu vực. Đại diện tổ dân phố cho biết điều quan trọng nhất không "
            "nằm ở những khẩu hiệu lớn lao mà ở sự kiên trì đồng hành của cộng đồng, biến hành động "
            "bảo vệ môi trường thành nếp sống tự nhiên mỗi ngày. Mô hình giản dị nhưng thiết thực này "
            "đang được nhân rộng sang nhiều trường học và khu chung cư mới, góp phần xây dựng đô thị "
            "xanh văn minh hơn."
        ),
        (
            "Every Saturday morning, groups of young volunteers in residential neighborhoods organize "
            "recyclable collection points and teach households how to separate organic waste right in "
            "their kitchens. At first, many residents hesitated, assuming that separating plastic bottles, "
            "cardboard, and food scraps would add hassle to daily routines. However, after learning how "
            "recycling works and seeing their streets become noticeably cleaner and tidier, the number "
            "of regularly participating households doubled within just three months. Booths exchanging "
            "recyclables for potted plants or reusable cloth bags also brought simple joy to children "
            "and seniors in the neighborhood. Community leaders noted that lasting success comes not "
            "from grand slogans but from patient community engagement that turns environmental care into "
            "a natural daily habit. This straightforward yet practical model is now expanding to local "
            "schools and new apartment complexes toward greener, cleaner cities."
        ),
        "Thanh Niên (Curated)",
    ),
]


def _select_curated_items(canonical_topic: str, custom_keyword: str, limit: int) -> List[Dict[str, object]]:
    if custom_keyword:
        matched = [
            item
            for item in CURATED_NEWS_ITEMS
            if custom_keyword
            in _normalize_text(
                f"{item['_topic']} {item['title']} {item['titleEn']} {item['textVi']} {item['referenceEn']}"
            )
        ]
        chosen = matched if matched else CURATED_NEWS_ITEMS
        return [_to_public_item(item) for item in chosen[:limit]]

    if canonical_topic != "general":
        matched = [item for item in CURATED_NEWS_ITEMS if item["_topic"] == canonical_topic]
        if matched:
            return [_to_public_item(item) for item in matched[:limit]]

    return [_to_public_item(item) for item in CURATED_NEWS_ITEMS[:limit]]


@router.get("/feed")
def get_news_feed(
    topic: Optional[str] = None,
    limit: int = Query(10),
):
    limit = max(1, min(20, int(limit)))
    req_start = time.monotonic()
    rss_deadline = req_start + _RSS_TOTAL_BUDGET_SEC
    overall_deadline = req_start + _OVERALL_BUDGET_SEC

    canonical_topic, custom_keyword = _resolve_topic(topic)
    feeds = _TOPIC_FEEDS.get(canonical_topic, _TOPIC_FEEDS["general"])

    raw_candidates: List[Dict[str, object]] = []
    seen_ids = set()
    seen_titles = set()
    seen_texts = set()

    for idx, (source_label, feed_url) in enumerate(feeds):
        remaining = rss_deadline - time.monotonic()
        if remaining <= (0.1 if idx == 0 else 2.0) or len(raw_candidates) >= limit:
            break
        call_timeout = min(_RSS_SOCKET_TIMEOUT, max(0.5, remaining))
        try:
            raw_bytes = _fetch_feed_bytes(feed_url, timeout=call_timeout)
        except Exception:
            continue

        entries = _parse_feed_xml(raw_bytes, source_label)
        for entry in entries:
            title = entry["title"]
            body = entry["body"]
            link = entry["link"]
            text_vi = _combine_title_and_body(title, body)
            words = text_vi.split()
            word_count_vi = len(words)
            if word_count_vi < _MIN_VI_WORDS:
                continue

            norm_title = _normalize_text(title)
            norm_text = _normalize_text(text_vi)
            if custom_keyword and custom_keyword not in _normalize_text(f"{title} {text_vi}"):
                continue

            basis = link or norm_title or _normalize_text(text_vi[:120])
            item_id = f"rss_{hashlib.sha1(basis.encode('utf-8')).hexdigest()[:12]}"

            if item_id in seen_ids or (norm_title and norm_title in seen_titles) or norm_text in seen_texts:
                continue

            seen_ids.add(item_id)
            if norm_title:
                seen_titles.add(norm_title)
            seen_texts.add(norm_text)

            env_score = 0
            if canonical_topic == "environment":
                env_score = sum(1 for kw in _ENV_KEYWORDS if kw in norm_text)

            raw_candidates.append(
                {
                    "id": item_id,
                    "title": title or text_vi[:80],
                    "textVi": text_vi,
                    "sourceLabel": entry["sourceLabel"],
                    "lengthTier": _compute_length_tier(word_count_vi),
                    "wordCountVi": word_count_vi,
                    "_envScore": env_score,
                }
            )
            if len(raw_candidates) >= limit and canonical_topic != "environment":
                break

    if not raw_candidates:
        return {
            "status": "ok",
            "source": "curated",
            "items": _select_curated_items(canonical_topic, custom_keyword, limit),
        }

    if canonical_topic == "environment":
        raw_candidates.sort(key=lambda x: x["_envScore"], reverse=True)

    selected = raw_candidates[:limit]
    gtx_enabled = True
    gtx_attempts = 0
    items: List[Dict[str, object]] = []

    for entry in selected:
        title = str(entry["title"])
        text_vi = str(entry["textVi"])
        source_label = str(entry["sourceLabel"])
        word_count_vi = int(entry["wordCountVi"])

        title_en = ""
        reference_en = ""

        remaining_overall = overall_deadline - time.monotonic()
        if gtx_enabled and gtx_attempts < _GTX_MAX_ITEMS and remaining_overall >= 3.0:
            gtx_attempts += 1
            gtx_timeout = min(_GTX_TIMEOUT_SEC, remaining_overall / 2.0)
            translated = _try_gtx_translate_vi_to_en(title, text_vi, timeout=gtx_timeout)
            if translated is not None:
                title_en, reference_en = translated
            else:
                gtx_enabled = False

        if not title_en or not reference_en:
            title_en, reference_en = _build_fallback_en(
                title=title,
                text_vi=text_vi,
                source_label=source_label,
                canonical_topic=canonical_topic,
                word_count_vi=word_count_vi,
            )

        items.append(
            {
                "id": entry["id"],
                "title": title,
                "titleEn": title_en,
                "textVi": text_vi,
                "referenceEn": reference_en,
                "sourceLabel": source_label,
                "lengthTier": entry["lengthTier"],
                "wordCountVi": word_count_vi,
            }
        )

    return {
        "status": "ok",
        "source": "rss",
        "items": items,
    }
