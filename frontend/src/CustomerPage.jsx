// frontend/src/CustomerPage.jsx
// Owner: Danya Leyva
// Customer side

import { useState } from "react";

function CustomerLogin({ onSignUp }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

 async function handleLogin(event) {
    event.preventDefault();

    //TODO: connect to backend authentication API
    //Do not grant access until the backend verifies credentials.

    try{
      const response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name, phone}),
      });

      const result = await response.json();

      if(!response.ok){
        throw new Error(result.message || "Registration Failed.");
      }
      alert(result.message)
      setName("");
      setPhone("");
    } catch (error){
      alert(error.message);
    }

    alert("Customer login is not connected yet.");
  }
  return (
    <section className="customer-login">
      <h1>Customer Login</h1>
      <p> Log in to manage your Olive & Ember Reservations</p>

      <form onSubmit={handleLogin}>
        <label htmlFor="login_name">Full Name</label>
        <input
          id="login_name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <label htmlFor="login_phone">Phone Number</label>
        <input
          id="login_phone"
          type="tel"
          inputMode="numeric"
          maxLength={14}
          pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
          title="Enter a 10-digit phone number"
          placeholder="(123) 456-6789"
          value={phone}
          onChange={(event) => {
            setPhone(formatPhoneNumber(event.target.value));
          }}
          required
        />

        <button type="submit"> Log In</button>
      </form>
      <p>Don't have an account? Sign up coming soon.</p>
      <button type="button" onClick={onSignUp}>
        Sign Up
      </button>
    </section>
  );
}
function CustomerRegister() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function handleRegister(event) {
    event.preventDefault();

    //TODO: connect the registeration to the backend
  }
  return (
    <section className="customer-register">
      <h1> Create an Account</h1>
      <p>Register to manage Olive & Ember reservation</p>

      <form onSubmit={handleRegister}>
        <label htmlFor="register_name">Name</label>
        <input
          id="register_name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="register_phone">Phone</label>
        <input
          id="register_phone"
          type="tel"
          inputMode="numeric"
          max={14}
          pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
          placeholder="(123) 456-7890"
          value={phone}
          onChange={(event) => {
            setPhone(formatPhoneNumber(event.target.value));
          }}
          required
        />

        <button type="submit">Create Account</button>
      </form>
    </section>
  );
}

function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length > 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length > 3) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return digits;
}

function CustomerPage() {
  const [reservation, setReservation] = useState({
    customer_name: "",
    customer_phone: "",
    party_size: "",
    reservation_time: "",
  });

  const [activeTab, setActiveTab] = useState("reservation");

  const [waitlist, setWaitlist] = useState({
    customer_name: "",
    customer_phone: "",
    party_size: "",
  });

  const [searchPhone, setSearchPhone] = useState("");
  const [myReservations, setMyReservations] = useState([]);
  const [lookupMessage, setLookupMessage] = useState("");

  // Use these exact field names:
  // customer_name
  // customer_phone
  // party_size
  // reservation_time

  function handleChange(event) {
    const { name, value } = event.target;

    setReservation({
      ...reservation,
      [name]: name === "party_size" ? value.replace(/^0+/, "") : value,
    });
  }
  // TODO (Danya): Create the reservation form
  // POST /api/reservations
  function handleSubmit(event) {
    event.preventDefault();
    console.log("Reservation:", reservation);
    alert("Reservation form submitted (demo only).");
  }

  function handleWaitlistChange(event) {
    const { name, value } = event.target;

    setWaitlist({
      ...waitlist,
      [name]: name === "party_size" ? value.replace(/^0+/, "") : value,
    });
  }

  function handleWaitlistSubmit(event) {
    event.preventDefault();

    console.log("waitlist:", waitlist);
    alert("Waitlist form submitted (demo only).");
  }

  function handleReservationSearch(event) {
    event.preventDefault();

    console.log("Searching Reservation for: ", searchPhone);

    setMyReservations([]);
    setLookupMessage("Reservation lookup is not connected to the backend yet.");
  }

  // TODO (Danya): Display the customer's reservations
  // GET /api/reservations?customer_phone=...
  return (
    <section className="customer-page">
      <div className="customer-tabs">
        <button type="button" onClick={() => setActiveTab("reservation")}>
          Make a Reservation
        </button>

        <button type="button" onClick={() => setActiveTab("waitlist")}>
          Join Waitlist
        </button>

        <button type="button" onClick={() => setActiveTab("my-reservations")}>
          My Reservations
        </button>

        <button type="button" onClick={() => setActiveTab("login")}>
          Log In
        </button>
      </div>

      {activeTab === "reservation" && (
        <div>
          <h1>Make a Reservation</h1>
          <p>Fill out the information below to request a table.</p>
          <p>
            Maximum 8 guests per party. One reservation per customer per day.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="customer_name">Full Name</label>
            <input
              id="customer_name"
              type="text"
              name="customer_name"
              placeholder="Jane Doe"
              value={reservation.customer_name}
              onChange={handleChange}
              required
            />

            <label htmlFor="customer_phone">Phone Number</label>
            <input
              id="customer_phone"
              type="tel"
              name="customer_phone"
              inputMode="numeric"
              maxLength={14}
              pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
              title="Enter a 10-digit phone number"
              placeholder="(123) 456-6789"
              value={reservation.customer_phone}
              onChange={(event) => {
                setReservation({
                  ...reservation,
                  customer_phone: formatPhoneNumber(event.target.value),
                });
              }}
              required
            />

            <label htmlFor="party_size">Party Size</label>
            <input
              id="party_size"
              type="text"
              inputMode="numeric"
              name="party_size"
              placeholder="0"
              value={reservation.party_size}
              onChange={(event) => {
                const value = event.target.value;

                if (value === "" || /^[1-8]$/.test(value)) {
                  setReservation({
                    ...reservation,
                    party_size: value,
                  });
                }
              }}
              pattern="[1-8]"
              title="Reservation are limited to 1-8 guests"
              required
            />

            <label htmlFor="reservation_time">Date & Time</label>
            <input
              id="reservation_time"
              type="datetime-local"
              name="reservation_time"
              value={reservation.reservation_time}
              onChange={handleChange}
              required
            />

            <button type="submit"> Request Reservation</button>
          </form>
        </div>
      )}
      {activeTab === "waitlist" && (
        <div>
          <h1>Join Waitlist</h1>
          <p>Enter your information to join our waitlist.</p>

          <form onSubmit={handleWaitlistSubmit}>
            <label htmlFor="waitlist_name">Full Name</label>
            <input
              id="waitlist_name"
              type="text"
              name="customer_name"
              placeholder="Jhon Doe"
              value={waitlist.customer_name}
              onChange={handleWaitlistChange}
              required
            />

            <label htmlFor="waitlist_phone">Phone Number</label>
            <input
              id="waitlist_phone"
              type="tel"
              name="customer_phone"
              inputMode="numeric"
              maxLength={14}
              pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
              title="Enter a 10-digit phone number"
              placeholder="(123) 456-6789"
              value={waitlist.customer_phone}
              onChange={(event) => {
                setWaitlist({
                  ...waitlist,
                  customer_phone: formatPhoneNumber(event.target.value),
                });
              }}
              required
            />

            <label htmlFor="waitlist_party_size">Party Size</label>
            <input
              id="waitlist_party_size"
              type="text"
              inputMode="numeric"
              name="party_size"
              placeholder="0"
              value={waitlist.party_size}
              onChange={(event) => {
                const value = event.target.value;

                if (value === "" || /^[1-8]$/.test(value)) {
                  setWaitlist({
                    ...waitlist,
                    party_size: value,
                  });
                }
              }}
              pattern="[1-8]"
              title="Maximum 8 guest per party"
              required
            />

            <button type="submit">Join Waitlist</button>
          </form>
        </div>
      )}

      {activeTab === "my-reservations" && (
        <div>
          <h1>My Reservations</h1>
          <p>Enter your phone number to find your reservations</p>
          <form onSubmit={handleReservationSearch}>
            <label htmlFor="search_phone"> Phone Number</label>
            <input
              id="search_phone"
              type="tel"
              inputMode="numeric"
              maxLength={14}
              pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
              title="Enter a 10-digit phone number"
              placeholder="(123) 456-6789"
              value={searchPhone}
              onChange={(event) =>
                setSearchPhone(formatPhoneNumber(event.target.value))
              }
              required
            />

            <button type="submit">Find Reservations</button>
          </form>

          {lookupMessage && <p role="status">{lookupMessage}</p>}
          {myReservations.map((item) => (
            <div key={item.reservation_id}>
              <h3>Reservation #{item.reservation_id}</h3>
              <p>Name: {item.customer_name}</p>
              <p>Party Size: {item.party_size}</p>
              <p>Date & Time: {item.reservation_time}</p>
              <p>Status: {item.status}</p>
              <button type="button" disabled>
                Cancel Reservation
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "login" && (
        <CustomerLogin onSignUp={() => setActiveTab("register")} />
      )}
      {activeTab === "register" && <CustomerRegister />}
    </section>
  );
}

export default CustomerPage;
