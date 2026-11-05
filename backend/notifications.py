# backend/notifications.py
# Owner: Alejandro Garcia
# Handles table-ready notifications

# Used by:
# POST /api/waitlist/<waitlist_id>/notify

# Customer information uses:
# customer_name
# customer_phone

# TODO (Alejandro): create a function that notifies a customer
# when their table is ready

def notify_customer(customer_name, customer_phone):
    print(f"Notification sent to {customer_name} at {customer_phone}")
    return True

# Keep the first version simple.
# The notification can be printed/displayed first and improved later.