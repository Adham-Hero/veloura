# Veloura — Hair Products E-Commerce Store

A full-stack, bilingual (English/Arabic), light/dark themed online store for hair care products, built with the MERN stack.

- **Frontend:** React + Vite, React Router, Bootstrap 5 + custom CSS design system
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT authentication

## 1. Project Structure

```
veloura/
├── backend/
│   ├── config/db.js
│   ├── controllers/        (auth, product, user, order)
│   ├── middleware/         (JWT auth, admin check, error handling)
│   ├── models/              (User, Product, Order)
│   ├── routes/
│   ├── utils/               (generateToken, seedAdmin, seedProducts)
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      (Navbar, Footer, ProductCard, forms, etc.)
│   │   ├── context/         (Auth, Cart, Language, Theme)
│   │   ├── i18n/             (en.js, ar.js)
│   │   ├── layouts/
│   │   ├── pages/            (Home, Shop, ProductDetails, Cart, Checkout,
│   │   │                      Login, Register, About, Contact, AdminDashboard)
│   │   ├── services/         (axios API calls)
│   │   ├── styles/global.css (design system)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── .env.example
└── README.md
```

## 2. Prerequisites

- Node.js 18+ and npm
- MongoDB running locally, **or** a free MongoDB Atlas cluster

## 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/veloura
JWT_SECRET=replace_this_with_a_long_random_secret
PORT=5000
SEED_ADMIN_NAME=Veloura Admin
SEED_ADMIN_EMAIL=admin@veloura.com
SEED_ADMIN_PASSWORD=Admin123!
```

If you're using MongoDB Atlas instead of a local database, replace `MONGO_URI` with your Atlas connection string, e.g.
`mongodb+srv://<user>:<password>@cluster0.mongodb.net/veloura`.

### Start MongoDB locally (if not using Atlas)

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Create the first admin account

```bash
npm run seed:admin
```

This creates (or promotes) the admin account defined by `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in your `.env`.
Default dev credentials (only if you keep the example values):

```
Email:    admin@veloura.com
Password: Admin123!
```

**Change these before deploying anywhere public.**

### (Optional) Seed sample products

```bash
node utils/seedProducts.js
```

This clears the `products` collection and inserts 8 sample Veloura products so the storefront isn't empty.

### Start the backend

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start       # plain node
```

The API runs at `http://localhost:5000`. Verify it's alive:

```bash
curl http://localhost:5000/api/health
```

## 4. Frontend Setup

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env` should contain:

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## 5. Using the App

- Browse products, switch language (EN/AR button in the navbar — this also flips the layout to RTL), and switch theme (🌙/☀️ button).
- Sign up as a normal user via **Register**, or log in as the admin you seeded.
- Logged-in admins see an **Admin Dashboard** link in the account menu, where they can add/edit/delete products and view registered users.
- Add items to the cart (persisted in `localStorage`), then check out — this creates a real order in MongoDB and decrements product stock.

## 6. Testing the API Directly

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@veloura.com","password":"Admin123!"}'

# List products
curl http://localhost:5000/api/products

# Create a product (replace TOKEN with the admin's JWT from login)
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name":"Test Shampoo","nameAr":"شامبو تجريبي",
    "description":"desc","descriptionAr":"وصف",
    "price":19.99,"category":"Shampoo",
    "image":"https://images.unsplash.com/photo-1585232004423-3e14f4306e0f",
    "stock":10
  }'
```

## 7. API Reference

| Method | Endpoint                        | Access        | Description                  |
|--------|----------------------------------|---------------|-------------------------------|
| POST   | `/api/auth/register`             | Public        | Create a new user account     |
| POST   | `/api/auth/login`                 | Public        | Log in, returns JWT           |
| GET    | `/api/auth/me`                    | Private       | Get current logged-in user    |
| GET    | `/api/products`                   | Public        | List products (search/filter/sort/paginate via query params) |
| GET    | `/api/products/:id`                | Public        | Get a single product          |
| GET    | `/api/products/:id/related`        | Public        | Get related products          |
| GET    | `/api/products/categories/list`    | Public        | List available categories     |
| POST   | `/api/products`                    | Admin only    | Create a product              |
| PUT    | `/api/products/:id`                 | Admin only    | Update a product              |
| DELETE | `/api/products/:id`                 | Admin only    | Delete a product               |
| GET    | `/api/users`                        | Admin only    | List all users                 |
| POST   | `/api/orders`                       | Public/User   | Place an order                 |
| GET    | `/api/orders`                       | Private       | List own orders (or all, if admin) |
| GET    | `/api/orders/:id`                    | Private       | Get a single order             |

`GET /api/products` query params: `keyword`, `category`, `sort` (`price_asc` \| `price_desc` \| `newest` \| `rating`), `page`, `limit`.

## 8. Security Notes

- Passwords are hashed with **bcrypt** before being stored.
- JWTs are signed with `JWT_SECRET` and expire after 7 days.
- The `role` field is **never** trusted from the client — it's always read from the database via the `protect` middleware, and admin-only routes are enforced server-side with the `admin` middleware, not just hidden in the UI.
- Order totals and stock are recalculated server-side from the database at checkout time, not trusted from the cart payload.

## 9. Notes on Images

Products currently use plain image URLs (see `image` field). The `Product` schema is deliberately simple so it's a drop-in fit for Cloudinary later: swap the URL you save into `image` for a Cloudinary `secure_url` after uploading, no schema changes needed.

## 10. What's Intentionally Not Included

- Real payment processing (Stripe, etc.) — the checkout flow and `Order` model are structured so a payment step can be added between "place order" and "order confirmed" without restructuring anything.
- Image file uploads — development uses image URLs, per the brief.
