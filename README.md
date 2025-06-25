# LMS Platform (Next.js + Prisma + Stripe + Clerk)

This is a full-stack Learning Management System (LMS) built with **Next.js 13**, **Prisma**, **MongoDB**, **Stripe**, and **Clerk** for authentication.

### 🚀 Features

- 👨‍🏫 Instructor/Student Roles
- 🧠 Course creation and purchase
- 🧾 Stripe payment integration
- ✅ Quiz system with result analysis
- 📝 Note-taking, to-do, and test tools
- 🗂️ Resume builder with PDF export
- 📦 File uploads using Uploadthing
- 🔒 Clerk authentication
- 🧠 AI-based chatbot for query assistance
- 🎨 Responsive UI with Tailwind CSS
- 🌐 Fully deployed (coming soon)

---
## 🌐 Live Demo

🔗 [https://lms-s8x4.vercel.app](https://lms-s8x4.vercel.app)

---
### 🧩 Tech Stack

| Category       | Tech Used                     |
|----------------|-------------------------------|
| Frontend       | Next.js 13, TypeScript, Tailwind |
| Backend        | Node.js, Prisma, MongoDB       |
| Auth           | Clerk                          |
| Payments       | Stripe                         |
| File Uploads   | Uploadthing                    |
| AI             | gemini (Chatbot)               |

---

### 🛠️ Setup Instructions

```bash
git clone https://github.com/Ayush2911ojha/LMS.git
cd LMS
npm install
Create a .env.local file with your environment variables:

makefile
DATABASE_URL=
NEXT_PUBLIC_CLERK_FRONTEND_API=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
GEMINI_API_KEY  = 
