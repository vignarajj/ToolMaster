# ToolMaster App

## Overview

ToolMaster is a web-based utility application built with React, TypeScript, and Express.js. It provides a comprehensive suite of developer and productivity tools including text analysis, password generation, QR code creation, color management, and more. The application is designed to work entirely client-side with no external dependencies or user authentication required.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React 18 with TypeScript and follows a component-based architecture:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state, TanStack Query for server state
- **Theme System**: Custom theme provider supporting light/dark modes with CSS variables
- **Component Structure**: Modular components with separation between pages, layout, and UI components

### Backend Architecture
The backend uses a minimal Express.js setup:

- **Server Framework**: Express.js with TypeScript
- **Development**: Vite for development server with HMR support
- **Build Process**: ESBuild for production bundling
- **Storage**: In-memory storage only (no persistent database)
- **API**: Minimal REST endpoints for health checks

### Design System
- **Primary Color**: Orange (#d45202) for branding and accents
- **Component Library**: shadcn/ui with Radix UI primitives
- **Typography**: Inter font family
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Icons**: Lucide React for consistent iconography

### Application Structure
The application is organized into distinct tool modules:

1. **Text Tools**:
   - Text Counter: Real-time character, word, and reading time analysis
   - Text Converter: Multiple text transformation utilities
   - Base64 Encoder/Decoder: Encoding and decoding utilities

2. **Security Tools**:
   - Password Generator: Customizable secure password creation

3. **Visual Tools**:
   - QR Code Generator: Creates QR codes for various content types
   - Color Picker: Color selection and palette management

### Key Architectural Decisions

**Client-Side Processing**: All tools operate entirely in the browser without server-side processing, ensuring privacy and reducing server load.

**No Authentication**: The application operates without user accounts or authentication, making it immediately accessible.

**Local Storage**: User preferences and data are stored in browser localStorage for persistence across sessions.

**Type Safety**: Full TypeScript implementation ensures compile-time error detection and better developer experience.

**Modular Design**: Each tool is implemented as a separate page component with shared utilities and UI components.

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **TypeScript**: Full TypeScript support for type safety
- **Vite**: Development server and build tool
- **Express.js**: Minimal backend server

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Utility Libraries
- **TanStack Query**: Server state management
- **Wouter**: Lightweight routing
- **clsx & tailwind-merge**: Conditional CSS class management
- **date-fns**: Date manipulation utilities

### Development Tools
- **ESBuild**: Fast JavaScript bundler
- **PostCSS**: CSS processing with Autoprefixer
- **Replit Plugins**: Development environment integration

### Database (Future Consideration)
- **Drizzle ORM**: Type-safe SQL query builder (configured but not actively used)
- **PostgreSQL**: Database configuration present for potential future use
- **Neon Database**: Serverless PostgreSQL provider integration ready

The application is designed to be fully functional without a database, but the infrastructure is prepared for future enhancements that might require persistent storage.