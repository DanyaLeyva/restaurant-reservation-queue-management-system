// frontend/src/CustomerPage.jsx
// Owner: Danya Leyva
// Customer side

import { useState } from "react";

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
  const [myReservation, setMyReservation] = useState([]);
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
      [name]: name === "party_size" ? Number(value) : value,
    });
  }

  function handleWaitlistSubmit(event) {
    event.preventDefault();

    console.log("waitlist:", waitlist);
    alert("Waitlist form submitted (demo only).");
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

        <button type="button" onClick={() => setActiveTab("my-reservation")}>
          My Reservation
        </button>
      </div>

      {activeTab === "reservation" && (
        <div>
          <h1>Make a Reservation</h1>
          <p>Fill out the information below to request a table.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="customer_name">Full Name</label>
            <input
              id="customer_name"
              type="text"
              name="customer_name"
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
              maxLength={10}
              pattern="[1-9]{10}"
              title="Enter a 10-digit phone number"
              placeholder="1234567890"
              value={reservation.customer_phone}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");
                setReservation({
                  ...reservation,
                  customer_phone: value,
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
              value={reservation.party_size}
              onChange={handleChange}
              pattern="[1-9][0-9]*"
              title="Enter a whole number greater than zero"
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
              maxLength={10}
              pattern="[0-9]{10}"
              title="Enter a 10-digit phone number"
              placeholder="1234567890"
              value={waitlist.customer_phone}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");
                setWaitlist({
                  ...waitlist,
                  customer_phone: value,
                });
              }}
              required
            />

            <label htmlFor="waitlist_party_size">Party Size</label>
            <input
              id="waitlist_party_size"
              type="number"
              inputMode="numeric"
              name="party_size"
              value={waitlist.party_size}
              onChange={handleWaitlistChange}
              pattern="[1-9][0-9]*"
              title="Enter a whole number greater than zero"
              required
            />

            <button type="submit">Join Waitlist</button>
          </form>
        </div>
      )}
    </section>
  );
}

export default CustomerPage;
