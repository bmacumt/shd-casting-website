import asyncio
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import aiosmtplib

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


async def send_email(to: str, subject: str, body: str) -> bool:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        return False

    msg = MIMEMultipart()
    msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USER}>"
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=True,
        )
        return True
    except Exception as e:
        logger.warning("Failed to send email: %s", e)
        return False


def _try_fire_and_forget(coro):
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(coro)
    except RuntimeError:
        try:
            import threading
            def _run():
                asyncio.run(coro)
            threading.Thread(target=_run, daemon=True).start()
        except Exception:
            pass


def notify_sales_email(inquiry_data: dict):
    subject = f"[新询价] {inquiry_data['name']} - {inquiry_data.get('product_category', '未指定')} - {inquiry_data['created_at']}"
    body = f"""姓名：{inquiry_data['name']}
公司：{inquiry_data.get('company', '未填写')}
邮箱：{inquiry_data['email']}
电话：{inquiry_data.get('phone', '未填写')}
产品：{inquiry_data.get('product_category', '未指定')}
数量：{inquiry_data.get('quantity', '未填写')}
需求：{inquiry_data['message']}"""
    _try_fire_and_forget(send_email(settings.SMTP_USER, subject, body))


def confirm_customer_email(customer_email: str, inquiry_id: str):
    subject = f"询价确认 - {inquiry_id}"
    body = f"""感谢您的询价！我们已收到您的询价（编号：{inquiry_id}），销售团队将在1个工作日内与您联系。"""
    _try_fire_and_forget(send_email(customer_email, subject, body))
