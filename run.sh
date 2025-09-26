#!/bin/bash

# REST Express Application Local Development Script
# This script sets up and runs the application in development mode

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="REST Express"
NODE_VERSION="18"
REQUIRED_PORTS=(3000 5173)

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Port $port is already in use. Please stop the service using this port."
        return 1
    fi
    return 0
}

# Function to check Node.js version
check_node_version() {
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js $NODE_VERSION or higher."
        exit 1
    fi

    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt "$NODE_VERSION" ]; then
        print_error "Node.js version $NODE_VERSION or higher is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Function to check if npm is installed
check_npm() {
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm $(npm --version) is installed"
}

# Function to check if .env file exists
check_env_file() {
    if [ ! -f "$SCRIPT_DIR/.env" ]; then
        print_warning ".env file not found. Creating a template .env file..."
        
        cat > "$SCRIPT_DIR/.env" << EOF
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Application Configuration
NODE_ENV=development
SESSION_SECRET=your-secret-key-here-change-this-in-production

# Optional: Add your own configuration variables
# API_KEY=your-api-key
# EXTERNAL_SERVICE_URL=https://api.example.com
EOF
        
        print_warning "Template .env file created. Please update it with your actual configuration values."
        print_warning "Important: Update the SESSION_SECRET with a secure, random value."
        print_warning "           Update the DATABASE_URL with your actual PostgreSQL connection string."
        
        read -p "Press Enter after you've updated the .env file, or 'q' to quit: " response
        if [ "$response" = "q" ]; then
            exit 0
        fi
    else
        print_success ".env file found"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Checking and installing dependencies..."
    
    if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
        print_status "Installing npm dependencies..."
        npm install
        print_success "Dependencies installed successfully"
    else
        print_status "Dependencies already installed"
    fi
}

# Function to check database connection
check_database() {
    print_status "Checking database configuration..."
    
    # Check if DATABASE_URL is set
    if ! grep -q "DATABASE_URL=" "$SCRIPT_DIR/.env"; then
        print_error "DATABASE_URL is not set in .env file"
        exit 1
    fi
    
    # Try to push database schema
    print_status "Attempting to sync database schema..."
    if npm run db:push; then
        print_success "Database schema synced successfully"
    else
        print_warning "Database sync failed. Please check your DATABASE_URL and ensure PostgreSQL is running."
        print_warning "You can manually run 'npm run db:push' after fixing the database connection."
        read -p "Press Enter to continue anyway, or 'q' to quit: " response
        if [ "$response" = "q" ]; then
            exit 0
        fi
    fi
}

# Function to check required ports
check_ports() {
    print_status "Checking required ports..."
    
    for port in "${REQUIRED_PORTS[@]}"; do
        if ! check_port $port; then
            print_error "Port $port is not available. Please stop the service using this port."
            exit 1
        fi
        print_success "Port $port is available"
    done
}

# Function to start the application
start_application() {
    print_status "Starting $PROJECT_NAME application..."
    print_status "Frontend will be available at: http://localhost:5173"
    print_status "Backend API will be available at: http://localhost:3000"
    print_status "Press Ctrl+C to stop the application"
    echo ""
    
    # Start the development server
    npm run dev
}

# Function to show help
show_help() {
    cat << EOF
$PROJECT_NAME Local Development Script

USAGE: ./run.sh [OPTIONS]

OPTIONS:
    -h, --help          Show this help message
    --check-deps       Only check dependencies and exit
    --setup-db         Only setup database and exit
    --install-only     Only install dependencies and exit
    --skip-db-check    Skip database connection check
    --skip-port-check  Skip port availability check

EXAMPLES:
    ./run.sh                    # Full setup and start application
    ./run.sh --skip-db-check    # Start without checking database
    ./run.sh --setup-db         # Only setup database
    ./run.sh --check-deps       # Only check dependencies

REQUIREMENTS:
    - Node.js $NODE_VERSION or higher
    - npm package manager
    - PostgreSQL database
    - Available ports: 3000, 5173

ENVIRONMENT:
    The script expects a .env file in the project root with at least:
    - DATABASE_URL: PostgreSQL connection string
    - NODE_ENV: Environment (development/production)
    - SESSION_SECRET: Secret key for sessions

TROUBLESHOOTING:
    - If ports are in use: Stop the services using those ports
    - If database fails: Check PostgreSQL is running and DATABASE_URL is correct
    - If dependencies fail: Try 'npm install' manually
    - For more help: Check the README.md file

EOF
}

# Main script execution
main() {
    echo ""
    echo "🚀 $PROJECT_NAME Local Development Script"
    echo "=========================================="
    echo ""
    
    # Parse command line arguments
    SKIP_DB_CHECK=false
    SKIP_PORT_CHECK=false
    CHECK_DEPS_ONLY=false
    SETUP_DB_ONLY=false
    INSTALL_ONLY=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            --skip-db-check)
                SKIP_DB_CHECK=true
                shift
                ;;
            --skip-port-check)
                SKIP_PORT_CHECK=true
                shift
                ;;
            --check-deps)
                CHECK_DEPS_ONLY=true
                shift
                ;;
            --setup-db)
                SETUP_DB_ONLY=true
                shift
                ;;
            --install-only)
                INSTALL_ONLY=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Check system requirements
    print_status "Checking system requirements..."
    check_node_version
    check_npm
    print_success "System requirements met"
    echo ""
    
    # Check environment
    check_env_file
    echo ""
    
    # Install dependencies
    install_dependencies
    echo ""
    
    # Special modes
    if [ "$INSTALL_ONLY" = true ]; then
        print_success "Dependencies installation completed"
        exit 0
    fi
    
    # Check ports
    if [ "$SKIP_PORT_CHECK" = false ]; then
        check_ports
        echo ""
    fi
    
    # Database setup
    if [ "$SKIP_DB_CHECK" = false ]; then
        check_database
        echo ""
    fi
    
    if [ "$SETUP_DB_ONLY" = true ]; then
        print_success "Database setup completed"
        exit 0
    fi
    
    if [ "$CHECK_DEPS_ONLY" = true ]; then
        print_success "All dependencies and checks passed"
        exit 0
    fi
    
    # Start the application
    start_application
}

# Run main function
main "$@"
