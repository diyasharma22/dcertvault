<div align="center">

# 🔐 D_CertVault

### AI-Powered Certificate Management & Professional Showcase Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai)](https://openai.com)

**"Upload Once. Showcase Everywhere."**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Future Plans](#-future-enhancements)

</div>

---

## 📌 Problem Statement

Students and professionals earn certificates from Coursera, NPTEL, Udemy, Google, Microsoft, HackerRank, internships, workshops, and hackathons — but these certificates remain scattered across emails, downloads folders, and cloud drives.

**D_CertVault** solves this by providing a single intelligent platform to upload, organize, verify, and showcase all certificates — powered by AI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Certificate Analysis** | Automatically extracts title, issuer, skills, and generates a summary using GPT-4o Vision |
| 📤 **Drag & Drop Upload** | Upload PDF, PNG, JPG certificates instantly with drag & drop or file picker |
| 🗂️ **Smart Vault** | Grid view with real-time search and category organization |
| 🌐 **Public Profile** | Shareable profile page at `/profile/username` — perfect for resumes and LinkedIn |
| 🔒 **Privacy Controls** | Toggle each certificate between public and private visibility |
| ✏️ **Edit Metadata** | Manually update title, issuer, credential ID, and verification URL |
| 🔄 **Re-analyze with AI** | Re-run AI analysis on any certificate at any time |
| 📥 **Download** | Download original certificate files anytime |
| 📊 **Dashboard Stats** | Real-time counts of total, public, private certificates and skills identified |
| ⚡ **Skills Profile** | Auto-generated skill portfolio built from all uploaded certificates |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | PostgreSQL hosted on Neon |
| **ORM** | Prisma 5 |
| **AI** | OpenAI GPT-4o Vision API |
| **File Storage** | Cloudinary |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database (free tier available)
- An [OpenAI](https://platform.openai.com) API key
- A [Cloudinary](https://cloudinary.com) account (free tier available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/diyasharma22/dcertvault.git
cd dcertvault

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and fill in all your API keys

# 4. Push the database schema to Neon
npx prisma db push

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app running.

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
# Neon PostgreSQL (direct connection, not pooled)
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# OpenAI
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxx"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📁 Project Structure

```
dcertvault/
├── app/
│   ├── (auth)/
│   │   ├── login/               # Login page
│   │   └── signup/              # Signup page
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/           # Login API route
│   │   │   └── register/        # Register API route
│   │   └── certificates/
│   │       ├── route.ts         # GET all certificates
│   │       ├── [id]/route.ts    # PATCH / DELETE certificate
│   │       ├── upload/route.ts  # Upload + AI analysis
│   │       ├── detail/route.ts  # GET single certificate
│   │       └── reanalyze/route.ts # Re-analyze with AI
│   ├── dashboard/               # User dashboard with stats
│   ├── vault/
│   │   ├── page.tsx             # Certificate vault grid
│   │   └── [id]/page.tsx        # Certificate detail view
│   ├── profile/
│   │   └── [username]/page.tsx  # Public profile page
│   └── lib/
│       └── prisma.ts            # Prisma client singleton
├── prisma/
│   └── schema.prisma            # Database models
├── public/                      # Static assets
├── .env                         # Your local environment variables
├── .env.example                 # Environment variable template
└── README.md
```

---

## 🗄️ Database Schema

### User Table
| Field | Type | Description |
|---|---|---|
| id | String | Unique identifier (cuid) |
| name | String | Full name |
| email | String | Unique email address |
| username | String | Unique username |
| contact | String? | Phone number (optional) |
| password | String | Hashed password (bcryptjs) |
| bio | String? | Profile bio (optional) |
| profileVisibility | String | public / private |
| createdAt | DateTime | Account creation date |

### Certificate Table
| Field | Type | Description |
|---|---|---|
| id | String | Unique identifier (cuid) |
| title | String | Certificate title |
| issuer | String | Issuing organization |
| recipientName | String | Name on certificate |
| issueDate | DateTime? | Date of issue |
| expiryDate | DateTime? | Expiry date if any |
| credentialId | String? | Credential / Certificate ID |
| verificationUrl | String? | Link to verify certificate |
| category | String? | Auto-categorized by AI |
| aiSummary | String? | AI-generated summary |
| skills | String[] | Skills extracted by AI |
| fileUrl | String | Cloudinary file URL |
| visibility | String | public / private |
| userId | String | Foreign key to User |

---

## 🔮 Future Enhancements

- [ ] Google / GitHub / LinkedIn OAuth login
- [ ] Analytics dashboard with charts (certificates by category, year, skills)
- [ ] AI Resume builder with skill gap analysis
- [ ] Certificate expiry reminders via email
- [ ] Blockchain-based certificate verification
- [ ] Mobile application (React Native)
- [ ] Team and Organization accounts
- [ ] LinkedIn profile integration

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👩‍💻 Author

**Diya Sharma**

- GitHub: [@diyasharma22](https://github.com/diyasharma22)
- LinkedIn: [linkedin.com/in/diya-sharma](https://linkedin.com/in/diya-sharma)

---

<div align="center">

Made with ❤️ using Next.js, OpenAI, and Tailwind CSS

⭐ Star this repo if you found it helpful!

</div>
```
