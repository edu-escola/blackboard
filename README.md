# 🎓 EduEscola - School Management System

A modern React-based school management application built with TypeScript, Vite, and shadcn/ui.

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blackboard
```

2. Install dependencies:

```bash
npm install
```

## 🏃‍♂️ How to run

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Production

```bash
npm run build
npm run preview
```

## 🏗️ Project structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── shared/       # Shared components (AppShell, DataTable, etc.)
│   └── ...           # Other components
├── pages/            # Application pages
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## 🔧 Available scripts

- `npm run dev` - Runs the development server with hot reload
- `npm run build` - Builds the application for production
- `npm run build:dev` - Builds the application in development mode
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint to check code quality

## 🛠️ Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icon library

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

## 📱 Responsive Design

The application is fully responsive and works on desktop, tablet, and mobile devices.

## 🔐 Authentication

The application includes a login system with role-based access control for administrators and professors.
