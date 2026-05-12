#!/bin/bash
source venv/Scripts/activate
python create_db.py
python -m uvicorn main:app --reload
