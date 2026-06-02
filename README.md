# CMA Website

A full-stack web application built with Laravel (backend) and React (frontend).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup (Laravel)](#backend-setup-laravel)
- [Frontend Setup (React)](#frontend-setup-react)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Contributing](#contributing)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Backend Requirements
- PHP 8.2 or higher
- Composer
- MySQL or compatible database
- Node.js 16+ and npm (for frontend assets)

### Frontend Requirements
- Node.js 16 or higher
- npm or yarn

## Project Structure

```
CMA-Website/
├── backend/                 # Laravel API application
│   ├── app/                # Application logic
│   ├── config/             # Configuration files
│   ├── database/           # Migrations and seeders
│   ├── routes/             # API routes
│   ├── storage/            # File storage
│   ├── tests/              # Test files
│   ├── composer.json       # PHP dependencies
│   ├── .env.example        # Environment variables template
│   └── artisan             # Laravel CLI
├── frontend/               # React application
│   ├── src/               # React components and pages
│   ├── public/            # Public assets
│   ├── package.json       # npm dependencies
│   ├── vite.config.js     # Vite configuration
│   └── index.html         # Entry HTML file
└── README.md              # This file
```

## Backend Setup (Laravel)

### 1. Install PHP Dependencies

Navigate to the backend directory and install Composer dependencies:

```bash
cd backend
composer install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the following variables:
- `APP_NAME=CMA`
- `APP_ENV=local` (or production)
- `APP_DEBUG=true` (set to false in production)
- `APP_KEY=` (generate with: `php artisan key:generate`)
- `DB_CONNECTION=mysql`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_DATABASE=cma_website`
- `DB_USERNAME=root`
- `DB_PASSWORD=`

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Run Database Migrations

```bash
php artisan migrate
```

### 5. (Optional) Seed the Database

```bash
php artisan db:seed
```

### 6. Install Node Dependencies (for frontend assets)

```bash
npm install
```

### 7. Build Frontend Assets

```bash
npm run build
```

## Frontend Setup (React)

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration (if needed)

Create a `.env` file in the frontend directory if API endpoints need to be configured:

```
VITE_API_URL=http://localhost:8000
```

## Running the Application

### Development Mode

#### Terminal 1 - Backend (Laravel)

```bash
cd backend
php artisan serve
```

This will start the Laravel development server at `http://localhost:8000`

#### Terminal 2 - Frontend (React)

```bash
cd frontend
npm run dev
```

This will start the Vite development server at `http://localhost:5173`

### Production Build

#### Backend

```bash
cd backend
php artisan config:cache
php artisan route:cache
```

#### Frontend

```bash
cd frontend
npm run build
```

The built files will be in the `dist/` directory.

## Environment Variables

### Backend (.env)
Key environment variables for the backend:

```env
APP_NAME=CMA
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_KEY=

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cma_website
DB_USERNAME=root
DB_PASSWORD=

MAIL_DRIVER=smtp
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null

SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

### Frontend (.env)
Key environment variables for the frontend:

```env
VITE_API_URL=http://localhost:8000
```

## Database Setup

### Creating the Database

If using MySQL:

```bash
mysql -u root -p
CREATE DATABASE cma_website;
EXIT;
```

Or use a database management tool like phpMyAdmin or MySQL Workbench.

### Running Migrations

```bash
cd backend
php artisan migrate
```

### Available Tables

The application includes migrations for the following tables:
- `users` - User accounts and authentication
- `announcements` - Announcements and notices
- `applications` - Application submissions
- `bookings` - Booking records
- `bungalow_rooms` - Bungalow/room inventory
- `citizen_submissions` - Citizen submissions
- `complaints` - Complaint tracking
- `condominiums` - Condominium information
- `documents` - Document storage
- `feedback` - User feedback
- `hero_slides` - Homepage hero section
- `leaders` - Leader/staff information
- `news_events` - News and event posts
- `projects` - Project information
- `vacancies` - Job vacancies

## API Routes

The API routes are defined in `backend/routes/api.php`. All API endpoints are prefixed with `/api/`.

## Troubleshooting

### Common Issues

**Laravel: "No application encryption key has been specified"**
```bash
cd backend
php artisan key:generate
```

**React: Module not found errors**
```bash
cd frontend
npm install
```

**Database connection error**
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure the database exists

**Port already in use**
- For Laravel: `php artisan serve --port=8001`
- For React: `npm run dev -- --port 5174`

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or open an issue on GitHub.
# CMA-Website
