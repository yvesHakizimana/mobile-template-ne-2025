# Backend Mobile Template NE

A modern, secure, and scalable backend template built with Node.js, Express.js, and TypeScript. This template includes authentication, email services, rate limiting, and a robust error handling system.

## Features

- 🔐 **Authentication System**
  - JWT-based authentication
  - Password reset functionality
  - Email verification
  - Secure password change

- 📨 **Email Service**
  - Template-based emails using Pug
  - Password reset emails
  - Account verification emails

- 🛡️ **Security**
  - Rate limiting with Arcjet
  - Helmet for security headers
  - CORS configuration
  - Password hashing with bcrypt

- 🗄️ **Database**
  - Prisma ORM integration
  - Migration support
  - Type-safe database operations

- 🚀 **Performance**
  - Redis caching
  - Response compression
  - Singleton pattern implementation

- ⚙️ **Developer Experience**
  - TypeScript for type safety
  - Hot reloading in development
  - Modular architecture
  - Comprehensive error handling
  - API response standardization

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd backend-mobile-template-ne
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRATION="24h"

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=

# Arcjet (Rate Limiting)
ARCJET_KEY=
```

4. Generate Prisma client:
```bash
npm run generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

## Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
├── core/                  # Core functionality
│   ├── config/           # Configuration files
│   ├── exceptions/       # Custom exceptions
│   ├── middleware/       # Express middleware
│   ├── prisma/          # Database schema and migrations
│   ├── templates/       # Email templates
│   ├── types/           # Type definitions
│   └── utils/           # Utility functions
└── modules/              # Feature modules
    ├── auth/            # Authentication
    ├── email/           # Email service
    ├── todos/           # Todo features
    └── users/           # User management
```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm run generate` - Generate Prisma client

## API Documentation

### Authentication Endpoints

- POST `/auth/register` - Register a new user
- POST `/auth/login` - User login
- POST `/auth/forgot-password` - Request password reset
- POST `/auth/reset-password` - Reset password
- POST `/auth/verify-email` - Verify email address

### User Endpoints

- GET `/users/profile` - Get user profile
- PUT `/users/profile` - Update user profile
- POST `/users/change-password` - Change password

### Todo Endpoints

- GET `/todos` - List todos
- POST `/todos` - Create todo
- PUT `/todos/:id` - Update todo
- DELETE `/todos/:id` - Delete todo

## Error Handling

The application implements a centralized error handling system with custom exceptions:

- `BaseException` - Base exception class
- `HttpException` - HTTP-specific exceptions
- `ValidationException` - Data validation errors

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

ISC License

## Author

[Your Name]

---

For more information or support, please [create an issue](repository-issues-url).