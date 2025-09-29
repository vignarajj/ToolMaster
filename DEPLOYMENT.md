# ToolMaster Deployment Guide

This guide covers various deployment options for the ToolMaster application.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
./run.sh --skip-db-check
```

The application will be available at:
- Frontend: http://localhost:5173 (development) or http://localhost:3001
- Backend API: http://localhost:3000

### Production
```bash
# Build the application
npm run build

# Start production server
NODE_ENV=production PORT=3000 npm start
```

## 🐳 Docker Deployment (Recommended)

### Using Docker Compose (Full Stack)
```bash
# Clone the repository
git clone <repository-url>
cd ToolMaster

# Create production environment file
cp .env.production .env

# Update environment variables
# Edit .env with your production values

# Start the full stack
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Using Docker (Application Only)
```bash
# Build the image
docker build -t toolmaster .

# Run the container
docker run -d \
  --name toolmaster \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e SESSION_SECRET=your-secure-secret \
  -e DATABASE_URL=your-database-url \
  toolmaster
```

## ☁️ Cloud Deployment

### Vercel (Frontend + API)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# - DATABASE_URL
# - SESSION_SECRET
# - NODE_ENV=production
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway project new
railway up

# Set environment variables
railway variables:set DATABASE_URL=your-database-url
railway variables:set SESSION_SECRET=your-secret
railway variables:set NODE_ENV=production
```

### Render
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables:
   - `DATABASE_URL`
   - `SESSION_SECRET` 
   - `NODE_ENV=production`

### DigitalOcean App Platform
1. Create new app from GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`
3. Add environment variables
4. Deploy

## 🗄️ Database Setup

### PostgreSQL (Recommended)
```bash
# Create database
createdb toolmaster_prod

# Set environment variable
export DATABASE_URL="postgresql://user:password@localhost:5432/toolmaster_prod"

# Run migrations (if any)
npm run db:push
```

### Neon Database (Cloud PostgreSQL)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Set `DATABASE_URL` environment variable

### Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy connection string
4. Set `DATABASE_URL` environment variable

## 🔒 Security Configuration

### Environment Variables
```env
# Required
NODE_ENV=production
DATABASE_URL=your-database-url
SESSION_SECRET=your-secure-random-secret-key

# Security
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# Optional
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com
```

### SSL/TLS
- Use HTTPS in production
- Enable `COOKIE_SECURE=true`
- Configure proper CORS origins

### Database Security
- Use connection pooling
- Enable SSL for database connections
- Use environment variables for credentials
- Regular backups

## 🔧 Performance Optimization

### Server Configuration
```bash
# Use PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name toolmaster

# Enable startup script
pm2 startup
pm2 save
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
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

## 📊 Monitoring

### Health Checks
The application includes a health check endpoint at `/health`:
```bash
curl http://localhost:3000/health
```

### Logging
Set `LOG_LEVEL` environment variable:
- `error` (production)
- `warn` (staging)
- `info` (development)
- `debug` (development debug)

### Metrics
Consider adding monitoring with:
- New Relic
- DataDog
- Prometheus + Grafana

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy to production
      # Add your deployment steps here
      run: echo "Deploy to your platform"
```

## 🛠️ Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT environment variable
2. **Database connection failed**: Check DATABASE_URL format
3. **Build failures**: Ensure all dependencies are installed
4. **Permission denied**: Check file permissions and user privileges

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start

# Check application health
curl http://localhost:3000/health

# View logs
tail -f logs/app.log
```

## 📝 Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Security audit: `npm audit`
- Database backups
- Log rotation
- SSL certificate renewal

### Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart application
pm2 restart toolmaster
```

## 📞 Support
For deployment issues:
1. Check this documentation
2. Review application logs
3. Create an issue on GitHub
4. Contact the development team