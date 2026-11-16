// Owner: Danya
// Main application integration

// TODO (Danya): Replace the Vite starter page with the main application page
// TODO (Danya): Connect CustomerPage.jsx and StaffPage.jsx
// TODO (Danya): Add a way to choose between Customer and Staff views
import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import CustomerPage from './CustomerPage'
import StaffPage from './StaffPage'

function App() {
  const [page, setPage] = useState('home')

  return (
    < div className = "app">
      <header className="navbar">
        <h2> BEAU </h2>
        
        <nav>
          <button onClick = {() => setPage('home')}>Home</button>
          <button onClick = {() => setPage('customer')}>Customer</button>
          <button onClick = {() => setPage('staff')}>staff</button>
         
        </nav>
      </header>

      <main>
        {page == 'home' && (
          <section className='home'>
            <h1>Welcome to BEAU</h1>
            <p>Good food. Great company. A table waiting for you.</p>

            <div className='home-buttons'>
              <button onClick = {() => setPage('customer')}>
                Make a Reservation
              </button>

              <button onClick = {() => setPage('customer')}>
                Join Waitlist
              </button>
            </div>
          </section>
        )}

        {page === 'customer' && <CustomerPage/>}
        {page === 'staff' && <StaffPage/>}
      </main>
     </div>
  )
}
export default App
