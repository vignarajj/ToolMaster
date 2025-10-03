<div align="center">
  <img src="./client/src/assets/toolmaster-logo.svg" alt="ToolMaster Logo" width="120" height="120" />
  
  # ToolMaster
  
  **Professional Developer Tools Suite**
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://vignaraj.dev/ToolMaster/)
  [![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?style=for-the-badge&logo=github)](https://github.com/vignaraj/ToolMaster)
  [![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  
  *A modern, responsive web application providing essential developer tools with an intuitive interface*
</div>

---

## ✨ Features

### 🔧 **Comprehensive Tool Suite**
- **📊 Text Counter** - Real-time text analysis with character, word, line counts, reading time estimates
- **🔄 Text Converter** - Transform text with multiple case and formatting options
- **🔐 Base64 Encoder/Decoder** - Secure Base64 encoding and decoding
- **🛡️ Encryption Explorer** - Interactive platform for encryption methods (Caesar, AES, RSA, SHA-256)
- **🔑 Password Generator** - Create secure passwords with customizable options
- **📱 QR Code Generator** - Generate QR codes for text, URLs, emails, and phone numbers
- **🎨 Color Picker** - Advanced color picker with palette management

### 🎯 **User Experience**
- **🌓 Dark/Light Theme** - Complete theme support with system preference detection
- **📱 Responsive Design** - Mobile-first design that works across all devices
- **⌨️ Keyboard Shortcuts** - Comprehensive keyboard shortcuts for power users
- **♿ Accessibility** - WCAG compliant with proper focus indicators and screen reader support
- **⚡ Real-time Processing** - Instant feedback for most operations
- **📋 Clipboard Integration** - One-click copy functionality throughout the app

### 🔒 **Security & Privacy**
- **🔐 Client-side Processing** - All encryption/decryption happens in your browser
- **🚫 No Data Collection** - Your data never leaves your device
- **🔒 Secure Algorithms** - Industry-standard encryption implementations

---

## 🛠️ Tech Stack

### **Frontend**
- ![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react) **React 18** with TypeScript
- ![Vite](https://img.shields.io/badge/Vite-5.4.20-646CFF?style=flat&logo=vite) **Vite** for fast development and building
- ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=flat&logo=tailwind-css) **Tailwind CSS** for utility-first styling
- ![Radix UI](https://img.shields.io/badge/RadixUI-Latest-000000?style=flat&logo=radix-ui) **Radix UI** for accessible, unstyled components
- **React Hook Form** with **Zod** validation for form handling
- **TanStack Query** for efficient data fetching and caching
- **Framer Motion** for smooth animations and transitions
- **next-themes** for theme management
- **Lucide React** for consistent iconography

### **Backend** *(Optional - for full-stack deployment)*
- ![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=flat&logo=node.js) **Node.js** with **Express**
- **PostgreSQL** with **Drizzle ORM** for database operations
- **Passport.js** for authentication
- **Express Session** for session management

### **Development & Deployment**
- ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=flat&logo=typescript) **TypeScript** for type safety
- **ESBuild** for fast bundling
- **Playwright** for end-to-end testing
- **GitHub Actions** for CI/CD
- **Docker** support for containerized deployment

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/vignaraj/ToolMaster.git
cd ToolMaster

# Install dependencies
npm install

# Start development server
npm run dev
```

🎉 **The application will be available at:** http://localhost:5000

### **Build for Production**

```bash
# Build the application
npm run build

# Start production server
npm start
```

### **GitHub Pages Deployment**

```bash
# Build for GitHub Pages
npm run build:pages
```

---

## 📁 Project Structure

```
ToolMaster/
├── 📁 client/                    # Frontend React application
│   ├── 📁 src/
│   │   ├── 📁 assets/            # Static assets (images, icons)
│   │   ├── 📁 components/        # Reusable React components
│   │   │   ├── 📁 layout/        # Layout components (header, sidebar)
│   │   │   └── 📁 ui/            # UI component library
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   ├── 📁 lib/               # Utility functions and libraries
│   │   ├── 📁 pages/             # Page components for each tool
│   │   ├── 📄 App.tsx            # Main app component with routing
│   │   ├── 📄 main.tsx           # Application entry point
│   │   └── 📄 index.css          # Global styles
│   ├── 📄 index.html             # HTML entry point
│   └── 📄 vite.config.ts         # Vite configuration
├── 📁 server/                    # Backend Express server (optional)
├── 📁 shared/                    # Shared types and schemas
├── 📁 .github/workflows/         # GitHub Actions CI/CD
├── 📁 dist/                      # Production build output
├── 📄 package.json               # Dependencies and scripts
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 tailwind.config.ts         # Tailwind CSS configuration
├── 📄 docker-compose.yml         # Docker configuration
└── 📄 README.md                  # This file
```

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production with server |
| `npm run build:pages` | Build for GitHub Pages deployment |
| `npm run start` | Start production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push database schema changes |

---

## 🚀 Deployment Options

### **🌐 GitHub Pages (Static)**
Perfect for client-side only deployment:

1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Push changes to trigger automatic deployment
4. Your app will be available at `https://yourusername.github.io/ToolMaster/`

### **☁️ Vercel/Netlify (Static)**
```bash
# Build command
npm run build:pages

# Output directory
dist
```

### **🐳 Docker (Full-Stack)**
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

### **🔧 Manual Server Deployment**
```bash
# Install dependencies
npm install --production

# Build the application
npm run build

# Set environment variables
cp .env.production .env

# Start the server
npm start
```

---

## ⚙️ Configuration

### **Environment Variables**

Create a `.env` file for local development or configure these in production:

```bash
# Application
NODE_ENV=production
PORT=3000

# Database (for full-stack deployment)
DATABASE_URL=postgresql://username:password@localhost:5432/toolmaster

# Security
SESSION_SECRET=your-secure-random-string
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# CORS (for API deployment)
ALLOWED_ORIGINS=https://yourdomain.com
```

### **Customization**

- **Theme Colors**: Edit `tailwind.config.ts`
- **Add Tools**: Create new components in `client/src/pages/`
- **Styling**: Modify `client/src/index.css`
- **Logo**: Replace `client/src/assets/toolmaster-logo.svg`

---

## 🧪 Testing

```bash
# Run end-to-end tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Generate test report
npx playwright show-report
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use existing UI components from the component library
- Add keyboard shortcuts for new tools
- Ensure mobile responsiveness
- Write tests for new features
- Update documentation

---

## 🔒 Security

- All encryption/decryption operations are performed client-side
- No user data is transmitted to external servers
- Secure password generation using cryptographically strong randomness
- Content Security Policy implemented
- Regular dependency updates via automated security scanning

---

## 🎯 Roadmap

- [ ] **Additional Tools**: JSON formatter, URL encoder/decoder, Hash generators
- [ ] **Export Features**: Export results in multiple formats (PDF, CSV)
- [ ] **Themes**: More color themes and customization options
- [ ] **PWA Support**: Offline functionality and app-like experience
- [ ] **API Integration**: Optional cloud sync for user preferences
- [ ] **Plugins**: Plugin system for custom tools

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vignaraj** - [GitHub Profile](https://github.com/vignaraj)

---

## 📞 Support

- 🌐 **Live Demo**: [vignaraj.dev/ToolMaster](https://vignaraj.dev/ToolMaster/)
- 🐛 **Issues**: [GitHub Issues](https://github.com/vignaraj/ToolMaster/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/vignaraj/ToolMaster/discussions)

---

<div align="center">
  
  **⭐ Star this repository if you find it helpful!**
  
  *Built with ❤️ using modern web technologies*
  
  ![Built with Love](https://forthebadge.com/images/badges/built-with-love.svg)
  ![Made with TypeScript](https://forthebadge.com/images/badges/made-with-typescript.svg)
  
</div>
