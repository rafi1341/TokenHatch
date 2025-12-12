import os
import threading
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import mysql.connector

# ==========================
# CONFIG
# ==========================
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEB_APP_URL = "https://tokenhatch.onrender.com/"
ASSETS_FOLDER = os.path.join(os.path.dirname(__file__), "assets")
BANNER_PATH = os.path.join(ASSETS_FOLDER, "banner.png")

# PlanetScale MySQL credentials
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")
MYSQL_SSL_CA = os.getenv("MYSQL_SSL_CA")  # path to SSL cert

if not BOT_TOKEN:
    raise Exception("BOT_TOKEN environment variable missing!")

# ==========================
# IN-MEMORY TOKEN CACHE
# ==========================
token_cache = {}

# ==========================
# PLANETSCALE CONNECTION
# ==========================
conn = mysql.connector.connect(
    host=MYSQL_HOST,
    user=MYSQL_USER,
    password=MYSQL_PASSWORD,
    dat
