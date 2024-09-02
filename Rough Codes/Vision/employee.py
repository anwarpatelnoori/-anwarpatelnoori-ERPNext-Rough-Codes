if doc.custom_create_user == 1:
    user_email = doc.personal_email
    user_exists = frappe.db.exists("User", user_email)

    if not user_exists:
        user_doc = frappe.get_doc({
            "doctype": "User",
            "first_name": doc.doc.employee_name,
            "email": user_email,
            "module_profile": "Empty",
            "role_profile_name": doc.custom_select_role,
            "send_welcome_email": 0,
            "new_password": doc.custom_password,
            "enabled": 1
        })
        user_doc.insert
        user_doc.save(ignore_permissions=True)
        
        frappe.msgprint(_('User created for ') + doc.first_name)
    else:
        frappe.msgprint(_('User already exists for ') + doc.first_name)

    # Update permissions
    for element in doc.custom_select_branch_and_store:
        branch = element.branch
        store = element.store

        # Update User Permission for Branch
        perm_branch = frappe.db.get_value("User Permission", {"user": user_email, "allow": "Branch", "for_value": branch}, "name")
        if perm_branch:
            perm_doc = frappe.get_doc("User Permission", perm_branch)
            # Update fields if needed
            perm_doc.for_value = branch  # Update if there are changes
            perm_doc.save()
            perm_doc.save(ignore_permissions=True)
        else:
            # Create new permission if it doesn't exist
            perm_doc = frappe.get_doc({
                "doctype": "User Permission",
                "user": user_email,
                "allow": "Branch",
                "for_value": branch
            })
            perm_doc.insert()
            perm_doc.save(ignore_permissions=True)

        # Update User Permission for Warehouse
        perm_store = frappe.db.get_value("User Permission", {"user": user_email, "allow": "Warehouse", "for_value": store}, "name")
        if perm_store:
            perm_doc = frappe.get_doc("User Permission", perm_store)
            # Update fields if needed
            perm_doc.for_value = store  # Update if there are changes
            perm_doc.save()
        else:
            # Create new permission if it doesn't exist
            perm_doc = frappe.get_doc({
                "doctype": "User Permission",
                "user": user_email,
                "allow": "Warehouse",
                "for_value": store
            })
            perm_doc.insert()
            perm_doc.save(ignore_permissions=True)


def testtttttttttttttt(self):
    create_user(doc)
    set_user_permission(doc)
    set_user(doc)

    def create_user(doc):
        if doc.custom_create_user == 1:
            user_doc = frappe.get_doc({
                "doctype": "User",
                "first_name": doc.first_name,
                "email": doc.personal_email,
                "module_profile": "Empty",
                "role_profile_name": doc.custom_select_role,
                "send_welcome_email": 0,
                "new_password": doc.custom_password
            })
            user_doc.insert()
            frappe.msgprint(_('User created for {0}').format(doc.first_name))
    
    def set_user_permission(doc):
        if doc.custom_create_user == 1:
            for element in doc.custom_select_branch_and_store:
                branch = element.branch
                store = element.store
    
                # Create User Permission for Branch
                perm_branch = frappe.get_doc({
                    "doctype": "User Permission",
                    "user": doc.personal_email,
                    "allow": "Branch",
                    "for_value": branch
                })
                perm_branch.insert()
    
                # Create User Permission for Warehouse
                perm_store = frappe.get_doc({
                    "doctype": "User Permission",
                    "user": doc.personal_email,
                    "allow": "Warehouse",
                    "for_value": store
                })
                perm_store.insert()
    
    def set_user(doc):
        doc.user_id = doc.personal_email
        doc.create_user_permission = 0
        doc.save()  # Note: Be cautious with calling save in after_insert hooks to avoid infinite loops
    