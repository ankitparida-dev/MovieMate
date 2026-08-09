# 🎬 MovieMate

MovieMate is a modern **full-stack movie & TV show discovery platform** built with **React.js, Node.js, Express.js, MongoDB, PostgreSQL, Prisma, and Socket.io**. It delivers a seamless, interactive experience for discovering movies, tracking watch activity, receiving personalized recommendations, and engaging with other users in real time.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | [https://movie-mate-seven-nu.vercel.app/](https://movie-mate-seven-nu.vercel.app/) |
| **Backend (Render)** | [https://moviemate-l4ts.onrender.com/](https://moviemate-l4ts.onrender.com/) |

---

## ✨ Key Features

### 🔎 Discovery & Search
- **Live Movie Search** – Dynamic filtering with instant results
- **Browse Movies & TV Shows** – Dedicated sections for movies and series
- **🎞️ Spotlight Carousel** – Interactive hero banner slider with trending content

### 📚 Personal Library
- **⭐ Watchlist & Favorites System** – Save and manage favorite movies
- **📜 Recently Viewed Tracking** – Automatically tracks user watch history
- **📝 Movie Notes & Ratings** – Personal notes and ratings for movies
- **🎯 Personalized Recommendations** – AI-driven suggestions based on user activity and ratings

### 💬 Real-Time Engagement
- **💬 Real-Time Comments System** – Live comments and replies powered by Socket.io
- **❤️ Like & Reply System** – Instant interaction with comments and replies
- **🔔 Real-Time Notifications** – Live notifications for user activities

### 📊 Analytics & Insights
- **📊 Analytics Dashboard** – Visual graphs and insights based on watch activity
- **📺 Where to Watch Feature** – Shows OTT platform availability for movies and shows

### 🖼️ User Profile & Media
- **👤 JWT Authentication System** – Secure login & registration with access and refresh tokens
- **🖼️ Avatar Upload System** – Upload real profile photos with fallback cartoon avatars
- **🎨 Cartoon Avatar Creator** – WhatsApp-style cartoon avatar creator

### 🧪 Quality & Deployment
- **🧪 Unit Testing** – API testing using Jest and Supertest
- **🚀 Deployment Ready** – Production-ready deployment on Render and Vercel
- **📱 Fully Responsive UI** – Optimized for desktop, tablet, and mobile devices

---

## 🧩 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React.js (Vite) | UI and component architecture |
| | React Router | Client-side routing |
| | CSS Modules | Component styling |
| | Chart.js / Recharts | Data visualizations |
| **Backend** | Node.js | Runtime environment |
| | Express.js | REST API framework |
| | Socket.io | Real-time communication |
| **Database** | MongoDB + Mongoose | NoSQL database (users, library, sessions) |
| | PostgreSQL + Prisma ORM | Relational database (comments, reviews) |
| **Authentication** | JWT | Access and refresh token authentication |
| | bcrypt | Password hashing |
| | Express Sessions & Cookies | Session management |
| **Storage** | Multer | File upload handling |
| **API** | TMDB API | Movie and TV show data |
| **Testing** | Jest + Supertest | Unit and API testing |
| **Deployment** | Render (Backend) | Server hosting |
| | Vercel (Frontend) | Frontend hosting |
| **Tools** | Postman | API testing and debugging |
| | ESLint + Prettier | Code linting and formatting |

---

## 🧠 Learning Goals

This project demonstrates a comprehensive understanding of:

- ✅ **Full-Stack Architecture** – Building and integrating frontend and backend systems
- ✅ **REST API Design** – Creating scalable, well-structured API endpoints
- ✅ **Authentication & Authorization** – JWT-based authentication with role-based access control
- ✅ **Middleware Lifecycle** – Implementing middleware for auth, logging, and error handling
- ✅ **Real-Time Communication** – Using Socket.io for live comments and notifications
- ✅ **Session & Cookie Management** – Managing user sessions with Express Sessions
- ✅ **Database Integration** – Working with MongoDB and PostgreSQL using Mongoose and Prisma
- ✅ **CRUD Operations** – Full CRUD implementation on protected APIs
- ✅ **File Upload** – Handling image uploads with Multer
- ✅ **Responsive UI/UX** – Building mobile-first, responsive user interfaces
- ✅ **CI/CD & Deployment** – Deploying to Render and Vercel with environment configuration
- ✅ **Unit Testing** – Writing and running tests using Jest and Supertest

---

## 🏗️ Project Architecture
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLIENT (React.js) │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ │
│ │ React UI │ │ React │ │ Socket.io │ │ Chart.js/ │ │
│ │ Components │ │ Router │ │ Client │ │ Recharts │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ EXPRESS.JS BACKEND SERVER │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────────────────┐ │
│ │ MIDDLEWARE LAYER │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│ │ │ Auth │ │ Logger │ │ Rate │ │ Error │ │ │
│ │ │ Middleware │ │ Middleware │ │ Limiter │ │ Handler │ │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │ │
│ └───────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌───────────────────────────────────────────────────────────────────────┐ │
│ │ API ROUTES │ │
│ │ ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │ │
│ │ │ Auth │ │ Users │ │ Movies │ │ Notes │ │ Reviews│ │ │
│ │ └─────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │ │
│ │ ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │ │
│ │ │Comments │ │ Lists │ │ Follow │ │ Admin │ │ Upload │ │ │
│ │ └─────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │ │
│ └───────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌───────────────────────────────────────────────────────────────────────┐ │
│ │ SOCKET.IO SERVER │ │
│ │ ┌─────────────────┐ ┌─────────────────┐ │ │
│ │ │ Comments │ │ Notifications │ │ │
│ │ │ Handler │ │ Handler │ │ │
│ │ └─────────────────┘ └─────────────────┘ │ │
│ └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
│
┌─────────────────┼─────────────────┐
▼ ▼ ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│ MONGODB │ │ POSTGRESQL │ │ TMDB API │
│ (NoSQL Database) │ │ (Relational Database) │ │ (External Data) │
├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────┤
│ • Users │ │ • Comments │ │ • Movies │
│ • Library (Watchlist) │ │ • Reviews │ │ • TV Shows │
│ • Notes & Ratings │ │ • Likes │ │ • Cast & Crew │
│ • Sessions │ │ • Reports │ │ • Streaming Platforms │
│ • Notifications │ │ • Analytics │ │ • Trailers │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘

---

## 🚀 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Vercel | [https://movie-mate-seven-nu.vercel.app/](https://movie-mate-seven-nu.vercel.app/) |
| **Backend** | Render | [https://moviemate-l4ts.onrender.com/](https://moviemate-l4ts.onrender.com/) |

---

## 📄 License

This project is for educational purposes. TMDB API usage complies with their terms of service.

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) – Movie data API
- [Chart.js](https://www.chartjs.org/) – Analytics charts
- [Font Awesome](https://fontawesome.com/) – Icons
- [DiceBear](https://www.dicebear.com/) – Avatar library

---

**MovieMate – Your Ultimate Movie Companion!** 🎬🍿