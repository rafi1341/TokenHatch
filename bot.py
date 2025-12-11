from flask import Flask
from threading import Thread
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import os

BOT_TOKEN = os.environ.get("BOT_TOKEN")
WEB_APP_URL = "https://tokenhatch.onrender.com/?v=2"

app = Flask(__name__)

@app.route("/")
def index():
    return "TokenHatch Bot + App running"

# Telegram bot
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    keyboard = [
        [InlineKeyboardButton("Launch App💵", web_app=WebAppInfo(url=WEB_APP_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await context.bot.send_photo(
        chat_id=chat_id,
        photo=open("assets/banner.png", "rb"),
        caption="Welcome to TokenHatch! 🥚 Hatch creatures, get $EGG crypto points, and earn airdrops!",
        reply_markup=reply_markup
    )

def run_bot():
    app_bot = ApplicationBuilder().token(BOT_TOKEN).build()
    app_bot.add_handler(CommandHandler("start", start))
    app_bot.run_polling()

# Run bot in background
Thread(target=run_bot).start()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
