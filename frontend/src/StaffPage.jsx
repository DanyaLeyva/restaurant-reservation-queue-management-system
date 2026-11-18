// Staff side
// Owner: Danya

import { useState } from "react";

// TODO (Danya): Display the restaurant's reservations
// GET /api/reservations

// TODO (Danya): Display the current waitlist
// GET /api/waitlist

// TODO (Danya): Add a control for assigning a table
// POST /api/waitlist/<waitlist_id>/assign-table

// TODO (Danya): Add a control for notifying a customer
// POST /api/waitlist/<waitlist_id>/notify

// TODO (Danya): Display restaurant tables and their availability
// GET /api/tables

// TODO (Danya): Allow staff to update whether a table
// is available or occupied
// PATCH /api/tables/<table_id>/status

function StaffPage() {
  const [activeTab, setActiveTab] = useState("reservations");
  const [reservations, setReservations] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [tables, setTables] = useState([]);

  return (
    <section className="staff-page">
      <h1>Staff Dashboard</h1>
      <p>Manage reservations, the waitlist, and restaurant tables.</p>
      <div className="staff-tabs">
        <button type="button" onClick={() => setActiveTab("reservations")}>
          Reservations
        </button>

        <button type="button" onClick={() => setActiveTab("waitlist")}>
          Waitlist
        </button>

        <button type="button" onClick={() => setActiveTab("floor-plan")}>
          Floor Plan
        </button>
      </div>
      {activeTab === "reservations" && (
        <div>
          <h2>Reservations</h2>
          <p>View and manage upcoming customer reservations.</p>

          {reservations.length === 0 ? (
            <p>No reservations available.</p>
          ) : (
            <div className="reservation-list">
              {reservations.map((reservation) => (
                <div
                  className="reservation-card"
                  key={reservation.reservation_id}
                >
                  <h3>{reservation.customer_name}</h3>
                  <p>Phone: {reservation.customer_phone}</p>
                  <p>Party Size: {reservation.party_size}</p>
                  <p>
                    Date & Time:{" "}
                    {reservation.reservation_time
                      ? new Date(reservation.reservation_time).toLocaleString()
                      : "Not specified"}
                  </p>
                  <p>Status: {reservation.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === "waitlist" && (
        <div>
          <h2>Waitlist</h2>
          <p>View customers currently waiting for a table.</p>
          {waitlist.length === 0 ? (
            <p>No customers currently waiting for a table</p>
          ) : (
            <div className="waitlist-list">
              {waitlist.map((customer, index) => (
                <div className="waitlist-card" key={customer.waitlist_id}>
                  <h3>{customer.customer_name}</h3>
                  <p>Queue Position: {index + 1}</p>
                  <p>Phone: {customer.customer_phone}</p>
                  <p>Party Size: {customer.party_size}</p>
                  <p>Status: {customer.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "floor-plan" && (
        <div>
          <h2>Floor Plan</h2>
          <p>View restaurant tables and their availability.</p>

          {tables.length === 0 ? (
            <p>No table information available.</p>
          ) : (
            <div className="table-list">
              {tables.map((table) => (
                <div className="table-card" key={table.table_id}>
                  <h3>Table {table.table_id}</h3>
                  <p>Capacity: {table.capacity} guests</p>
                  <p>Status: {table.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default StaffPage;
