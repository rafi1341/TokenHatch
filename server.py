import os
import sqlite3
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# ==========================
# CONFIG
# ==========================
BOT_TOKEN = os.getenv("BOT_TOKEN")   # <-- loads it safely
WEB_APP_URL = "https://tokenhatch.netlify.app/"
DB_PATH = "database.db"

if not BOT_TOKEN:
    raise Exception("ERROR: BOT_TOKEN environment variable is missing!")

# ==========================
# DATABASE FUNCTIONS
# ==========================
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY,
            token INTEGER DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()

def add_user(user_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("INSERT OR IGNORE INTO users (user_id) VALUES (?)", (user_id,))

    conn.commit()
    conn.close()

def get_user_token(user_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("SELECT token FROM users WHERE user_id = ?", (user_id,))
    row = c.fetchone()

    conn.close()
    return row[0] if row else 0

def add_token(user_id, amount):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("UPDATE users SET token = token + ? WHERE user_id = ?", (amount, user_id))

    conn.commit()
    conn.close()

# ==========================
# TELEGRAM BOT
# ==========================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    # Add user to DB
    add_user(user_id)

    # Button to launch your mini-app
    keyboard = [
        [InlineKeyboardButton("Launch App", web_app=WebAppInfo(url=WEB_APP_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await context.bot.send_photo(
        chat_id=user_id,
        photo=open("banner.png", "rb"),
        caption="Welcome to TokenHatch! 🥚\nHatch creatures, earn $EGG tokens, and participate in airdrops!",
        reply_markup=reply_markup
    )

# ==========================
# MAIN
# ==========================
if __name__ == "__main__":
    init_db()

    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))

    print("Bot running...")
    app.run_polling()
