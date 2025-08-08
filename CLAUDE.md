# Tenant Management System

## Project Overview

A comprehensive full-stack tenant management application built with modern web technologies. This system helps property managers efficiently manage properties, units, tenants, and billing operations through an intuitive web interface.

## Architecture

### 📁 Project Structure
```
tenant-final/
├── backend/          # NestJS API server
├── frontend/         # React + TypeScript UI
├── lib/             # Shared TypeScript models/types
└── start-postgres.sh # Database setup script
```

### 🏗️ Technology Stack

**Backend (NestJS)**
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT with Passport
- **Validation**: Class Validator + Yup
- **Security**: bcrypt for password hashing

**Frontend (React)**
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: TanStack Query + Nanostores
- **Forms**: Formik + Yup validation
- **Routing**: React Router v7
- **Internationalization**: react-i18next (English + French)
- **Modals**: @ebay/nice-modal-react

**Shared Library**
- **Models**: TypeScript interfaces shared between frontend/backend
- **Types**: Property, Unit, Tenant, User, Bill entities

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Development Setup

1. **Install dependencies**:
```bash
# Install all dependencies
npm install

# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install

# Shared lib
cd lib && npm install
```

2. **Environment Setup**:
```bash
# Backend (.env)
JWT_SECRET=your-secret-key-here
DATABASE_URL=./db.sqlite
```

3. **Start Development Servers**:
```bash
# Backend (Port 3000)
cd backend && npm run start:dev

# Frontend (Port 5173) 
cd frontend && npm run dev
```

4. **Build for Production**:
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## 🏢 Core Features

### 🔐 Authentication System
- **User Registration**: Email-based signup with validation
- **Login/Logout**: JWT-based authentication
- **Password Reset**: Secure token-based password recovery
- **Protected Routes**: Guard-protected API endpoints and frontend routes

### 🏘️ Property Management
- **CRUD Operations**: Create, read, update, delete properties
- **Address Management**: Comprehensive address fields with conditional validation
- **Property Types**: Support for multiple property types (Apartment Building, Single Family Home, Condo, Townhouse, Duplex)
- **Owner Association**: Link properties to user accounts

### 🏠 Unit Management  
- **Unit Details**: Unit number, bedrooms, bathrooms, square footage
- **Occupancy Tracking**: Real-time occupancy status
- **Property Association**: Link units to parent properties
- **Tenant Assignment**: Associate tenants with specific units

### 👥 Tenant Management
- **Personal Information**: Contact details, personal data
- **Financial Terms**: Monthly rent, additional charges
- **Lease Tracking**: Entry dates, lease terms, security deposits
- **Status Management**: Active/inactive tenant status
- **Unit Assignment**: Associate tenants with specific units

### 💰 Billing System
- **Automated Generation**: Monthly bill creation via cron jobs
- **Proration**: First-month rent calculations
- **Payment Tracking**: Mark bills as paid/unpaid
- **Tenant History**: Complete billing history per tenant

### 📊 Dashboard & Analytics
- **Property Overview**: Total properties, occupancy rates
- **Financial Summary**: Revenue tracking, outstanding bills
- **Tenant Statistics**: Active tenants, recent activities
- **Quick Actions**: Rapid access to common tasks

## 🛠️ Development Guidelines

### Code Standards
```bash
# Linting
npm run lint        # Backend
npm run lint        # Frontend

# Testing
npm run test        # Backend unit tests
npm run test:e2e    # Frontend E2E tests (Playwright)
```

### API Development
- **Base URL**: `http://localhost:3000`
- **Authentication**: Bearer token in Authorization header
- **Content Type**: `application/json`
- **Error Handling**: Consistent HTTP status codes with descriptive messages

### Frontend Development
- **Component Structure**: Reusable UI components in `/components/ui/`
- **Form Handling**: Use FormField component for consistent styling
- **State Management**: TanStack Query for server state, Nanostores for client state
- **Styling**: Tailwind classes with Radix UI primitives
- **Internationalization**: Use `t()` function for all user-facing text

### Database Operations
```bash
# Generate migrations
npx drizzle-kit generate

# Apply migrations  
npx drizzle-kit migrate

# View database
npx drizzle-kit studio
```

## 🌐 API Endpoints

### Authentication (`/auth`)
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication  
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation

### Properties (`/properties`)
- `GET /properties` - List all properties
- `POST /properties` - Create new property
- `GET /properties/:id` - Get property details
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

### Units (`/units`)
- `GET /units` - List all units
- `POST /units` - Create new unit
- `GET /units/:id` - Get unit details
- `PUT /units/:id` - Update unit
- `DELETE /units/:id` - Delete unit

### Tenants (`/tenants`)
- `GET /tenants` - List all tenants
- `POST /tenants` - Create new tenant
- `GET /tenants/:id` - Get tenant details  
- `PUT /tenants/:id` - Update tenant
- `DELETE /tenants/:id` - Delete tenant

### Bills (`/bills`)
- `GET /bills/tenant/:tenantId` - Get tenant bills
- `POST /bills/generate` - Generate monthly bills
- `PUT /bills/:id/pay` - Mark bill as paid

### Dashboard (`/dashboard`)
- `GET /dashboard/stats` - Get dashboard statistics

### User Profile (`/user`)
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

## 🎨 UI Components

### Reusable Components
- **FormField**: Consistent form input with validation
- **Layout**: Application shell with navigation
- **Modals**: Property, Unit, Tenant creation modals
- **Cards**: Property display cards
- **Buttons**: Consistent button styling
- **Select**: Dropdown components
- **Inputs**: Form input components

### Styling System
- **Design Tokens**: Consistent colors, spacing, typography
- **Responsive**: Mobile-first responsive design
- **Accessibility**: ARIA compliant components
- **Themes**: Support for light/dark modes (via CSS variables)

## 🌍 Internationalization

### Supported Languages
- **English** (en) - Default
- **French** (fr) - Complete translation

### Translation Keys Structure
```typescript
{
  common: { loading, error, yes, no },
  form: { required, invalidEmail, submit },
  property: { types, form, validation },
  tenant: { fields, status, actions },
  unit: { information, details },
  auth: { login, signup, validation },
  address: { street, city, state, zipCode, country }
}
```

### State-Specific Validation
- **US Addresses**: State field required for US/USA/United States
- **International**: State field optional for non-US addresses

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Route Protection**: Guard-protected endpoints
- **Token Expiration**: Configurable token lifetime

### Validation
- **Input Sanitization**: Server-side validation with class-validator
- **Type Safety**: TypeScript throughout the stack
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM

## 📦 Deployment

### Environment Variables
```bash
# Backend
JWT_SECRET=production-secret-key
DATABASE_URL=./production.sqlite
NODE_ENV=production

# Frontend  
VITE_API_URL=https://api.yourdomain.com
```

### Build Commands
```bash
# Backend build
cd backend && npm run build && npm run start:prod

# Frontend build
cd frontend && npm run build && npm run preview
```

### Docker Support
```dockerfile
# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]

# Frontend Dockerfile  
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
```

## 🧪 Testing

### Backend Testing
- **Unit Tests**: Jest with NestJS testing utilities
- **E2E Tests**: Supertest for API endpoint testing
- **Coverage**: Jest coverage reports

### Frontend Testing
- **E2E Tests**: Playwright for full user workflows
- **Component Tests**: React Testing Library (to be added)
- **Authentication Flow**: Complete login/logout testing

## 🔧 Common Tasks

### Adding New Property Types
1. Update `PropertyType` enum in `/lib/src/property.ts`
2. Add translations in `/frontend/src/i18n.ts`
3. Update validation schemas as needed

### Creating New Form Components
1. Use the reusable `FormField` component from `/frontend/src/components/ui/form-field.tsx`
2. Follow the pattern in existing forms (PropertyForm, UnitForm, TenantForm)
3. Add proper validation with Yup schemas

### Adding New API Endpoints
1. Create/update DTOs in relevant module
2. Add controller method with decorators
3. Implement service method with database operations
4. Add frontend API client method
5. Create React Query hook for data fetching

### Database Schema Changes
1. Update Drizzle schema in `/backend/src/database/schema.ts`
2. Generate migration: `npx drizzle-kit generate`
3. Apply migration: `npx drizzle-kit migrate`
4. Update TypeScript interfaces in `/lib/src/`

## 🐛 Troubleshooting

### Common Issues

**JWT Authentication Errors (401)**
- Verify JWT secret consistency between auth module and strategy
- Check token format: `Bearer <token>`
- Ensure JWT strategy is properly imported in modules

**Database Connection Issues**
- Check SQLite file permissions
- Verify database path in environment variables
- Run migrations if tables are missing

**Form Focus Issues**
- Ensure FormField component is outside render function
- Use proper onBlur handlers for validation

**CORS Issues**
- Configure CORS in NestJS main.ts
- Check frontend API base URL configuration

### Performance Optimization
- **Database**: Add indexes for frequently queried fields
- **Frontend**: Implement React.memo for expensive components
- **API**: Use pagination for large datasets
- **Caching**: Implement Redis for session storage in production

## 📝 Contributing

### Pull Request Process
1. Create feature branch from main
2. Follow existing code patterns and conventions
3. Add/update tests for new functionality
4. Update documentation as needed
5. Ensure all tests pass before submitting

### Code Review Checklist
- [ ] TypeScript strict mode compliance
- [ ] Proper error handling
- [ ] Input validation and sanitization  
- [ ] Responsive design
- [ ] Accessibility compliance
- [ ] Internationalization support
- [ ] Test coverage for new features

---

*This project uses modern full-stack technologies to deliver a robust, scalable tenant management solution. The modular architecture supports easy maintenance and future enhancements.*