@echo off
call venv\Scripts\activate.bat
python create_db.py
python -m uvicorn main:app --reload
