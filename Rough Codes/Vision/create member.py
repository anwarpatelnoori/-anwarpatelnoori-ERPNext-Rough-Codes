customer_name = doc.customer_name
last_name = doc.custom_customer_last_name
gender = doc.gender
date_of_birth = doc.custom_date_of_birth
mobile_number = doc.custom_mobile_number  
group = doc.customer_group
particular = doc.custom_particular
taluka = doc.custom_taluka
district = doc.custom_district
location = doc.custom_location
address_city_pincode = doc.primary_address
if address_city_pincode:
    # it will be stored in list
    splitted_address = address_city_pincode.split('<br>')
    address = splitted_address[0]
    city = splitted_address[1]
    pincode = splitted_address[3]

if not (frappe.db.exists('Member Registration',{'full_name':customer_name,'mobile_number':mobile_number})):
    new_member = frappe.new_doc('Member Registration')
    new_member.first_name = customer_name
    new_member.last_name = last_name
    new_member.gender = gender
    new_member.date_of_birth = date_of_birth
    new_member.mobile_number =mobile_number
    new_member.group = group
    new_member.particular = particular
    new_member.talluka = taluka
    new_member.district = district
    new_member.location = location
    if address_city_pincode:
        new_member.pincode = pincode
        new_member.full_address = address
        new_member.city = city
    new_member.save(ignore_permissions = True)
else:
    frappe.msgprint(f'Member {customer_name} already existed')
