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
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load reservations.");
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

  const [waitlist, setWaitlist] = useState([]);
  const [waitlistLoading, setWaitlistLoading] = useState(true);
  const [waitlistError, setWaitlistError] = useState("");

  useEffect(() => {
    if (showLogin) return;

    let stopped = false;
    let refreshTimer;
    const controller = new AbortController();

    async function loadWaitlist() {
      try {
        const response = await fetch("http://localhost:5000/api/waitlist", {
          signal: controller.signal,
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load waitlist.");
        }

        if (!stopped) {
          setWaitlist(result.waitlist ?? []);
          setWaitlistError("");
        }
      } catch (error) {
        if (!stopped && error.name !== "AbortError") {
          setWaitlistError(error.message);
        }
      } finally {
        if (!stopped) {
          setWaitlistLoading(false);
          refreshTimer = setTimeout(loadWaitlist, 15000);
        }
      }
    }

    setWaitlistLoading(true);
    loadWaitlist();

    return () => {
      stopped = true;
      clearTimeout(refreshTimer);
      controller.abort();
    };
  }, [showLogin]);

  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [tablesError, setTablesError] = useState("");

  useEffect(() => {
    if (showLogin) return;

    let stopped = false;
    let refreshTimer;
    const controller = new AbortController();

    async function loadTables() {
      try {
        const response = await fetch("http://localhost:5000/api/tables", {
          signal: controller.signal,
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load tables.");
        }

        if (!stopped) {
          setTables(result.tables ?? []);
          setTablesError("");
        }
      } catch (error) {
        if (!stopped && error.name !== "AbortError") {
          setTablesError(error.message);
        }
      } finally {
        if (!stopped) {
          setTablesLoading(false);
          refreshTimer = setTimeout(loadTables, 15000);
        }
      }
    }

    setTablesLoading(true);
    loadTables();

    return () => {
      stopped = true;
      clearTimeout(refreshTimer);
      controller.abort();
    };
  }, [showLogin]);

  async function handleTableStatus(tableId) {
    const selectedTable = tables.find((table) => table.table_id === tableId);

    if (!selectedTable) return;

    const newStatus =
      selectedTable.status === "available" ? "occupied" : "available";

    try {
      const response = await fetch(
        `http://localhost:5000/api/tables/${tableId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Unable to update table status.",
        );
      }

      setTables((currentTables) =>
        currentTables.map((table) =>
          table.table_id === tableId ? { ...table, status: newStatus } : table,
        ),
      );
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleAssignTable(waitlistId, tableId) {
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
      alert("This table cannot accommodate the party.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/waitlist/${waitlistId}/assign-table`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            table_id: Number(tableId),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Unable to assign table.",
        );
      }

      setWaitlist((currentWaitlist) =>
        currentWaitlist.map((person) =>
          person.waitlist_id === waitlistId
            ? {
                ...person,
                table_id: selectedTable.table_id,
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

      alert(result.message || "Table assigned successfully.");
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleReservationDecision(reservationId, decision) {
    const confirmed = window.confirm(
      `Are you sure you want to ${decision} this reservation?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/reservations/${reservationId}/${decision}`,
        {
          method: "PATCH",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Unable to update reservation.",
        );
      }

      setReservations((previous) =>
        previous.map((reservation) =>
          reservation.reservation_id === reservationId
            ? {
                ...reservation,
                status: decision === "approve" ? "confirmed" : "declined",
              }
            : reservation,
        ),
      );

      alert(result.message || "Reservation updated successfully.");
    } catch (error) {
      alert(error.message);
    }
  }
  async function handleNotifyCustomer(waitlistId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/waitlist/${waitlistId}/notify`,
        {
          method: "POST",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Unable to notify customer.",
        );
      }

      setWaitlist((currentWaitlist) =>
        currentWaitlist.map((customer) =>
          customer.waitlist_id === waitlistId
            ? { ...customer, status: "notified" }
            : customer,
        ),
      );

      alert(result.message || "Customer marked as notified.");
    } catch (error) {
      alert(error.message);
    }
  }

  const pendingReservations = reservations.filter(
    (reservation) => reservation.status === "pending",
  ).length;

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
          {pendingReservations > 0 && `(${pendingReservations})`}
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

          {reservationsError && <p role="alert">{reservationsError}</p>}

          {reservationsLoading && <p>Loading reservations....</p>}

          {!reservationsLoading &&
            !reservationsError &&
            reservations.length === 0 && <p> No reservations available</p>}

          {!reservationsLoading && reservations.length > 0 && (
            <div className="reservation-list">
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
                    Date & Time:{" "}
                    {reservation.reservation_time
                      ? new Date(reservation.reservation_time).toLocaleString()
                      : "Not specified"}
                  </p>

                  <p>Status: {reservation.status}</p>
                  <p>Table: {reservation.table_id ?? "Not assigned"}</p>
                  {reservation.status === "pending" && (
                    <div className="reservation-actions">
                      <button
                        type="button"
                        onClick={() =>
                          handleReservationDecision(
                            reservation.reservation_id,
                            "approve",
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleReservationDecision(
                            reservation.reservation_id,
                            "decline",
                          )
                        }
                      >
                        Decline
                      </button>
                    </div>
                  )}
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
          {waitlistError && <p role="alert">{waitlistError}</p>}

          {waitlistLoading && <p>Loading waitlist...</p>}
          {waitlistLoading || waitlistError ? null : waitlist.length === 0 ? (
            <p>No customers currently waiting for a table.</p>
          ) : (
            <div className="waitlist-list">
              {waitlist.map((customer, index) => (
                <div className="waitlist-card" key={customer.waitlist_id}>
                  <h3>{customer.customer_name}</h3>
                  <p>Queue Position: {index + 1}</p>
                  <p>Phone: {customer.customer_phone}</p>
                  <p>Party Size: {customer.party_size}</p>
                  <p>Status: {customer.status}</p>
                  {customer.table_id && (
                    <p>Assigned Table: {customer.table_id}</p>
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
