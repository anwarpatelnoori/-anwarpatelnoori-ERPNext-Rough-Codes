import frappe

def execute(filters=None):
    return get_columns(), get_data()

def get_data():
    current_user = frappe.session.user
    todos = frappe.get_all(
        "ToDo",
        filters={"status": "Open"},
        # created by or allocated to current user
        or_filters=[{"owner": current_user}, {"allocated_to": current_user}],
        fields=["name", "description", "status"],
    )
    return todos

# 3 columns
def get_columns():
    return [
        {
            "label": "Description",
            "fieldname": "description",
            "fieldtype": "Data",
            "width": 400,
        },
        {"label": "Status", "fieldname": "status", "fieldtype": "Data", "width": 200},

        # This column will be used to render the close buttons
        {
            "label": "Close Action",
            "fieldname": "name",
            "fieldtype": "Data",
            "width": 150,
        },
    ]