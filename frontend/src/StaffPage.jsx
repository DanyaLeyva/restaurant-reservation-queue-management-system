// frontend/src/StaffPage.jsx
// Owner: Chyna
// Staff side

function StaffPage() {

  // Use these exact field names:

  // Reservations:
  // reservation_id, customer_name, customer_phone,
  // party_size, reservation_time, status, table_id

  // Waitlist:
  // waitlist_id, customer_name, customer_phone,
  // party_size, status, table_id, joined_at

  // Tables:
  // table_id, table_number, capacity, status


  // TODO (Chyna): Display the reservation list
  // GET /api/reservations


  // TODO (Chyna): Display the current waitlist
  // GET /api/waitlist


  // TODO (Chyna): Add buttons for staff to assign a table
  // to a customer on the waitlist
  // POST /api/waitlist/<waitlist_id>/assign-table


  // TODO (Chyna): Add a button for staff to notify a customer
  // when their table is ready
  // POST /api/waitlist/<waitlist_id>/notify


  // TODO (Chyna): Display the restaurant tables
  // and whether each table is available or occupied
  // GET /api/tables


  // TODO (Chyna): Allow staff to change a table's status
  // PATCH /api/tables/<table_id>/status


  return <h1>Staff Page</h1>
}

export default StaffPage
