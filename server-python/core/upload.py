import cloudinary
import cloudinary.uploader
from core.config import get_settings
from fastapi import UploadFile

settings = get_settings()

if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET
    )

async def upload_image(file: UploadFile) -> str:
    content = await file.read()
    result = cloudinary.uploader.upload(content, folder="1nonly-store")
    return result.get("secure_url")
