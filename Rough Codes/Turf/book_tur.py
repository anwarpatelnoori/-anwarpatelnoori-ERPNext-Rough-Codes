
# turf_name = doc.select_turf
# booking_date = doc.date
# turf_check = f'{turf_name}-{booking_date}'
# turf_availability = frappe.get_doc('Turf Availabilty', turf_check)
# for booked_slot in doc.available_timing_slot:
#     if booked_slot.book_slot:
#         for availability_slot in turf_availability.turf_time_slot:
#             if availability_slot.timing_from == booked_slot.timing_from and availability_slot.timing_to == booked_slot.timing_to:
#                 frappe.msgprint('under if condition')
#                 availability_slot.status = 'Unavailable'
#                 break  
#             else:
#                 frappe.msgprint(f'Turf frommmmm {availability_slot.timing_from}')
#                 frappe.msgprint(f'Booking  frommmmm {booked_slot.timing_from}')
#                 frappe.msgprint(f'Turf  tooooooo {availability_slot.timing_to}')
#                 frappe.msgprint(f'Booking tooooooo {booked_slot.timing_to}')
# turf_availability.save()

# Server Script for 'Book Turf' doctype
# Event: on_submit

# Get the selected turf and the booking date from the 'Book Turf' document


turf_name = doc.select_turf
booking_date = doc.date

# Create the unique identifier for the Turf Availability document
turf_check = f'{turf_name}-{booking_date}'

# Fetch the Turf Availability document based on the identifier
turf_availability = frappe.get_doc('Turf Availabilty', turf_check)
count = 0 
# Iterate through the available timing slots in the submitted booking document
for booked_slot in doc.available_timing_slot:
    # Check if the slot is marked for booking
    if booked_slot.book_slot:
        # Get the index of the booked slot in the 'Turf Availability' document
        idx = booked_slot.idx
        # Update the corresponding slot in the 'Turf Availability' document
        if idx <= len(turf_availability.turf_time_slot):
            turf_slot = turf_availability.turf_time_slot[idx - 1]  # Adjust idx to start from 0
            turf_slot.status = 'Unavailable'
            turf_slot.booking_id = doc.name
            count +=1 
# Save the updated Turf Availability document
turf_availability.save()
fee = count*1000
doc.fees = fee
