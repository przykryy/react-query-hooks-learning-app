# Master React Hooks & TanStack Query

An **interactive learning platform** designed to help developers master **React Hooks** and **TanStack Query** through hands-on tutorials, live code examples, and practical exercises. This project provides a comprehensive and engaging way to improve your React skills.

---

## Features

### Frontend
- **Interactive Tutorials**: Learn React Hooks and TanStack Query concepts with step-by-step explanations.
- **Live Code Examples**: Edit and run code directly in your browser with real-time previews.
- **Modern UI**: Built with **TailwindCSS** and **Radix UI** for a clean and responsive design.
- **React Query Integration**: Master data fetching and state synchronization with TanStack Query.

### Backend
- **RESTful API**: Built with **Express** and **TypeScript**.
- **Database Integration**: Powered by **Drizzle ORM** and **PostgreSQL**.
- **Authentication**: Session management with **express-session** and **Passport.js.
- **Swagger Documentation**: Comprehensive API documentation at `/api/docs`.

---

## Why Learn With Us?

- **Interactive Code Examples**: Edit and run code directly in your browser with real-time previews.
- **Comprehensive Tutorials**: Learn concepts with step-by-step explanations and practical examples.
- **Knowledge Testing**: Reinforce learning with quizzes and hands-on challenges after each module.

---

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js version **18.x** or higher installed.
- **PostgreSQL**: A running PostgreSQL instance for the backend.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/react-hooks-tanstack-query.git
   cd react-hooks-tanstack-query
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run the database migrations:

   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Testing

The project uses Jest for testing. To run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

### API Documentation

Once the server is running, visit `/api/docs` to view the Swagger documentation for the API endpoints.

---

## Project Structure

```
├── client/           # Frontend React application
├── server/           # NestJS backend
│   ├── src/
│   │   ├── users/    # User management module
│   │   ├── progress/ # Progress tracking module
│   │   ├── quiz/     # Quiz management module
│   │   ├── common/   # Shared utilities and types
│   │   └── database/ # Database configuration
│   └── test/         # Test files
├── shared/           # Shared types and schemas
└── docs/            # Documentation
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
