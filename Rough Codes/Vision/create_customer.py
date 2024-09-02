first_name = doc.first_name
last_name = doc.last_name
gender = doc.gender
if (doc.last_name):
    full_name = first_name + last_name
    contact_check = first_name + '-' + last_name
else:
    full_name = first_name
    contact_check = first_name + '-' + first_name
mobile_number = doc.mobile_number
alternate_mobile_number = doc.alternate_mobile_number
customer_group = doc.group
full_address = doc.full_address
pincode  = doc.pincode

if not (frappe.db.exists('Contact',contact_check)):
    new_contact = frappe.new_doc('Contact')
    new_contact.first_name = full_name
    new_contact.gender = gender
    new_contact.append('phone_nos',{
        'phone':mobile_number,
        'is_primary_mobile_no':1
    })
    new_contact.append('phone_nos',{
        'phone':alternate_mobile_number,
        'is_primary_mobile_no':0
    })
    new_contact.append('links',{
        'link_doctype':'Member Registration',
        'link_name':doc.name
    })
    new_contact.save(ignore_permissions =True)
#
else:
    exsisting_contact = frappe.get_doc('Contact',contact_check)
    exsisting_contact.first_name = full_name
    exsisting_contact.gender = gender
    exsisting_contact.append('phone_nos',{
        'phone':mobile_number,
        'is_primary_mobile_no':1
    })
    exsisting_contact.append('phone_nos',{
        'phone':alternate_mobile_number,
        'is_primary_mobile_no':0
    })
    exsisting_contact.append('links',{
        'link_doctype':'Member Registration',
        'link_name':doc.name
    })
    exsisting_contact.save(ignore_permissions =True)

