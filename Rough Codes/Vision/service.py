existing_customer = frappe.get_list('Customer',fields =['name'],filters = {"custom_first_name":doc.first_name,"custom_last_name":doc.last_name,"custom_mobile_number":doc.mobile_number})

if (existing_customer):
    frappe.msgprint('Customer Is present')
else:
    new_customer = frappe.new_doc('Customer')
    new_customer.customer_name = doc.member
    if doc.first_name:
        new_customer.custom_first_name = doc.first_name
    if doc.last_name:
        new_customer.custom_last_name = doc.last_name
    if doc.gender:
            new_customer.custom_gender = doc.gender
    if doc.date_of_birth:
        new_customer.custom_date_of_birth = doc.date_of_birth
    if doc.mobile_number:
        new_customer.custom_mobile_number = doc.mobile_number
    if doc.alternate_mobile_number:
        new_customer.custom_alternate_mobile_number = doc.alternate_mobile_number
    if doc.group:
        new_customer.customer_group = doc.group
        new_customer.custom_member_group = doc.group
    if doc.particular:
        new_customer.custom_particular  = doc.particular
    if doc.taluka:
        new_customer.custom_taluka = doc.taluka
    if doc.district:
        new_customer.custom_district = doc.district
    if doc.location:
        new_customer.custom_location = doc.location
    if doc.pin_code:
        new_customer.custom_pin_code = doc.pin_code
    if doc.full_address:
        new_customer.custom_full_address = doc.full_address
    if doc.city:
        new_customer.custom_city = doc.city
    new_customer.save(ignore_permissions=True)
    frappe.msgprint(f'Customer Created Successfully{new_customer.name}')
    
    
    
            