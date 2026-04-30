import json
import logging
from openai import OpenAI

from app.config import get_settings

logger = logging.getLogger(__name__)

TEXT_KEYS = [
    "company_intro", "hero_tag", "hero_title", "hero_subtitle",
    "stat_years_label", "stat_clients_label", "stat_countries_label", "stat_cert_label",
    "navbar_tag",
]

JSON_KEYS = ["advantages", "milestones", "certifications", "team", "faqs"]

LANGUAGES = {"en": "English", "es": "Spanish", "ru": "Russian"}


def _build_translation_prompt(config: dict) -> str:
    texts = {k: config.get(k, "") for k in TEXT_KEYS if config.get(k)}
    jsons = {}
    for k in JSON_KEYS:
        raw = config.get(k, "")
        if raw:
            try:
                jsons[k] = json.loads(raw)
            except (json.JSONDecodeError, TypeError):
                pass

    return f"""You are a professional translator for a Chinese industrial casting company website (SHD Casting).
Translate the following content from Chinese to English, Spanish, and Russian.

IMPORTANT RULES:
- Keep technical terms accurate: casting=铸造, ductile iron=球墨铸铁, gray iron=灰铸铁, foundry=铸造厂
- For JSON arrays, keep non-text fields (year, name, icon) unchanged, only translate text fields (title, desc, q, a, exp)
- Keep the output as a single valid JSON object with this exact structure:
{{
  "en": {{"key": "translated value", ...}},
  "es": {{"key": "translated value", ...}},
  "ru": {{"key": "translated value", ...}}
}}

--- TEXT CONTENT TO TRANSLATE ---
{json.dumps(texts, ensure_ascii=False, indent=2)}

--- JSON ARRAY CONTENT TO TRANSLATE (translate text fields only, keep structure) ---
{json.dumps(jsons, ensure_ascii=False, indent=2)}

Return ONLY the JSON object, no markdown fences, no explanation."""


def translate_site_config(config: dict) -> dict[str, str]:
    api_key = get_settings().DEEPSEEK_API_KEY
    if not api_key:
        logger.warning("DEEPSEEK_API_KEY not set, skipping auto-translation")
        return {}

    client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a professional translator. Return only valid JSON."},
                {"role": "user", "content": _build_translation_prompt(config)},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
    except Exception as e:
        logger.error(f"DeepSeek API call failed: {e}")
        return {}

    content = response.choices[0].message.content
    if not content:
        logger.error("DeepSeek returned empty content")
        return {}

    try:
        translations = json.loads(content)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse DeepSeek response: {e}")
        return {}

    result: dict[str, str] = {}
    for lang_code in LANGUAGES:
        lang_data = translations.get(lang_code, {})
        if not isinstance(lang_data, dict):
            continue

        for key in TEXT_KEYS:
            val = lang_data.get(key)
            if isinstance(val, str) and val.strip():
                result[f"{key}_{lang_code}"] = val

        for key in JSON_KEYS:
            val = lang_data.get(key)
            if isinstance(val, (list, dict)):
                result[f"{key}_{lang_code}"] = json.dumps(val, ensure_ascii=False)

    logger.info(f"Auto-translated {len(result)} keys")
    return result


def translate_product(name: str, description: str = "") -> dict[str, str]:
    api_key = get_settings().DEEPSEEK_API_KEY
    if not api_key:
        logger.warning("DEEPSEEK_API_KEY not set, skipping product translation")
        return {}

    client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

    content_parts = {"name": name}
    if description:
        content_parts["description"] = description

    prompt = f"""Translate the following Chinese product info for a casting company website to English, Spanish, and Russian.
Return a JSON object with this structure:
{{"en": {{"name": "...", "description": "..."}}, "es": {{"name": "...", "description": "..."}}, "ru": {{"name": "...", "description": "..."}}}}

--- PRODUCT INFO ---
{json.dumps(content_parts, ensure_ascii=False, indent=2)}

Return ONLY the JSON object."""

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a professional translator. Return only valid JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
    except Exception as e:
        logger.error(f"Product translation API call failed: {e}")
        return {}

    raw = response.choices[0].message.content
    if not raw:
        return {}

    try:
        translations = json.loads(raw)
    except json.JSONDecodeError:
        return {}

    result: dict[str, str] = {}
    for lang_code in LANGUAGES:
        lang_data = translations.get(lang_code, {})
        if not isinstance(lang_data, dict):
            continue
        for field in ("name", "description"):
            val = lang_data.get(field)
            if isinstance(val, str) and val.strip():
                result[f"{field}_{lang_code}"] = val

    logger.info(f"Auto-translated product '{name}': {len(result)} fields")
    return result
