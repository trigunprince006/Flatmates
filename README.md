# FlatMates

A modern open-source platform for finding flats, roommates, tenants, and brokers with real-time chat.

---
# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT, bcrypt |
| Realtime | Socket.IO |
| Uploads | Multer, Cloudinary |
| Services | Twillio, NodeMailer |

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/yourusername/FlatMates.git

cd FlatMates
```

---

## Install Dependencies

```bash
cd backend
npm install
```

---

## Create Environment File

Create a file named `.env` inside the **backend** directory.

Copy the contents from `.env.example`.

---

## Example `.env.example`

```env
PORT=

MONGO_URI=

ACCESS_JWT_SECRET_KEY=

REFRESH_JWT_SECRET_KEY=

TWILIO_ACCOUNT_SID=

TWILIO_AUTH_TOKEN=

TWILIO_PHONE_NUMBER=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

```
---

# Running the Project

Start the backend:

```bash
npm run dev
```

Serve the frontend using Live Server or any static web server.

---

Made with ❤️ by **Prince Trigun**
