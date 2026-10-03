# Naming Conventions

Use these exact names everywhere (database, backend, frontend). Everything is snake_case.

## Database tables

restaurant_tables: table_id, table_number, capacity, status (available, occupied)

reservations: reservation_id, customer_name, customer_phone, party_size, reservation_time, status (confirmed, cancelled), table_id, created_at

waitlist_entries: waitlist_id, customer_name, customer_phone, party_size, status (waiting, notified, seated, cancelled), table_id, joined_at

## API routes

Reservations
- POST /api/reservations
- GET /api/reservations (add ?customer_phone=... for one customer)
- PATCH /api/reservations/<reservation_id>/cancel

Waitlist
- POST /api/waitlist
- GET /api/waitlist
- PATCH /api/waitlist/<waitlist_id>/cancel
- POST /api/waitlist/<waitlist_id>/assign-table
- POST /api/waitlist/<waitlist_id>/notify

Tables
- GET /api/tables
- PATCH /api/tables/<table_id>/status
