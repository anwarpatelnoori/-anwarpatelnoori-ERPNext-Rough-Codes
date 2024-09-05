customer_name = doc.customer_name
full_name = customer_name.split(' ',2)
if not doc.custom_first_name:
    doc.custom_first_name = full_name[0]
else:
    doc.custom_first_name = doc.custom_first_name
if not doc.custom_last_name:
    doc.custom_last_name = full_name[1] if len(full_name) > 1 else 'Not Set'
else:
    doc.custom_last_name = doc.custom_last_name

if not (frappe.db.exists('Member Registration',{'first_name':doc.custom_first_name,'last_name':doc.custom_last_name,'mobile_number':doc.custom_mobile_number})):
    new_member = frappe.new_doc('Member Registration')

    new_member.branch = doc.custom_branch
    new_member.first_name = doc.custom_first_name
    new_member.last_name = doc.custom_last_name
    new_member.mobile_number =doc.custom_mobile_number
    new_member.group = doc.customer_group
    if doc.gender:
        new_member.gender = doc.gender
    else:
        new_member.gender = "Male"
    if doc.custom_alteranate_mobile_number:
        new_member.alternate_mobile_number = doc.custom_alteranate_mobile_number
    if doc.custom_date_of_birth:
        new_member.date_of_birth = doc.custom_date_of_birth
    if doc.custom_particular:  
        new_member.particular = doc.custom_particular
    if doc.custom_taluka:
        new_member.talluka = doc.custom_taluka
    if doc.custom_district_:
        new_member.district = doc.custom_district_
    if doc.custom_location:
        new_member.location = doc.custom_location
    if doc.custom_pin_code:
        new_member.pincode = doc.custom_pin_code
    if doc.custom_full_address:
        new_member.full_address = doc.custom_full_address
    if doc.custom_city:
        new_member.city = doc.custom_city
    new_member.save(ignore_permissions = True)
else:
    frappe.msgprint(f'Member {customer_name} already existed')
