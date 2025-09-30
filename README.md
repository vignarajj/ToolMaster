# ToolMaster - Professional Developer Tools Suite

A modern web application built with React, TypeScript, and Tailwind CSS. ToolMaster provides a comprehensive suite of developer tools with a beautiful, responsive interface.

## 🚀 Features

- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Dark Theme**: Complete dark/light theme support with persistence
- **Responsive Design**: Mobile-first responsive design that works across all devices
- **Accessibility**: WCAG compliant with proper focus indicators and color contrast

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **Framer Motion** for animations
- **next-themes** for theme management

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ToolMaster
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
# Development mode
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173

## 🌐 Live Demo

The application is deployed and available at: **https://vignaraj.dev/ToolMaster/**

## 🏗️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:pages  # Build for GitHub Pages
npm run check        # Type checking
```

### Project Structure

```
ToolMaster/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   ├── index.html         # HTML entry point
│   └── vite.config.ts     # Vite configuration
├── .github/workflows/     # GitHub Actions workflows
├── dist/                  # Build output
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── README.md             # This file
```

## 🚀 Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions. When you push to the main branch, the workflow will:

1. Build the React application
2. Deploy to GitHub Pages
3. Make it available at https://vignaraj.dev/ToolMaster/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using modern web technologies**