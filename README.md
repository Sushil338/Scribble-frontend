# Scribble-frontend

![GitHub stars](https://img.shields.io/github/stars/Sushil338/Scribble-frontend?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/Sushil338/Scribble-frontend?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/Sushil338/Scribble-frontend?style=for-the-badge&logo=github) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)

## 📑 Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [Run Commands](#run-commands)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Contributing](#contributing)

## 📝 Description

Scribble-frontend is a dynamic and interactive web application built with React, designed to provide users with a seamless platform for digital sketching and note-taking. This frontend interface communicates efficiently with a backend API to manage and persist user data, ensuring a responsive experience where creativity meets functionality. Whether you're doodling or documenting ideas, Scribble-frontend offers a clean, component-driven environment tailored for high performance and ease of use.

## ✨ Features

- 🌐 Api

## 🛠️ Tech Stack

- ⚛️ React

## ⚡ Quick Start

```bash

# Clone the repository
git clone https://github.com/Sushil338/Scribble-frontend.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📦 Key Dependencies

```
@stomp/stompjs: ^7.3.0
@tailwindcss/vite: ^4.2.4
axios: ^1.16.0
lucide-react: ^1.14.0
react: ^19.2.5
react-dom: ^19.2.5
react-router-dom: ^7.15.0
sockjs-client: ^1.6.1
tailwindcss: ^4.2.4
```

## 🚀 Run Commands

- **dev**: `npm run dev`
- **build**: `npm run build`
- **lint**: `npm run lint`
- **preview**: `npm run preview`

## 📁 Project Structure

```
.
├── eslint.config.js
├── index.html
├── package.json
├── src
│   ├── App.jsx
│   ├── api
│   │   └── apiClient.js
│   ├── components
│   │   ├── AuthPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Navbar.jsx
│   │   ├── Register.jsx
│   │   ├── Whiteboard.jsx
│   │   └── whiteboard
│   │       ├── RoomBoard.jsx
│   │       ├── RoomChatPanel.jsx
│   │       ├── Toolbar.jsx
│   │       ├── WhiteboardCanvas.jsx
│   │       └── WhiteboardHeader.jsx
│   ├── hooks
│   │   ├── useAuth.js
│   │   ├── useScribbleSocket.js
│   │   └── useWhiteboardRoom.js
│   ├── index.css
│   ├── main.jsx
│   └── utils
│       ├── canvasShapes.js
│       └── canvasStorage.js
└── vite.config.js
```

## 🛠️ Development Setup

### Node.js/JavaScript Setup
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` or `yarn install`
3. Start development server: (Check scripts in `package.json`, e.g., `npm run dev`)

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/Sushil338/Scribble-frontend.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.
