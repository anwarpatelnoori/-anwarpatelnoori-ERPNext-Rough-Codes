
if (doc.custom_create_user == 1):
    if not doc.user_id:
        new_user = frappe.new_doc("User")
        new_user.first_name= doc.first_name
        new_user.email= doc.personal_email
        new_user.module_profile= "Empty"
        new_user.role_profile_name= doc.custom_select_role
        new_user.send_welcome_email= 0
        new_user.new_password= doc.custom_password
        new_user.new_password= doc.custom_password
        new_user.save(ignore_permissions=True)
        frappe.msgprint('Done')
        get_user = frappe.get_last_doc('User',filters=doc.email)
        doc.user_id = get_user.name
        
        if(doc.custom_assign_employee_to_multiple_branch==0):
            perm_branch = frappe.get_doc({
                        "doctype": "User Permission",
                        "user": get_user.name,
                        "allow": "Branch",
                        "for_value": doc.branch
            })
            perm_branch.insert(ignore_permissions=True)
            perm_cost_center = frappe.get_doc({
            "doctype": "User Permission",
            "user": get_user.name,
            "allow": "Cost Center",
            "for_value": doc.custom_cost_center
            })
            perm_cost_center.insert(ignore_permissions=True)
            perm_store = frappe.get_doc({
                "doctype": "User Permission",
                "user": get_user.name,
                "allow": "Warehouse",
                "for_value": doc.custom_store
            })
            perm_store.insert(ignore_permissions=True)
        elif(doc.custom_assign_employee_to_multiple_branch==1):
            for element in doc.custom_select_branch_and_store:
                branch = element.branch
                store = element.store
                cost_center = element.cost_center
                # Create User Permission for Branch
                perm_branch = frappe.get_doc({
                    "doctype": "User Permission",
                    "user": get_user.name,
                    "allow": "Branch",
                    "for_value": branch
                })
                perm_branch.insert()
                # Create User Permission for Warehouse
                perm_store = frappe.get_doc({
                    "doctype": "User Permission",
                    "user": get_user.name,
                    "allow": "Warehouse",
                    "for_value": store
                })
                perm_store.insert()
                perm_cost_center = frappe.get_doc({
                "doctype": "User Permission",
                "user": get_user.name,
                "allow": "Cost Center",
                "for_value": cost_center
                })
                perm_cost_center.insert(ignore_permissions=True)

pass