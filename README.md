# 🤖 Arman Pixel Extractor Telegram Bot Backend

A modular, scalable, and production-ready Telegram Bot backend built with **Node.js, Express, TypeScript, Mongoose (MongoDB), and Telegraf (v4)**. Supports **Local Polling** for development and **Vercel Serverless Webhooks** for 24/7 cloud hosting.

---

## 📖 বাংলায় সম্পূর্ণ বিবরণ ও প্রজেক্ট গাইড (Project Documentation in Bengali)

এই প্রজেক্টটি একটি সম্পূর্ণ টেলিগ্রাম বট ব্যাকএন্ড আর্কিটেকচার। প্রজেক্টটিতে কীভাবে প্রতিটি ফিচার ডিজাইন ও ইমপ্লিমেন্ট করা হয়েছে তা নিচে বিস্তারিতভাবে ব্যাখ্যা করা হলো যেন আপনি শিখতে ও বুঝতে পারেন।

---

## 🌟 প্রধান ফিচারসমূহ (Key Features)

### 1. 👤 ইউজার প্রোফাইল ও ব্যালেন্স সিস্টেম (User Profile & Balance)
- প্রতি ইউজারের **Telegram ID**, নাম, ইউজারনেম ডাটাবেসে সেভ থাকে।
- **Main Balance (পয়েন্ট)** এবং **Referral Balance** ট্র্যাকিং।
- রেজিস্টার করার সাথে সাথে ফ্রি বোনাস পয়েন্ট প্রদানের সুবিধা।

### 2. 👥 রেফারেল প্রোগ্রাম (Referral Program)
- প্রতি ইউজারের ডায়নামিক লিংক: `https://t.me/my_pixel_extractor_bot?start=ref_<TELEGRAM_ID>`
- লিংকের মাধ্যমে নতুন কোনো ইউজার বটে ঢুকলে রেফারার পাবে ফ্রি পয়েন্ট বোনাস (`+0.50 Points`) এবং ইউজার রেফারেল গণনায় যুক্ত হবে (`eligibleReferrals`)।

### 3. 🔒 বাধ্যতামূলক গ্রুপ ও চ্যানেল সাবস্ক্রিপশন (Mandatory Subscription / Force Join)
- ইউজারদের বটে কাজ শুরু করার আগে **[CHAT] Telegram Group** (`@arman_pixel_chat`) এবং **[APP] Telegram Channel** (`@arman_pixel_app`)-এ জয়েন হতে হয়।
- জয়েন না থাকলে ইনলাইন বাটনে লিংকসহ জয়েন করতে বলা হয় এবং **`🔄 Verify Join`** বাটনে চাপ দিলে রিয়েল-টাইমে টেলিগ্রাম এপিআই দিয়ে মেম্বারশিপ চেক করে বট আনলক করা হয়।

### 4. 📢 স্বয়ংক্রিয় গ্রুপ নোটিফিকেশন (Group Order Broadcast)
- ইউজার কোনো টাস্ক বা লিংক এক্সট্র্যাকশন সার্ভিস অর্ডার করার পর ব্যাকএন্ডে কাজ সম্পন্ন (`completed`) হওয়ার সাথে সাথে **`[CHAT] Arman Pixel Extractor`** গ্রুপে অটোমেটিক সুন্দর ফরমেটেড মেসেজ পোস্ট হয়:
  ```text
  🎉 Order Successfully Processed!
  🆔 Task ID: #TASK-172225324
  👤 User: @arman
  📦 Service: 🌟 Extract Offer Link 18M
  💰 Cost: 1 Credit
  ✅ Status: Completed
  ```

### 5. 📣 এডমিন চ্যানেল ব্রডকাস্ট (Channel Announcement API)
- এডমিন বা যেকোনো এক্সটার্নাল সিস্টেম থেকে REST API (`POST /api/v1/bot/broadcast`) এর মাধ্যমে সরাসরি **`[APP] Arman Pixel Extractor`** চ্যানেলে অফিশিয়াল অ্যানাউন্সমেন্ট/নোটিশ পোস্ট করা যায়।

### 6. ⚡ Vercel Serverless Webhook সাপোর্টিং আর্কিটেকচার
- **Local Dev:** `npm run dev` দিলে লোকালি **Long Polling (`bot.launch()`)** মোডে চলে।
- **Vercel Production:** Serverless ফাংশনের জন্য **Telegram Webhook (`POST /api/v1/bot/webhook`)** মোডে চলে, যা পিসি বন্ধ থাকলেও ২৪ ঘণ্টা ১০০% বিনামূল্যে অ্যাক্টিভ থাকে।

---

## 📂 প্রজেক্ট ফাইল স্ট্রাকচার (Project Directory Structure)

```text
bot/
├── .env                  # Environment secrets (Local)
├── .env.example          # Environment variables template
├── package.json          # Project dependencies & scripts
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel serverless deployment routing
└── src/
    ├── app.ts            # Express App initialization & global middlewares
    ├── server.ts         # HTTP Server bootstrap & Vercel entrypoint
    ├── app/
    │   ├── config/       # Environment variables loader
    │   ├── db.ts         # Cached MongoDB connection for Serverless & Local
    │   ├── constants.ts  # Keyboard buttons & role enums
    │   ├── helpers/      # JWT helpers
    │   ├── middlewares/  # Express global error & 404 middlewares
    │   ├── routes/       # Centralized API routes router
    │   ├── templates/    # Formatted Telegram markdown messages
    │   └── modules/
    │       ├── bot/      # Telegraf Bot Service, Controller & Routes
    │       ├── task/     # Task Model, Service & Controllers
    │       └── user/     # User Model, Service & Controllers
```

---

## 🧠 কীভাবে এটি কোড করা হয়েছে (Technical Deep-Dive)

### 1. MongoDB Duplicate Key (E11000) Race Condition হ্যান্ডলিং
[user.service.ts](file:///home/arman/Arman/bot/src/app/modules/user/user.service.ts)
টেলিগ্রাম থেকে একই ইউজার দ্রুত পরপর একাধিকবার `/start` প্রেস করলে সমান্তরাল প্রসেসের কারণে `User.create()` Duplicate Key Error দিত। এটি সমাধান করা হয়েছে Try-Catch ব্লকে `code === 11000` ক্যাচ করে বিদ্যমান ইউজারকে নিরাপদে ফেচ করার মাধ্যমে।

### 2. Telegraf Force Join মেম্বারশিপ চেকিং
[bot.service.ts](file:///home/arman/Arman/bot/src/app/modules/bot/bot.service.ts)
```typescript
const isMemberOfChat = async (bot: Telegraf, chatId: string, userId: number): Promise<boolean> => {
  if (!chatId) return true;
  try {
    const member = await bot.telegram.getChatMember(chatId, userId);
    return ['creator', 'administrator', 'member'].includes(member.status);
  } catch (error) {
    return false;
  }
};
```
প্রতিটি কমান্ড ও বাটনের আগে `ensureSubscription()` কল করে ইউজারের জয়েনিং চেক করা হয়।

### 3. Vercel Serverless DB caching
[db.ts](file:///home/arman/Arman/bot/src/app/db.ts)
Serverless পরিবেশের প্রতি রিকোয়েস্টে ডাটাবেস নতুন করে ওপেন না করে `isConnected` স্ট্যাটাস দিয়ে রি-ইউজ করা হয়।

---

## 🛠️ REST API Endpoints

### 🤖 Bot Endpoints
- `GET  /api/v1/bot/status` - চেক করে ব্যাকএন্ড ও বট রানিং আছে কিনা।
- `POST /api/v1/bot/broadcast` - চ্যানেলে এডমিন মেসেজ পোস্ট করতে। Body: `{ "title": "...", "content": "..." }`
- `POST /api/v1/bot/webhook` - টেলিগ্রাম থেকে আগত ওয়েবহুক আপডেট প্রসেস করার জন্য।
- `GET  /api/v1/bot/set-webhook` - টেলিগ্রামের কাছে Vercel Webhook রেজিস্টার করার জন্য।

### 👤 User Endpoints
- `POST /api/v1/user/auth-telegram` - টেলিগ্রাম ইউজার অথেনটিকেট ও তৈরি করতে।
- `GET  /api/v1/user/profile/:telegramId` - ইউজারের প্রোফাইল দেখতে।
- `POST /api/v1/user/topup` - ইউজারের ব্যালেন্স যোগ করতে।

### 📦 Task Endpoints
- `POST /api/v1/task/create` - নতুন টাস্ক তৈরি করতে।
- `GET  /api/v1/task/my-tasks/:telegramId` - ইউজারের টাস্ক দেখতে।

---

## 🚀 লোকাল পিসিতে চালানোর নিয়ম (Local Development)

১. **প্রজেক্ট ডিপেন্ডেন্সি ইনস্টল করুন:**
   ```bash
   npm install
   ```

২. **`.env` ফাইল কনফিগার করুন:**
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=mongodb+srv://...
   JWT_SECRET=supersecretjwtkey
   JWT_EXPIRES_IN=7d
   TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_FROM_BOTFATHER
   BOT_USERNAME=my_pixel_extractor_bot
   TELEGRAM_CHAT_GROUP_ID=@arman_pixel_chat
   TELEGRAM_APP_CHANNEL_ID=@arman_pixel_app
   ```

৩. **ডেভেলপমেন্ট সার্ভার চালু করুন:**
   ```bash
   npm run dev
   ```

---

## ☁️ Vercel-এ লাইভ ড্যাপ্লয়মেন্ট ও ২৪/৭ চালানোর নিয়ম (Vercel Deployment)

১. গিটহাব প্রজেক্ট Vercel-এ ইমপোর্ট করুন।
২. Vercel Dashboard ➔ Settings ➔ **Environment Variables**-এ `.env` এর ভ্যালুগুলো এড করুন:
   - `DATABASE_URL`
   - `TELEGRAM_BOT_TOKEN`
   - `BOT_USERNAME`
   - `TELEGRAM_CHAT_GROUP_ID`
   - `TELEGRAM_APP_CHANNEL_ID`
৩. প্রজেক্টটি Vercel-এ **Redeploy** দিন।
৪. ব্রাউজারে `https://your-vercel-domain.vercel.app/api/v1/bot/set-webhook` হিটিং দিলে টেলিগ্রামে ওয়েবহুক রেজিস্টার হয়ে যাবে এবং বট পিসি বন্ধ থাকলেও ২৪/৭ চলবে!
