# ToolMaster - Professional Developer Tools Suite

A modern full-stack web application built with React, TypeScript, Express, and PostgreSQL. ToolMaster provides a comprehensive suite of developer tools with a beautiful, responsive interface featuring a custom logo and optimized mobile navigation.

## ✨ New Features

- **🎨 Beautiful Custom Logo**: Professional gradient-based logo with tool icons
- **📱 Mobile-First Navigation**: Hamburger menu for mobile, horizontal navigation for desktop
- **🎯 Responsive Header**: Adaptive layout that works seamlessly across all devices
- **⚡ Production Ready**: Optimized build with Docker support and deployment configurations

## 🚀 Features

- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Custom Branding**: Beautiful logo design with tool-themed iconography
- **Dark Theme**: Complete dark/light theme support with persistence
- **Responsive Design**: Mobile-first responsive design that works across all devices
- **Mobile Navigation**: Hamburger menu with smooth animations and categorized tools
- **Desktop Navigation**: Clean horizontal navigation bar for larger screens
- **Accessibility**: WCAG compliant with proper focus indicators and color contrast
- **Testing**: Comprehensive E2E testing with Playwright
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js based authentication system
- **Real-time**: WebSocket support for real-time features
- **Production Ready**: Docker configuration with multi-stage builds

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

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL
- **Passport.js** for authentication
- **WebSocket** for real-time communication
- **Express Session** for session management

### Testing
- **Playwright** for E2E testing
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile device testing
- Visual regression testing

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for fast bundling
- **PostCSS** for CSS processing
- **Drizzle Kit** for database migrations

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Neon Database** (recommended for production)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rest-express
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NODE_ENV=development
SESSION_SECRET=your-secret-key-here
```

### 4. Database Setup

```bash
# Generate database migrations
npm run db:push

# Or if you have existing migrations
npm run db:migrate
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Or use the shell script (recommended)
./run.sh --skip-db-check
```

The application will be available at:
- **Frontend**: http://localhost:5173 (development) or configured port
- **Backend API**: http://localhost:3000

## 🐳 Docker Deployment

### Quick Start with Docker Compose
```bash
# Create and configure environment
cp .env.production .env
# Edit .env with your database credentials

# Start the full stack
docker-compose up -d

# Check status
docker-compose logs -f toolmaster
```

### Build and Run Manually
```bash
# Build the Docker image
docker build -t toolmaster .

# Run the container
docker run -d \
  --name toolmaster \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e SESSION_SECRET=your-secure-secret \
  toolmaster
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright tests/theme-and-responsiveness.spec.js

# Run tests in headed mode (visible browser)
npx playwright tests/theme-and-responsiveness.spec.js --headed

# Run tests with UI mode
npx playwright tests/theme-and-responsiveness.spec.js --ui
```

### Test Configuration

The test suite includes:
- **Cross-browser testing**: Chrome, Firefox, Safari
- **Mobile testing**: Pixel 5, iPhone 12
- **Theme testing**: Dark/light theme validation
- **Responsive testing**: Various screen sizes
- **Accessibility testing**: Color contrast and focus indicators

### Test Reports

After running tests, HTML reports are generated in the `playwright-report` directory:
```bash
# Open test report
npx playwright show-report
```

## 🏗️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # Type checking

# Database
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate TypeScript types

# Testing
npm test             # Run Playwright tests
```

### Project Structure

```
rest-express/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   ├── index.html         # HTML entry point
│   └── vite.config.ts     # Vite configuration
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Storage configuration
│   └── vite.ts           # Vite middleware
├── shared/                # Shared utilities and types
│   └── schema.ts         # Database schema
├── tests/                 # Playwright test files
│   └── theme-and-responsiveness.spec.js
├── migrations/            # Database migrations
├── dist/                  # Build output
├── attached_assets/       # Static assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── drizzle.config.ts      # Drizzle ORM configuration
├── playwright.config.js   # Playwright testing configuration
└── README.md             # This file
```

### Development Workflow

1. **Feature Development**
   ```bash
   # Start development server
   npm run dev
   
   # Make changes to frontend or backend
   # Changes will hot-reload automatically
   ```

2. **Database Changes**
   ```bash
   # Update schema in shared/schema.ts
   # Generate migration
   npm run db:push
   ```

3. **Testing**
   ```bash
   # Run tests to ensure no regressions
   npm test
   ```

4. **Building**
   ```bash
   # Build for production
   npm run build
   ```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
SESSION_SECRET=your-production-secret-key
# Add any other production-specific variables
```

### Deployment Platforms

#### GitHub Pages (Free Static Hosting)

GitHub Pages is perfect for hosting the frontend of your ToolMaster application for free. The backend API will need to be hosted separately.

**Setup Instructions:**

1. **Enable GitHub Pages in Repository Settings**
   - Go to your repository on GitHub
   - Click Settings → Pages
   - Source: GitHub Actions
   - Save

2. **Automatic Deployment**
   - The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically deploy your frontend to GitHub Pages when you push to the main branch
   - Your site will be available at: `https://vignaraj.dev/ToolMaster/`

3. **Manual Deployment (Optional)**
   ```bash
   # Build for GitHub Pages
   npm run build:pages
   
   # The built files will be in the dist/ folder
   # You can manually deploy these to GitHub Pages
   ```

**Note:** GitHub Pages only hosts static files. The backend API (Express server, database, etc.) will need to be deployed separately to services like Railway, Render, or Heroku.

#### Vercel (Recommended for Frontend)

1. **Frontend Deployment**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy frontend
   vercel --prod
   ```

2. **Backend Deployment**
   - Deploy backend to a Node.js hosting service (Railway, Render, Heroku)
   - Set up PostgreSQL database (Neon, Supabase, or traditional PostgreSQL)
   - Configure environment variables

#### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t rest-express .
docker run -p 3000:3000 rest-express
```

#### Traditional Server Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload to server**
   ```bash
   # Upload dist folder and package.json
   scp -r dist/ package.json user@server:/path/to/app
   ```

3. **Install dependencies and start**
   ```bash
   ssh user@server
   cd /path/to/app
   npm ci --only=production
   npm start
   ```

### Database Deployment

#### Neon Database (Recommended)

1. **Create a Neon project**
   ```bash
   # Install Neon CLI
   npm install -g neonctl
   
   # Create project
   neon projects create --name rest-express
   ```

2. **Get connection string**
   ```bash
   neon connection-string --project-id your-project-id
   ```

3. **Set environment variable**
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

4. **Run migrations**
   ```bash
   npm run db:push
   ```

#### Traditional PostgreSQL

1. **Create database**
   ```sql
   CREATE DATABASE rest_express;
   CREATE USER rest_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE rest_express TO rest_user;
   ```

2. **Run migrations**
   ```bash
   npm run db:push
   ```

### PM2 Process Management (Recommended for Production)

```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start dist/index.js --name "rest-express"

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### Nginx Configuration (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database URL format
   echo $DATABASE_URL
   
   # Test database connection
   npm run db:push
   ```

2. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Or use different port
   PORT=3001 npm run dev
   ```

3. **TypeScript Errors**
   ```bash
   # Check types
   npm run check
   
   # Clear TypeScript cache
   rm -rf .tsbuildinfo
   ```

4. **Test Failures**
   ```bash
   # Run tests in debug mode
   npx playwright tests/theme-and-responsiveness.spec.js --debug
   
   # Check test server is running
   curl http://localhost:5173
   ```

### Performance Optimization

1. **Build Optimization**
   ```bash
   # Analyze bundle size
   npm install -g source-map-explorer
   source-map-explorer dist/assets/*.js
   ```

2. **Database Optimization**
   ```bash
   # Add indexes to frequently queried columns
   # Check query performance with EXPLAIN ANALYZE
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Ensure accessibility compliance
- Test on multiple browsers and devices
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing React framework
- **Vite Team** for the lightning-fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for the accessible component library
- **Playwright Team** for the excellent testing framework
- **Drizzle Team** for the type-safe ORM

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test files for usage examples

---

**Built with ❤️ using modern web technologies**
