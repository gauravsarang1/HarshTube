# HarshTube

HarshTube is a modern video streaming platform that allows users to upload, watch, and interact with videos. The platform features user authentication, playlists, comments, likes, subscriptions, and watch history, providing a comprehensive YouTube-like experience with real-time updates and AI-powered features.

## 🚀 Features
- User authentication and profile management
- Video upload, streaming, and playback
- Like, comment, and subscribe functionality with real-time updates
- Playlist creation and management
- Watch history tracking
- Responsive and modern UI
- Mini player support with persistent video state
- Real-time notifications for:
  - New comments and replies
  - Subscription updates
  - Like/dislike interactions
- AI-powered features:
  - Smart comment suggestions
  - Content recommendations
  - Automated content moderation

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary
- **Real-time Communication:** Socket.IO
- **AI Integration:** OpenAI API

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd HarshTube
```

2. Install dependencies for both client and server:
```bash
cd client
npm install
cd ../server
npm install
```

3. Set up environment variables:
Create `.env` files in both client and server directories:

For client (.env):
```env
VITE_API_BASE_URL=your_api_url
VITE_SOCKET_URL=your_socket_url
```

For server (.env):
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
OPENAI_API_KEY=your_openai_key
```

4. Start the development servers:
- For the backend:
```bash
cd server
npm run dev
```
- For the frontend:
```bash
cd client
npm run dev
```

## 🏗️ Project Structure
- `client/` - Frontend (React app, UI components)
  - `src/`
    - `api/` - API service layer
    - `components/` - Reusable UI components
    - `context/` - React context providers
    - `features/` - Redux slices and reducers
    - `hooks/` - Custom React hooks
    - `utils/` - Helper functions
- `server/` - Backend (API, database, business logic)
  - `src/`
    - `controllers/` - Request handlers
    - `models/` - Database schemas
    - `routes/` - API routes
    - `utils/` - Helper functions
    - `middlewares/` - Custom middleware
    - `socket/` - WebSocket handlers

## 🔌 WebSocket Integration
The platform uses Socket.IO for real-time features:
- Live comment updates
- Subscription notifications
- Like/dislike counters
- Real-time video statistics

## 🤖 AI Features
- **Smart Comments:** AI-powered comment suggestions and improvements
- **Content Moderation:** Automated content filtering and moderation
- **Recommendations:** Personalized video recommendations

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is licensed under the MIT License.

## 📋 Frontend Details
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **UI Components:** Radix UI
- **Form Handling:** React Hook Form
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **WebSocket Client:** Socket.IO Client
- **Development Tools:** ESLint, PostCSS

## 📋 Backend Details
- **Framework:** Node.js with Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary
- **Real-time:** Socket.IO
- **AI Integration:** OpenAI API
- **API Documentation:** Swagger
- **Testing:** Jest
- **Development Tools:** Nodemon, ESLint
