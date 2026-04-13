# 🛍️ UMKM Website Project

Fullstack E-Commerce Website for Small Businesses (UMKM)

A modern fullstack web application designed to help small and medium businesses (UMKM) manage products, orders, and customers efficiently.
Built with React, Supabase, and modern web best practices, this project demonstrates my ability to design scalable frontend architecture, manage authentication & authorization, and handle real-world product workflows.


🔗 Live Demo:
👉 https://umkm-website-project.vercel.app

🔐 Admin Panel:
👉 https://umkm-website-project.vercel.app/admin

## ✨ Key Features
### 👤 Authentication & Authorization

- User authentication using Supabase Auth

- Role-based access control (Admin / User)

- Secure admin access without separate admin routes

### 🛒 Product Management (Admin)

- Add new products with:
  - Name
  - Description
  - Category
  - Price & Offer Price
  - Multiple product images
  - Toggle product availability (is_available)
  - Fetch products and images dynamically

### 🛍️ Client Side Features

- Product listing & category filtering
- Product detail page
- Cart system
- Order flow (ready for future expansion)

### 🗂️ State Management

- Global state using React Context
- AuthContext
- AppContext
- ProductContext
- Clean separation between business logic and UI components

### ☁️ Backend as a Service (BaaS)

- Supabase PostgreSQL for database
- Supabase Storage for product images
- Row Level Security (RLS) for secure data access

### 🧱 Tech Stack
Frontend
- ⚛️ React (Vite)
- 🧭 React Router DOM
- 🎨 Tailwind CSS
- 🔔 React Hot Toast

Backend / Services
- 🟢 Supabase (Auth, Database, Storage)
- 🐘 PostgreSQL
- 🔐 Row Level Security (RLS)

Deployment
- ▲ Vercel (Frontend Hosting)
- 🔗 GitHub (Version Control)

## 🔐 Admin Access Flow

/admin

- If not logged in → Seller Login Page

- If logged in but not admin → Access denied

- If admin → Seller Dashboard (without navbar & footer)

- Admin routes are handled directly in App.jsx without custom admin route wrappers, keeping routing logic simple and transparent.

## 🧠 What I Learned from This Project

- Designing scalable React Context architecture

- Handling real-world authentication edge cases

- Implementing role-based UI rendering

- Working with Supabase Storage & RLS

- Debugging async auth & state hydration issues

- Structuring a project suitable for production deployment

## 🚀 Future Improvements

- Image upload compression & optimization

- Order management system

- Payment gateway integration

- Admin analytics dashboard

- Better error boundary handling

- Server-side validation & logging

⭐ If you find this project interesting, feel free to give it a star!

Source Assets = https://greatstack.dev/assets/grocery-delivery-react-app
