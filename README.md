# Label Vihana — E-Commerce Frontend

Frontend for the **Label Vihana** saree & ethnic-wear store. Built with React + Vite + Tailwind CSS, wired to the backend REST API with automatic JWT refresh.

## Stack

- React 19
- Vite 6
- Tailwind CSS 4
- React Router 7
- Axios (API client with automatic token refresh)

## Prerequisites

- **Node.js** 20+
- **PostgreSQL** running locally (for the backend)
- The **backend** repository running at `http://localhost:5000/api`

## Install & run

```bash
# 1. Clone the repo
git clone https://github.com/narendra0909/ecommerce-frontend.git
cd ecommerce-frontend

# 2. Install dependencies
npm install

# 3. Configure the frontend API base URL (frontend/.env)
#    Already set to: VITE_API_URL=http://localhost:5000/api
#    The backend must have CORS_ORIGIN=http://localhost:3000

# 4. Start the dev server (runs on http://localhost:3000)
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Backend setup (once)

The frontend depends on the backend API. From the backend repo:

```bash
cd ecommerce-website-backend

# Install dependencies
npm install

# Copy env and fill in PostgreSQL, JWT, Cloudinary, and ADMIN_REGISTRATION_SECRET credentials
cp .env.example .env
# Make sure CORS_ORIGIN=http://localhost:3000

# Run Prisma migrations
npm run prisma:migrate

# Start the backend
npm run dev
```

## Creating your first admin account

1. Open **http://localhost:3000/admin/register**
2. Fill in the form and enter the `ADMIN_REGISTRATION_SECRET` value from the backend `.env`
3. You're logged in automatically and redirected to the product dashboard

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage with featured collection |
| `/products` | Browse all published pieces |
| `/products/:slug` | Product detail page |
| `/cart` | Shopping cart (persists in localStorage) |
| `/login` | Customer login |
| `/register` | Customer registration |
| `/admin/login` | Admin sign-in |
| `/admin/register` | Create first admin account |
| `/admin/products` | Product dashboard |
| `/admin/products/new` | Create a product |
| `/admin/products/:id/edit` | Edit a product |

## Project structure

```
src/
├── api/            # Axios client + auth/product API functions
├── context/        # AuthContext, CartContext
├── components/     # Navbar, Footer, ProductCard, guards, spinner
├── pages/          # Storefront + admin pages
├── utils/          # Helpers (currency, image URLs, error parsing)
├── App.jsx         # Routing
└── main.jsx        # Entry point
```

## Authentication

The app uses the backend's **double-token model**:
- **Access token** (JWT) — sent as `Authorization: Bearer <token>`
- **Refresh token** — HTTP-only cookie, automatically rotated on 401 responses
- Sessions survive page reloads via a silent refresh on `GET /users/me`
