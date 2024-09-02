# Server Script for 'Book Turf' doctype
# Event: on_submit

# Get the selected turf and the booking date from the 'Book Turf' document
ground_name = doc.name1

# Fetch the Turf Availability document based on the identifier
turf_availability = frappe.get_doc('Ground avail',ground_name )

# Iterate through the booked slots in the 'Book Turf' document
for booked_slot in doc.available_timing_slot:
    # Check if the slot is marked for booking
    if booked_slot.book_slot:
        # frappe.msgprint('inside booked slot')
        # Iterate through the slots in the Turf Availability document
        for availability_slot in turf_availability.turf_time_slot:
            # frappe.msgprint('inside 2nd loop')
            # Check if the times match
            if availability_slot.timing_from == booked_slot.timing_from and availability_slot.timing_to == booked_slot.timing_to:
                frappe.msgprint('under if condition')
                # Update the status to 'Unavailable' since it's booked
                availability_slot.status = 'Unavailable'
                break  # Break if the matching slot is found and updated, assuming one slot doesn't match multiple records
            else:
                frappe.msgprint(f'Turf availbility time from {availability_slot.timing_from}')
                frappe.msgprint(f'Booking time from {booked_slot.timing_from}')
                frappe.msgprint(f'Turf availbility time to {availability_slot.timing_to}')
                frappe.msgprint(f'Booking time to {booked_slot.timing_to}')

# Save the updated Turf Availability document
turf_availability.save()
