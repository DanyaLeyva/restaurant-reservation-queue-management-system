# backend/allocation.py
# Owner: Chyna Green-Bostick
# Handles table allocation

# restaurant_tables fields used here:
# table_id, table_number, capacity, status

# Table status values:
# available, occupied

# This function will be used when:
# POST /api/waitlist/<waitlist_id>/assign-table

# TODO (Chyna): Create a function that finds an available table
# that can fit the customer's party.

# Example:
# A party of 3 can be assigned to an available table that seats 4.

# TODO (Chyna): Choose an available table with enough capacity
# for the customer's party.

# TODO (Chyna): If no table is available, return None so the
# customer can remain on the waitlist.
