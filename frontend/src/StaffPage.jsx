// frontend/src/StaffPage.jsx
// Owner: Danya

import { useEffect, useState } from "react";

// TODO (Danya): Display the restaurant's reservations
// GET /api/reservations

function StaffLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /*
  function handleLogin(event) {
    event.preventDefault();

    // TODO: Connect to backend staff authentication API.
    // Do not grant dashboard access until credentials are verified.
    alert("Staff login is not connected yet.");
  }*/
  //Demo purposes
  function handleLogin(event) {
    event.preventDefault();

    // TODO: Replace demo credentials with backend authentication.
    if (username === "admin" && password === "1234") {
      onLogin();
    } else {
      alert("Incorrect username or password.");
    }
  }

  return (
    <section className="staff-login">
      <h1>Staff Login</h1>
      <p>Log in to access the Olive & Ember staff dashboard.</p>

      <form onSubmit={handleLogin}>
        <label htmlFor="staff_username">Username</label>
        <input
          id="staff_username"
          type="text"
          placeholder="admin"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <label htmlFor="staff_password">Password</label>
        <input
          id="staff_password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Log In</button>
      </form>
    </section>
  );
}
function StaffPage() {
  const [activeTab, setActiveTab] = useState("reservations");
  const [reservations, setReservations] = useState([]);
  const [showLogin, setShowLogin] = useState(true);

  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState("");

  useEffect(() => {
    if (showLogin) return;

    let stopped = false;
    let refreshTimer;
    const controller = new AbortController();

    async function loadReservations() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/staff/reservations",
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to load reservations."
          );
        }

        if (!stopped) {
          setReservations(result.reservations ?? []);
          setReservationsError("");
        }
      } catch (error) {
        if (!stopped && error.name !== "AbortError") {
          setReservationsError(error.message);
        }
      } finally {
        if (!stopped) {
          setReservationsLoading(false);
          refreshTimer = setTimeout(loadReservations, 15000);
        }
      }
    }

    setReservationsLoading(true);
    loadReservations();

    return () => {
      stopped = true;
      clearTimeout(refreshTimer);
      controller.abort();
    };
  }, [showLogin]);

  // test
  const [waitlist, setWaitlist] = useState([
    {
      waitlist_id: 1,
      customer_name: "Jane Doe",
      customer_phone: "(310) 555-0101",
      party_size: 2,
      status: "waiting",
    },
    {
      waitlist_id: 2,
      customer_name: "John Smith",
      customer_phone: "(310) 555-0102",
      party_size: 4,
      status: "waiting",
    },
    {
      waitlist_id: 3,
      customer_name: "Maria Lopez",
      customer_phone: "(310) 555-0103",
      party_size: 8,
      status: "waiting",
    },
  ]);

  const [tables, setTables] = useState([
    { table_id: 1, capacity: 2, status: "available" },
    { table_id: 2, capacity: 2, status: "available" },
    { table_id: 3, capacity: 2, status: "available" },
    { table_id: 4, capacity: 2, status: "available" },
    { table_id: 5, capacity: 4, status: "available" },
    { table_id: 6, capacity: 4, status: "available" },
    { table_id: 7, capacity: 4, status: "available" },
    { table_id: 8, capacity: 4, status: "available" },
    { table_id: 9, capacity: 8, status: "available" },
    { table_id: 10, capacity: 8, status: "available" },
  ]);

  function handleTableStatus(tableId) {
    setTables((currentTables) =>
      currentTables.map((table) =>
        table.table_id === tableId
          ? {
              ...table,
              status: table.status === "available" ? "occupied" : "available",
            }
          : table,
      ),
    );
  }

  function handleAssignTable(waitlistId, tableId) {
    const selectedTable = tables.find(
      (table) => table.table_id === Number(tableId),
    );

    if (!selectedTable || selectedTable.status !== "available") {
      alert("This table is not available.");
      return;
    }

    const customer = waitlist.find(
      (person) => person.waitlist_id === waitlistId,
    );

    if (!customer || selectedTable.capacity < Number(customer.party_size)) {
      alert("This table cannot acommodate the party.");
      return;
    }

    setWaitlist((currentWaitlist) =>
      currentWaitlist.map((person) =>
        person.waitlist_id === waitlistId
          ? {
              ...person,
              assigned_table: selectedTable.table_id,
              status: "seated",
            }
          : person,
      ),
    );
    setTables((currentTables) =>
      currentTables.map((table) =>
        table.table_id === selectedTable.table_id
          ? { ...table, status: "occupied" }
          : table,
      ),
    );
  }

  function handleNotifyCustomer(waitlistId) {
    setWaitlist((currentWaitlist) =>
      currentWaitlist.map((customer) =>
        customer.waitlist_id === waitlistId
          ? { ...customer, status: "notified" }
          : customer,
      ),
    );
  }

  const totalTables = tables.length;

  const totalCapacity = tables.reduce(
    (total, table) => total + table.capacity,
    0,
  );

  const occupiedTables = tables.filter(
    (table) => table.status === "occupied",
  ).length;

  const availableSeats = tables
    .filter((table) => table.status === "available")
    .reduce((total, table) => total + table.capacity, 0);

  /*
  if (showLogin) {
    return <StaffLogin />;
  }*/
  //for demo purpposes
  if (showLogin) {
    return <StaffLogin onLogin={() => setShowLogin(false)} />;
  }
  return (
    <section className="staff-page">
      <h1>Staff Dashboard</h1>
      <button type="button" onClick={() => setShowLogin(true)}>
        Log Out
      </button>
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

          {reservationsError && (
            <p role="alert">{reservationsError}</p>
          )}

          {reservationsLoading && (
            <p>Loading reservations....</p>
          )}

          {!reservationsLoading && !reservationsError && reservations.length ===0 && (
            <p> No reservations available</p>
          )}

          {!reservationsLoading && reservations.length > 0 &&(
            <div className ="reservation-list">
              {reservations.map((reservation) => (
                <div
                  className="reservation-card"
                  key={reservation.reservation_id}
                  >
                    <h3>{reservation.customer_name}</h3>

                    <p>Reservation Number: {reservation.reservation_id}</p>
                    <p>Phone: {reservation.customer_phone}</p>
                    <p>Party Size: {reservation.party_size}</p>

                    <p>
                      Date & Time: {" "}
                      {reservation.reservation_time ? new Date(reservation.reservation_time).toLocaleString(): "Not specified"}
                    </p>

                    <p>Table: {reservation.table_id}</p>
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
                  {customer.assigned_table && (
                    <p>Assigned Table: {customer.assigned_table}</p>
                  )}

                  {customer.status === "waiting" && (
                    <button
                      type="button"
                      onClick={() => handleNotifyCustomer(customer.waitlist_id)}
                    >
                      Notify Customer
                    </button>
                  )}

                  {(customer.status === "waiting" ||
                    customer.status === "notified") && (
                    <div className="table-assignment">
                      <label htmlFor={`table-${customer.waitlist_id}`}>
                        Assign Table
                      </label>

                      <select
                        id={`table-${customer.waitlist_id}`}
                        defaultValue=""
                        onChange={(event) => {
                          if (event.target.value) {
                            handleAssignTable(
                              customer.waitlist_id,
                              event.target.value,
                            );
                          }
                        }}
                      >
                        <option value="" disabled>
                          Select an available table
                        </option>

                        {tables
                          .filter(
                            (table) =>
                              table.status === "available" &&
                              table.capacity >= Number(customer.party_size),
                          )
                          .map((table) => (
                            <option key={table.table_id} value={table.table_id}>
                              Table {table.table_id} — {table.capacity} seats
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
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

          <div className="capacity-summary">
            <p>Total Tables: {totalTables}</p>
            <p>Total Capacity: {totalCapacity} guests</p>
            <p>Occupied Tables: {occupiedTables}</p>
            <p>Available Seats: {availableSeats}</p>
          </div>

          {tables.length === 0 ? (
            <p>No table information available.</p>
          ) : (
            <div className="table-list">
              {tables.map((table) => (
                <div
                  className={`table-card ${table.status}`}
                  key={table.table_id}
                >
                  <h3>Table {table.table_id}</h3>
                  <p>Capacity: {table.capacity} guests</p>
                  <p>Status: {table.status}</p>
                  <button
                    type="button"
                    onClick={() => handleTableStatus(table.table_id)}
                  >
                    {table.status === "available"
                      ? "Mark as Occupied"
                      : "Mark as Available"}
                  </button>
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
