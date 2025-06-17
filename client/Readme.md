# Frontend Overview

The frontend of HarshTube is built using modern web technologies to provide a seamless user experience.

## 🚀 Features
- User authentication and profile management
- Video streaming and playback
- Like, comment, and subscribe functionality
- Playlist creation and management
- Watch history tracking
- Responsive and modern UI

## 🛠️ Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **UI Components:** Radix UI
- **Form Handling:** React Hook Form
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Development Tools:** ESLint, PostCSS

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd HarshTube/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure
- `src/` - Source code
  - `assets/` - Static assets
  - `components/` - Reusable UI components
  - `features/` - Feature-specific components and logic
  - `lib/` - Utility functions and helpers
  - `store/` - Redux store configuration
  - `theme/` - Theme configuration
  - `App.jsx` - Main application component
  - `AppContent.jsx` - Application content wrapper
  - `main.jsx` - Application entry point
  - `router.jsx` - Routing configuration
  - `index.css` - Global styles

## 🎨 UI Components
The project uses Radix UI components for accessible and customizable UI elements:
- Avatar
- Dropdown Menu
- Tabs

## 🔧 Configuration Files
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `postcss.config.js` - PostCSS configuration

## 📝 License
This project is licensed under the MIT License.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📋 Detailed Features
- **User Authentication:** Secure login and registration with JWT token management.
- **Profile Management:** Users can update their profile information and manage their account settings.
- **Video Streaming:** High-quality video playback with support for various formats and resolutions.
- **Interactive Features:** Users can like, comment, and subscribe to channels, enhancing social interaction.
- **Playlist Management:** Create and manage playlists to organize videos according to user preferences.
- **Watch History:** Track and manage video watch history, allowing users to resume videos from where they left off.
- **Responsive Design:** The UI is designed to be responsive, providing a seamless experience across different devices and screen sizes.

## 📋 MiniPlayer Feature
- **MiniPlayer:** A compact video player that allows users to continue watching videos while navigating through the application. It provides basic playback controls and can be minimized or expanded as needed.

## 📋 Video Management Features
- **Upload Videos:** Users can upload videos to the platform, with support for various formats and resolutions.
- **Delete Videos:** Users can delete their uploaded videos, removing them from the platform.
- **Edit Videos:** Users can edit video details such as title, description, and thumbnail, allowing for easy content management.
