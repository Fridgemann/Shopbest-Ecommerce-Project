# 🛒 ShopBest.co

Your one-stop shop for everything you need — built to showcase modern full-stack e-commerce development with real-world practices like JWT auth, persistent carts, protected APIs, and modular design.

---

## 🚀 Live Demo

- **Frontend:** [https://shopbest-project.vercel.app](https://shopbest-project.vercel.app)  
- **Backend:** [https://shopbest-project.onrender.com](https://shopbest-project.onrender.com)

---

## 🧰 Tech Stack

| Layer         | Technologies                                      |
|---------------|---------------------------------------------------|
| **Frontend**  | Next.js, React, Zustand, Tailwind CSS             |
| **Backend**   | Node.js, Express.js, Mongoose, JWT, Helmet, CORS  |
| **Database**  | MongoDB Atlas                                     |
| **Deployment**| Vercel (Frontend), Render (Backend)               |

---

## 🧑‍💻 Features

- Secure user registration and login with bcrypt and JWT (httpOnly cookies)
- Authentication state managed globally using Zustand
- Persistent cart system tied to user ID in MongoDB
- Product listing and featured products fetched from backend API
- **Order checkout with Stripe integration**
- **Order confirmation emails sent automatically after successful payment**
- **Order history page for users**
- **Wishlist feature for saving favorite products**
- Responsive, modern UI with Tailwind CSS
- CORS and Helmet for security
- Ready for deployment on Vercel and Render

---

## 📁 Project Structure

```

.
├── client/             # Next.js frontend
│   ├── components/
│   ├── pages/
│   └── store/          # Zustand global state
├── server/             # Express.js backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── index.js

```

---

## 🛠 Local Development

### Prerequisites

- Node.js
- MongoDB Atlas URI (or local MongoDB)
- Vercel + Render accounts for deployment
- **Stripe account and API keys**
- **Gmail (or SMTP) credentials for order confirmation emails**

### 🔧 Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/shopbest.git
   cd shopbest
   ```

2. **Set up environment variables**

   * In `server/.env`:

     ```
     MONGO_URI=your_mongo_uri
     CLIENT_ORIGIN=https://shopbest-project.vercel.app
     JWT_SECRET=your_jwt_secret
     PORT=5000
     STRIPE_SECRET_KEY=your_stripe_secret_key
     STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     ```

3. **Start backend**

   ```bash
   cd server
   npm install
   npm start
   ```

4. **Start frontend**

   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 🛡 Deployment

* **Frontend:** Deployed on Vercel. Just connect GitHub repo and it auto-deploys.
* **Backend:** Deployed on Render. Configure environment variables in dashboard.
* **Ping Service:** Use [UptimeRobot](https://uptimerobot.com/) to prevent backend sleep.
* **Stripe Webhooks:** In production, set your Render backend `/webhook` endpoint in the Stripe dashboard.

---

## 📌 TODO

* [x] Checkouts DB storing
* [x] Order history
* [x] Wishlist feature
* [ ] Admin product dashboard

---

## 🧑‍💻 Recent Major Features

- Stripe-powered checkout with order storing and confirmation emails
- Order history page for users
- Wishlist feature (add/remove/view)
- Admin dashboard (coming soon)

---

## 🧠 Inspiration

Built as a hands-on project to learn full-stack integration and real-world production patterns. Features like token-based auth, persistent state, and multi-page routing reflect actual e-commerce infrastructure.

---

## 📬 Contact

Feel free to reach out via GitHub Issues or [LinkedIn](https://www.linkedin.com/in/emre-atasavun-125918303/) if you'd like to contribute, report bugs, or ask questions!

---

> ⚠️ **Note on Login and Mobile Browsers**
>
> Because this project uses secure, httpOnly cookies for authentication and the frontend (Vercel) and backend (Render) are on different domains, some mobile browsers (especially in-app browsers and Safari on iOS) may block login due to cross-site cookie restrictions. This is a browser security limitation, not a bug in the project.
>
> For best results, use Chrome or Firefox on desktop or mobile, and open the site in a regular browser (not inside apps like Instagram or Twitter).
>
> If you want perfect compatibility, you would need to deploy both frontend and backend under the same root domain (requires a custom domain).
