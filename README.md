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

## 3b. Deploying the Backend to Vercel (alternative to Render)

Vercel runs Node apps as **serverless functions**, not an always-on server, so the backend
includes a small adapter for this:

- `app.js` — builds the Express app (routes, middleware) but does not call `app.listen()`
- `server.js` — used for local dev / Render: imports `app.js` and calls `app.listen()`
- `api/index.js` — used by Vercel: imports `app.js` and exports it directly, no `listen()`
- `vercel.json` — tells Vercel to route every request to `api/index.js`
- `config/db.js` — caches the MongoDB connection so it's reused across function invocations instead of reconnecting on every request

To deploy:

1. Push the repo to GitHub (see step 2 above) if you haven't already.
2. Go to **vercel.com → Add New → Project** and import the repo.
3. Set **Root Directory** to `backend`.
4. Framework Preset: choose **Other** (Vercel will use `vercel.json` automatically).
5. Add Environment Variables (Project Settings → Environment Variables):
   ```
   MONGO_URI = mongodb+srv://... (your Atlas connection string)
   JWT_SECRET = a long random string
   FRONTEND_URL = https://veloura.vercel.app  (your frontend's deployed URL)
   ```
6. Deploy. Your API will be live at something like:
   ```
   https://veloura-backend.vercel.app
   ```
7. Test it: `https://veloura-backend.vercel.app/api/health`
8. Point the frontend's `VITE_API_URL` env variable at `https://veloura-backend.vercel.app/api`.

**Creating the first admin account on Vercel:** Vercel has no persistent shell like Render does, so run the seed script from your own machine, pointed at the Atlas database:

```bash
cd backend
# make sure .env has the SAME MONGO_URI as the one set in Vercel
npm run seed:admin
node utils/seedProducts.js   # optional sample products
```

Since both point at the same Atlas cluster, this populates the database your live Vercel API reads from.

**Note:** Vercel's free tier has a serverless function execution limit (10s on Hobby) and functions "cold start" after inactivity, similar to Render's free tier sleep behavior — fine for demos and small projects, not for high-traffic production use.

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

## 10. Order Notifications (Email + WhatsApp)

When a customer places an order (Cash on Delivery — no payment gateway is integrated), Veloura automatically:
1. Emails an **invoice** to the customer (buyer) — full order breakdown, total, and shipping details
2. Emails a **new order alert** to the admin
3. Sends a **WhatsApp message** with the order details to the admin's phone, via CallMeBot

All three are optional and independent — if you don't configure a channel, it's silently skipped and the order still succeeds normally. Nothing about checkout ever fails because of a notification problem.

**Why the buyer gets their invoice by email, not WhatsApp:** CallMeBot only works for a phone number that has personally opted in by messaging the bot (that's how it verifies who it's allowed to message). Since customers never do that opt-in step, there's no way to WhatsApp them automatically — email is the only channel that works for an arbitrary buyer. The buyer invoice email is fully automatic already; no extra setup beyond section 10.1 below.

### 10.1 Email setup (Gmail) — needed for BOTH the buyer invoice and the admin alert email

1. Go to your Google Account → **Security** → enable **2-Step Verification** (required for App Passwords).
2. Go to **myaccount.google.com/apppasswords**, create a new App Password (choose "Mail" / "Other").
3. Copy the 16-character password it gives you.
4. In `backend/.env`:
   ```
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASS=the_16_char_app_password
   ADMIN_NOTIFICATION_EMAIL=eltonyahmed232@gmail.com
   ```

`EMAIL_USER` is the Gmail account that *sends* the emails (can be any Gmail you control) — it's used both to email the buyer their invoice and to email you the order alert. `ADMIN_NOTIFICATION_EMAIL` is where the "new order" alert is *received* — set it to `eltonyahmed232@gmail.com`.

### 10.2 WhatsApp setup (CallMeBot — free, no business account)

1. Go to **callmebot.com/blog/free-api-whatsapp-messages** and find the current bot's phone number (it's shown at the top of the "Setup" section — this number rotates occasionally when the free bot fills up, so always use the number listed on that page, not an old one from elsewhere).
2. Save that number as a contact on the admin's phone (`01554372442`).
3. Send it this exact WhatsApp message: `I allow callmebot to send me messages`
4. Within a minute you'll receive a reply: *"API Activated for your phone number. Your APIKEY is ..."* — that number is your API key. (If nothing arrives within 2 minutes, wait 24h and try again — the free bot rate-limits new signups.)
5. In `backend/.env`:
   ```
   CALLMEBOT_PHONE=+201554372442
   CALLMEBOT_API_KEY=the_key_you_received
   ```
   `CALLMEBOT_PHONE` is the admin's own number in full international format **with** the `+` (Egypt `01554372442` → `+201554372442`) — this must match the number you activated in step 3.

That's it — no account signup, no waiting for approval, works immediately. (It's an unofficial free service run by one developer, so treat it as best-effort — fine for order alerts, not for anything mission-critical. If it ever goes down, the email notifications keep working independently.)

### 10.3 Deploying with notifications

Add whichever environment variables you configured (`EMAIL_USER`, `EMAIL_PASS`, `ADMIN_NOTIFICATION_EMAIL`, `CALLMEBOT_PHONE`, `CALLMEBOT_API_KEY`) to your Render or Vercel backend environment variables, then redeploy.

## 11. What's Intentionally Not Included

- Real payment processing (Stripe, etc.) — the checkout flow and `Order` model are structured so a payment step can be added between "place order" and "order confirmed" without restructuring anything.
- Image file uploads — development uses image URLs, per the brief.
