def find_available_table(tables, party_size):
    """
    Find the smallest available table that can accommodate a party.

    Args:
        tables: A list of table records or dictionaries.
        party_size: Number of people in the customer party.

    Returns:
        The best available table, or None if no suitable table exists.
    """

    suitable_tables = [
        table for table in tables
        if table["status"] == "available"
        and table["capacity"] >= party_size
    ]

    if not suitable_tables:
        return None

    return min(
        suitable_tables,
        key=lambda table: (table["capacity"], table["table_id"])
    )
