

A full-stack web application that allows users to search for paintings or artists and view detailed artwork information.

Built with a **React** frontend and a **Node.js/Express** backend, this project fetches and displays art data from a custom API and provides a clean, centered UI.

---

## 📁 Project Structure

.
├── backend/ # Express server & API routes
│ ├── node_modules/
│ ├── package.json
│ ├── package-lock.json
│ └── server.js
├── frontend/ # React app (UI + search & details)
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ ├── package.json
│ ├── package-lock.json
│ └── README.md
├── CleandDatabase/ # Optional cleaned dataset or preprocessing scripts
└── README.md # Project overview and instructions

yaml
Copy
Edit

---

## ✨ Features

- 🎨 Search paintings or artists
- 🖼 View painting details (image, title, artist, medium, date, etc.)
- 💾 Saves last search and scroll position using `sessionStorage`
- 💡 Clean, responsive, and centered UI
- ⚙️ Technologies: React, Node.js, Express, Axios, CSS

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/art-gallery-app.git
cd art-gallery-app
2. Start the backend
bash
Copy
Edit
cd backend
npm install
node server.js
Backend will run on http://localhost:5000.

3. Start the frontend
Open a second terminal:

bash
Copy
Edit
cd frontend
npm install
npm start
Frontend will run on http://localhost:3000.

💡 Make sure this line exists in frontend/package.json to connect frontend to backend:

json
Copy
Edit
"proxy": "http://localhost:5000"
🛠 Tech Stack
Frontend: React, Axios, HTML/CSS

Backend: Node.js, Express

State: React Hooks (useState, useEffect)

Storage: SessionStorage (for caching results & scroll)

Routing: React Router

📸 Screenshots
Add UI screenshots here (search page, results, and details view).

✅ Future Improvements
🔍 Add autocomplete for artist search

🎯 Improve filtering and pagination

💾 Connect to real art API or MongoDB/PostgreSQL database

📱 Optimize for mobile devices

📃 License
MIT License © 2025 Yahia Salah

yaml
Copy
Edit

---

Let me know if you'd like a version that includes deploy instructions (e.g. for Vercel, Netlif
