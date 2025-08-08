# Backend Functionalities Overview

This document outlines the core functionalities, module structure, and interconnections of the backend application. The aim is to provide a clear understanding of the system's architecture, enabling recreation or significant refactoring without relying on specific database ORM abstractions.

## Core Modules and Their Responsibilities

- **AppModule**: The root module, orchestrating all other modules.
- **DatabaseModule**: Manages the SQLite database connection and provides a service for raw SQL queries.
- **AuthModule**: Handles user authentication, registration, login, and password management.
- **PropertyModule**: Manages property-related operations, including CRUD for properties and their associated units.
- **UnitModule**: Manages individual rental units, including their details and occupancy status.
- **TenantModule**: Manages tenant information, including their personal details, rent, and association with units.
- **BillModule**: Handles the generation and management of monthly bills for tenants.
- **DashboardModule**: Provides aggregated statistics and data for the application dashboard.

## Module Connections and Dependencies

Below is a high-level overview of how modules interact with each other.

- **AppModule** imports all other feature modules (`AuthModule`, `PropertyModule`, `UnitModule`, `TenantModule`, `DashboardModule`, `BillModule`) and the `DatabaseModule`.
- **AuthModule** depends on `DatabaseService` for user data persistence and `JwtModule` for token management.
- **PropertyModule** depends on `DatabaseService` for property data persistence. It also interacts with `UnitService` and `TenantService` for cascading operations (e.g., deleting units and tenants when a property is removed).
- **UnitModule** depends on `DatabaseService` for unit data persistence. It interacts with `PropertyService` to link units to properties.
- **TenantModule** depends on `DatabaseService` for tenant data persistence. It interacts with `UnitService` to update unit occupancy and `PropertyService` (indirectly through UnitService) for related property updates.
- **BillModule** depends on `DatabaseService` for bill data persistence and `TenantService` to retrieve tenant information for bill generation. It also uses `@nestjs/schedule` for cron job scheduling.
- **DashboardModule** depends on `PropertyService`, `TenantService`, and `UnitService` to gather data for its statistics.
- **UserService**: Provides methods for retrieving and updating user profiles.
- **DatabaseService**: A custom service that encapsulates raw SQLite database interactions. It provides `run`, `get`, and `all` methods for executing SQL queries and handles table creation on module initialization.

## Controllers and Their Endpoints

Each controller exposes a set of API endpoints for interacting with the respective services.

### AuthController (`/auth`)
- `POST /auth/signup`: Registers a new user.
- `POST /auth/login`: Authenticates a user and returns an access token.
- `POST /auth/forgot-password`: Initiates the forgot password process.
- `POST /auth/reset-password`: Resets a user's password using a token.

### PropertyController (`/properties`)
- `POST /properties`: Creates a new property.
- `GET /properties`: Retrieves all properties.
- `GET /properties/:id`: Retrieves a single property by ID.
- `PUT /properties/:id`: Updates an existing property.
- `DELETE /properties/:id`: Deletes a property and its associated units and tenants.

### UnitController (`/units`)
- `POST /units`: Creates a new unit.
- `GET /units`: Retrieves all units.
- `GET /units/:id`: Retrieves a single unit by ID.
- `PUT /units/:id`: Updates an existing unit.
- `DELETE /units/:id`: Deletes a unit.

### TenantController (`/tenants`)
- `POST /tenants`: Creates a new tenant.
- `GET /tenants`: Retrieves all tenants.
- `GET /tenants/:id`: Retrieves a single tenant by ID.
- `PUT /tenants/:id`: Updates an existing tenant.
- `DELETE /tenants/:id`: Deletes a tenant.

### BillController (`/bills`)
- `POST /bills/generate`: Manually triggers monthly bill generation.
- `GET /bills/tenant/:tenantId`: Retrieves bills for a specific tenant.
- `GET /bills/:id`: Retrieves a single bill by ID.
- `PUT /bills/:id/pay`: Marks a bill as paid.

### DashboardController (`/dashboard`)
- `GET /dashboard/stats`: Retrieves aggregated statistics for the dashboard.

### UserController (`/user`)
- `GET /user/profile`: Retrieves the profile of the authenticated user.
- `PUT /user/profile`: Updates the profile of the authenticated user.

## Services and Their Responsibilities

Services encapsulate the business logic and interact with the `DatabaseService` to perform data operations.

- **AuthService**: Manages user authentication, including password hashing (bcrypt), JWT token generation and validation, and password reset flows.
- **PropertyService**: Handles CRUD operations for properties. It includes logic for managing associated units and tenants during property deletion.
- **UnitService**: Manages CRUD operations for units. It updates unit occupancy status when a tenant is assigned.
- **TenantService**: Handles CRUD operations for tenants. It updates the associated unit's `tenantIds` and `isOccupied` status when a tenant is created or updated.
- **BillService**: Contains logic for generating monthly bills, including proration for the first month's rent. It uses a cron job for scheduled generation and provides methods for retrieving and updating bill statuses.
- **DashboardService**: Aggregates data from `PropertyService`, `TenantService`, and `UnitService` to provide dashboard statistics.
- **UserService**: Provides methods for retrieving and updating user profiles.
- **DatabaseService**: A custom service that encapsulates raw SQLite database interactions. It provides `run`, `get`, and `all` methods for executing SQL queries and handles table creation on module initialization.

## Data Models (Entities)

These are the TypeScript classes representing the data structures, mirroring the database tables. They implement interfaces defined in the shared `@tenant-lib/model` library.

- **User**: Represents user information, including authentication details.
- **PropertyEntity**: Represents a property, including its address and associated units.
- **UnitEntity**: Represents a rental unit, including its details and occupancy.
- **TenantEntity**: Represents a tenant, including personal details, rent, and associated unit.
- **BillEntity**: Represents a bill generated for a tenant.

## Database Schema (SQLite)

The `DatabaseService` is responsible for creating the following tables:

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  firstName TEXT,
  lastName TEXT,
  email TEXT UNIQUE,
  token TEXT,
  phone TEXT,
  address TEXT,
  avatarUrl TEXT,
  propertyIds TEXT,
  createdAt TEXT,
  updatedAt TEXT,
  password TEXT,
  resetPasswordToken TEXT,
  resetPasswordExpires TEXT
);

CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  address TEXT,
  ownerId TEXT,
  nickname TEXT,
  propertyType TEXT,
  imageUrl TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  unitNumber TEXT,
  isOccupied INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  squareFootage INTEGER,
  tenantIds TEXT,
  propertyId TEXT,
  FOREIGN KEY (propertyId) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  firstName TEXT,
  lastName TEXT,
  phoneNumber TEXT,
  email TEXT,
  monthlyRent REAL,
  monthlyCharge REAL,
  unitId TEXT,
  entryDate TEXT,
  isActive INTEGER,
  leaseStartDate TEXT,
  leaseEndDate TEXT,
  securityDeposit REAL,
  notes TEXT,
  createdAt TEXT,
  updatedAt TEXT,
  FOREIGN KEY (unitId) REFERENCES units(id)
);

CREATE TABLE IF NOT EXISTS bills (
  id TEXT PRIMARY KEY,
  tenantId TEXT,
  amount REAL,
  month INTEGER,
  year INTEGER,
  isPaid INTEGER,
  dueDate TEXT,
  createdAt TEXT,
  updatedAt TEXT,
  FOREIGN KEY (tenantId) REFERENCES tenants(id)
);
```
