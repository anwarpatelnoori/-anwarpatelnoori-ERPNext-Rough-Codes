prev_permisssions  =  frappe.get_doc('Employee',doc.name)
prev_branch = []
prev_store = []
prev_cost_center = []
for i in prev_permisssions.custom_select_branch_and_store:
    prev_branch.append(i.branch)
    prev_store.append(i.store)
    prev_cost_center.append(i.cost_center)

current_branch = []
current_store = []
current_cost_center = []
for j in doc.custom_select_branch_and_store:
    current_branch.append(j.branch)
    current_store.append(j.store)
    current_cost_center.append(j.cost_center)

for k in prev_branch:
    if k not in current_branch:
        branch_perm_name= frappe.db.get_value('User Permission',filters={'user':doc.user_id,'allow':'Branch','for_value':k},fieldname='name')
        frappe.delete_doc('User Permission',branch_perm_name)
for l in prev_store:
    if l not in current_store:
        store_perm_name= frappe.db.get_value('User Permission',filters={'user':doc.user_id,'allow':'Warehouse','for_value':l},fieldname='name')
        frappe.delete_doc('User Permission',store_perm_name)
for m in prev_cost_center:
    if m not in current_cost_center:
        cost_center_perm_name= frappe.db.get_value('User Permission',filters={'user':doc.user_id,'allow':'Cost Center','for_value':m},fieldname='name')
        frappe.delete_doc('User Permission',cost_center_perm_name)

for n in current_branch:
    if n not in prev_branch:
        new_perm_branch = frappe.new_doc('User Permission')
        new_perm_branch.user = doc.user_id
        new_perm_branch.allow = 'Branch'
        new_perm_branch.for_value = n
        new_perm_branch.insert(ignore_permissions=True)
for o in current_store:
    if o not in prev_store:
        new_perm_store = frappe.new_doc('User Permission')
        new_perm_store.user = doc.user_id
        new_perm_store.allow = 'Warehouse'
        new_perm_store.for_value = o
        new_perm_store.insert(ignore_permissions=True)
for p in current_cost_center:
    if p not in prev_cost_center:
        new_perm_cost_center = frappe.new_doc('User Permission')
        new_perm_cost_center.user = doc.user_id
        new_perm_cost_center.allow = 'Cost Center'
        new_perm_cost_center.for_value = p
        new_perm_cost_center.insert(ignore_permissions=True)