# 🎮 Cronus Zen Discord Support Bot

A 24/7 AI-powered Discord bot that helps users with Cronus Zen setup, scripts, and troubleshooting — powered by OpenAI GPT-4o mini.

---

## ✅ Features
- 🤖 Auto-answers questions in your support channel using AI
- 🎫 Private ticket system for 1-on-1 support
- 🔍 Script & value lookup with `/lookup`
- 📋 Admin panel to manage the FAQ knowledge base via slash commands
- 💬 Conversation memory per user (last 10 messages)
- ⚡ Cooldown system to prevent spam

---

## 🛠️ Setup Guide

### Step 1 — Create Your Discord Bot
1. Go to https://discord.com/developers/applications
2. Click **New Application** → name it (e.g. "Cronus Zen Support")
3. Go to **Bot** tab → click **Add Bot**
4. Under **Privileged Gateway Intents**, enable:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. Copy your **Bot Token** (keep it secret!)
6. Go to **OAuth2 > URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Send Messages`, `Manage Channels`, `Read Message History`, `Embed Links`, `View Channels`
7. Copy the generated URL and invite the bot to your server

### Step 2 — Get Your OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new key and copy it
3. Set a monthly spending limit at https://platform.openai.com/account/limits (recommend $10)

### Step 3 — Get Discord IDs
Right-click in Discord (with Developer Mode on in Settings > Advanced):
- Your **Server ID** (right-click server icon)
- Your **Support Channel ID** (right-click the channel)
- Your **Ticket Category ID** (right-click the category)
- Your **Admin Role ID** (right-click the role in role settings)
- Your **Staff Role ID** (right-click the role)

### Step 4 — Configure the Bot
1. Rename `.env.example` to `.env`
2. Fill in all values:
```
DISCORD_TOKEN=your_bot_token
OPENAI_API_KEY=your_openai_key
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
SUPPORT_CHANNEL_ID=your_support_channel_id
TICKET_CATEGORY_ID=your_ticket_category_id
ADMIN_ROLE_ID=your_admin_role_id
STAFF_ROLE_ID=your_staff_role_id
```

### Step 5 — Deploy to Railway (24/7 Hosting)
1. Push this project to a GitHub repository
2. Go to https://railway.app and sign up (free)
3. Click **New Project** → **Deploy from GitHub Repo**
4. Select your repo
5. Go to **Variables** tab and add all your `.env` values there
6. Railway will automatically start your bot!

### Step 6 — Register Slash Commands
After deployment, run once locally:
```bash
npm install
node deploy-commands.js
```
Or run it in the Railway console. Commands will appear in Discord within seconds.

---

## 📋 Available Commands

### User Commands
| Command | Description |
|---|---|
| `/ticket` | Open a private support ticket |
| `/close` | Close the current ticket |
| `/lookup [query]` | Search scripts and values |

### Admin Commands (requires Admin Role)
| Command | Description |
|---|---|
| `/addfaq [question] [answer]` | Add a new FAQ entry |
| `/editfaq [id] [question] [answer]` | Edit an existing FAQ entry |
| `/removefaq [id]` | Delete an FAQ entry |
| `/listfaq` | View all FAQ entries with IDs |

---

## 📁 Adding Custom Scripts
Edit `data/scripts.json` to add your own scripts:
```json
{
  "name": "Your Script Name",
  "description": "What it does",
  "values": "KEY = VALUE, KEY2 = VALUE2",
  "tags": ["keyword1", "keyword2"]
}
```

---

## 💰 Estimated Monthly Cost
- Railway hosting: ~$5/mo
- OpenAI API (GPT-4o mini): ~$2–10/mo depending on traffic
- **Total: ~$7–15/mo**
