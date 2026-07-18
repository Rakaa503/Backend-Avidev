# 🚀 Backend AviDev

Backend AviDev adalah REST API yang dibangun menggunakan **Hono**, **TypeScript**, **Prisma ORM**, dan **PostgreSQL** dengan standar keamanan **AVSS Lite (AviDev Security Standard Lite)**.

## ✨ Features

- JWT Authentication
- Role Based Access Control (User, Admin, Superadmin)
- User Management
- Product Management
- Order Management
- Zod Validation
- Global Error Handler
- Rate Limiter
- Security Headers
- CORS Protection
- Prisma ORM
- PostgreSQL

---

## 🛠 Tech Stack

- Bun
- Hono
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Zod
- Pino Logger
- AVSS Lite

---

## ⚙️ Installation

```bash
git clone https://github.com/Rakaa503/backend-avidev.git

cd backend-avidev

bun install
```

Generate Prisma

```bash
bunx prisma generate
```

Migration

```bash
bunx prisma migrate dev
```

Run Development

```bash
bun run dev
```

---

## 🔑 Environment Variables

```env
DATABASE_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

PORT=3000
```

---

## 📚 API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/auth/register |
| POST | /api/v1/auth/login |
| POST | /api/v1/auth/refresh |
| POST | /api/v1/auth/logout |
| GET | /api/v1/auth/me |
| PATCH | /api/v1/auth/change-password |

---

### Users

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/users |
| GET | /api/v1/users/:id |
| POST | /api/v1/users |
| PATCH | /api/v1/users/:id |
| DELETE | /api/v1/users/:id |

---

### Products

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/products |
| GET | /api/v1/products/:id |
| POST | /api/v1/products |
| PATCH | /api/v1/products/:id |
| DELETE | /api/v1/products/:id |

---

### Orders

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/orders |
| GET | /api/v1/orders/me |
| GET | /api/v1/orders/:id |
| POST | /api/v1/orders |
| PATCH | /api/v1/orders/:id |
| DELETE | /api/v1/orders/:id |

---

## 👥 Roles

### User

- Login
- View Products
- Create Order
- View My Orders

### Admin

- Manage Products
- Manage Orders

### Superadmin

- Full Access
- Delete Data

---

## 📦 Order Workflow

```
Login
    ↓
View Products
    ↓
Create Order
    ↓
Status = Pending
    ↓
WhatsApp Confirmation
    ↓
Waiting Payment
    ↓
Paid
    ↓
Processing
    ↓
Completed
```

---

## 🔐 Security

- JWT Authentication
- Role Middleware
- Rate Limiter
- Security Headers
- CORS
- Input Validation
- Global Error Handling
- AVSS Lite Security

---

## 📄 License

MIT License © AviDev Studio