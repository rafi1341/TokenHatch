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
WEB_APP_URL = "https://tokenhatch.netlify.app/"
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
    database=MYSQL_DATABASE,
    ssl_ca=MYSQL_SSL_CA
)

def init_db():
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id BIGINT PRIMARY KEY,
            token BIGINT DEFAULT 0
        )
    """)
    conn.commit()

# ==========================
# FLUSH IN-MEMORY TOKENS
# ==========================
def flush_tokens():
    while True:
        time.sleep(5)  # flush every 5 seconds
        if not token_cache:
            continue

        cursor = conn.cursor()
        for user_id, amount in token_cache.items():
            cursor.execute(
                "INSERT INTO users (user_id, token) VALUES (%s, %s) "
                "ON DUPLICATE KEY UPDATE token = token + %s",
                (user_id, amount, amount)
            )
        conn.commit()
        token_cache.clear()

# ==========================
# TELEGRAM BOT
# ==========================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    # Ensure user exists in DB
    cursor = conn.cursor()
    cursor.execute("INSERT IGNORE INTO users (user_id) VALUES (%s)", (user_id,))
    conn.commit()

    # Send banner + WebApp button
    keyboard = [[InlineKeyboardButton("Launch App", web_app=WebAppInfo(url=WEB_APP_URL))]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    if os.path.exists(BANNER_PATH):
        await context.bot.send_photo(
            chat_id=user_id,
            photo=open(BANNER_PATH, "rb"),
            caption="Welcome to TokenHatch! 🥚\nHatch creatures, earn $EGG tokens, and participate in airdrops!",
            reply_markup=reply_markup
        )
    else:
        await context.bot.send_message(
            chat_id=user_id,
            text="Welcome to TokenHatch! 🥚\nHatch creatures, earn $EGG tokens, and participate in airdrops!",
            reply_markup=reply_markup
        )

async def balance(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    # Combine DB + in-memory tokens for near real-time
    cursor = conn.cursor()
    cursor.execute("SELECT token FROM users WHERE user_id = %s", (user_id,))
    row = cursor.fetchone()
    db_tokens = row[0] if row else 0
    memory_tokens = token_cache.get(user_id, 0)
    total = db_tokens + memory_tokens
    await update.message.reply_text(f"You have {total} $EGG tokens!")

# ==========================
# FASTAPI APP
# ==========================
api = FastAPI()
api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your mini-app URL in production
    allow_methods=["*"],
    allow_headers=["*"]
)

@api.post("/tap/{user_id}")
def tap(user_id: int, amount: int = 1):
    token_cache[user_id] = token_cache.get(user_id, 0) + amount
    return {"user_id": user_id, "cached_tokens": token_cache[user_id]}

@api.get("/token/{user_id}")
def get_token_api(user_id: int):
    cursor = conn.cursor()
    cursor.execute("SELECT token FROM users WHERE user_id = %s", (user_id,))
    row = cursor.fetchone()
    db_tokens = row[0] if row else 0
    memory_tokens = token_cache.get(user_id, 0)
    total = db_tokens + memory_tokens
    return {"user_id": user_id, "token": total}

# ==========================
# RUN TELEGRAM BOT
# ==========================
def run_bot():
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("balance", balance))
    print("Telegram Bot running...")
    app.run_polling()

# ==========================
# MAIN
# ==========================
if __name__ == "__main__":
    init_db()
    threading.Thread(target=flush_tokens, daemon=True).start()  # start flush thread
    threading.Thread(target=run_bot, daemon=True).start()       # start Telegram bot
    import uvicorn
    uvicorn.run(api, host="0.0.0.0", port=8000)
