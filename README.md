# Restaurant Reservation and Queue Management System

A restaurant reservation and queue management system developed for our Software Engineering group project.

## Project Overview

This project is designed to help restaurants manage customer reservations, waitlists, and table availability.

Customers will be able to make, view, and cancel reservations and join a waitlist when necessary. Restaurant staff will be able to manage reservations, monitor the waitlist, track table availability, and assign tables based on party size.

## Technology Stack

- Frontend: React.js
- Backend: Python / Flask
- Database: MySQL
- Version Control: Git / GitHub

## Project Structure

- `frontend/` - React.js frontend
- `backend/` - Flask backend
- `database/` - MySQL database files
- `tests/` - Project testing
- `docs/` - Project documentation

## Team Members

- Danya Leyva
- Chyna Green-Bostick
- Kristopher Ryan Manalang
- Alejandro Garcia
- Eduardo Salvador

## Team Responsibilities

### Danya Leyva

**Project Manager, Customer & Staff Frontend, and Testing**

- Manage the GitHub repository and project organization
- Coordinate tasks and integration
- Develop the customer interface
- Create the reservation and waitlist forms
- Allow customers to view and cancel reservations
- Develop the staff interface
- Display reservations, waitlist entries, and table availability for staff
- Add staff controls for assigning tables, updating table status, and notifying customers
- Perform system and integration testing

### Chyna Green-Bostick

**Table Allocation**

- Develop the table-allocation functionality using Python
- Find available tables based on party size and table capacity
- Make sure only available tables are considered
- Return no table when an appropriate table is unavailable so the customer can remain on the waitlist

### Kristopher Ryan Manalang

**Flask and Reservation Backend**

- Set up the Flask application
- Connect backend routes to the Flask application
- Develop reservation functionality
- Allow reservations to be created, viewed, and cancelled

### Alejandro Garcia

**Waitlist and Notifications**

- Develop the waitlist functionality
- Allow customers to be added to and removed from the waitlist
- Handle assigning tables to waitlist customers
- Develop the table-ready notification functionality

### Eduardo Salvador

**Database and Table Management**

- Create the MySQL database structure
- Set up the Flask and MySQL connection
- Manage restaurant table information
- Handle table availability and status

## Team Development

Team members will work primarily on their assigned components and collaborate when connecting the React frontend, Flask backend, and MySQL database.
