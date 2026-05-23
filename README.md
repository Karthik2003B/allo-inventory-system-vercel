# Allo Inventory Reservation System

A full-stack inventory reservation system built using Next.js, Prisma, and Supabase for managing multi-warehouse ecommerce inventory.

The system prevents overselling during checkout by introducing temporary inventory reservations with expiry handling. Customers can reserve inventory during payment flow, confirm purchases, or release reservations if payment fails.

---

# Live Demo

Deployed URL:

```text
https://your-vercel-url.vercel.app
```

GitHub Repository:

```text
https://github.com/Karthik2003B/allo-inventory-system
```

---

# Features

## Inventory Management

- Multi-warehouse inventory tracking
- Real-time available stock calculation
- Out-of-stock handling

## Reservation System

- Temporary inventory reservation
- Reservation confirmation
- Reservation cancellation
- Reservation expiry handling
- Live countdown timer

## Concurrency Safety

- Transaction-safe reservation handling
- Prevents overselling during simultaneous reservation attempts

## UI Features

- Product listing page
- Reservation details page
- Countdown timer
- Reservation status indicators
- Disabled actions after completion
- Live inventory updates

---

# Tech Stack

## Frontend

- Next.js 16
- TypeScript
- Tailwind CSS

## Backend

- Next.js App Router APIs
- Prisma ORM
- Supabase PostgreSQL

## Database

- PostgreSQL (Supabase)

---

# System Design

## Inventory Model

Each inventory record stores:

- `totalQuantity`
- `reservedQuantity`

Available stock is calculated dynamically using:

```text
availableQuantity = totalQuantity - reservedQuantity
```

This allows inventory to be temporarily reserved without immediately deducting actual stock.

---

# Reservation Lifecycle

Reservations move through the following states:

## PENDING

Inventory is temporarily reserved during checkout.

## CONFIRMED

Reservation is confirmed after successful purchase. Inventory is permanently deducted.

## RELEASED

Reservation is cancelled or expired. Reserved inventory is returned back to available stock.

---

# Concurrency Handling

The reservation system uses Prisma transactions to ensure inventory updates happen atomically.

Reservation creation includes:

1. Inventory lookup
2. Stock availability validation
3. Reserved stock increment
4. Reservation creation

All operations occur within a single database transaction.

This prevents overselling during concurrent reservation attempts.

### Example Scenario

```text
Only 1 item left in stock

2 users attempt reservation simultaneously

Result:
- One reservation succeeds
- Second request receives 409 Conflict
```

---

# Reservation Expiry Strategy

Expired reservations are cleaned using a lazy cleanup strategy.

Whenever products are fetched:

1. Expired PENDING reservations are identified
2. Reserved inventory is released
3. Reservation status is updated to RELEASED

This ensures abandoned reservations do not block inventory indefinitely.

---

# API Endpoints

## GET /api/products

Returns products with warehouse inventory availability.

### Example Response

```json
[
  {
    "id": "product-id",
    "name": "iPhone 15",
    "inventories": [
      {
        "warehouseName": "Bangalore Warehouse",
        "availableQuantity": 5
      }
    ]
  }
]
```

---

## POST /api/reservations

Creates a temporary inventory reservation.

### Returns

- `200` on success
- `409` if insufficient stock

---

## POST /api/reservations/:id/confirm

Confirms reservation and permanently deducts stock.

### Returns

- `200` on success
- `410` if reservation expired

---

## POST /api/reservations/:id/release

Releases reserved inventory.

---

# UI Flow

## Home Page

Displays:

- Products
- Warehouses
- Available inventory
- Reserve button

---

## Reservation Page

Displays:

- Reservation details
- Reservation status
- Live countdown timer
- Confirm purchase button
- Cancel reservation button

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/Karthik2003B/allo-inventory-system.git
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in project root:

```env
DATABASE_URL=
DIRECT_URL=
```

---

## 4. Run Prisma Migration

```bash
npx prisma migrate dev
```

---

## 5. Seed Database

```bash
npx prisma db seed
```

---

## 6. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Database Schema

## Product

Stores product information.

## Warehouse

Stores warehouse information.

## Inventory

Tracks stock levels per warehouse.

## Reservation

Tracks temporary inventory reservations.

---

# Trade-offs and Future Improvements

## Current Trade-offs

### Lazy Cleanup

Reservation expiry cleanup currently happens during product fetches instead of background workers.

This keeps implementation simple while satisfying assignment requirements.

### No Distributed Locking

The system uses database transactions rather than Redis-based distributed locks.

For larger scale systems:

- Redis locking
- Queue-based processing
- Optimistic concurrency control

could be introduced.

---

# Future Improvements

- Idempotency support using `Idempotency-Key`
- Redis-based distributed locking
- Background cron cleanup jobs
- Reservation analytics dashboard
- Toast notifications
- WebSocket-based live inventory updates
- Admin inventory management panel

---

# Key Learnings

This project demonstrates:

- Inventory reservation systems
- Concurrency-safe backend design
- Transaction handling
- Multi-warehouse inventory management
- Reservation expiry workflows
- Full-stack application architecture

---

# Author

Karthik B
