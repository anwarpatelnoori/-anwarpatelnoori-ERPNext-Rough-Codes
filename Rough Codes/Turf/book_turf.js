frappe.ui.form.on('Book Turf', {
    select_turf: function (frm) {
        set_timing(frm)
    },
    date: function (frm) {
        set_timing(frm)
    }
});

function set_timing(frm) {
    if (frm.doc.select_turf && frm.doc.date) {
        // Fetch the turf document
        let turf_name = frm.doc.select_turf;
        let date = frm.doc.date;
        let turf_check = turf_name + '-' + date;
        frappe.db.get_doc('Turf Availabilty', turf_check)
            .then(turf_doc => {
                // Clear existing data in the 'available_timing_slot' child table
                frm.clear_table('available_timing_slot');

                // Insert new data from the Turf Availability's child table
                turf_doc.turf_time_slot.forEach(function (child) {
                    // Check if the status is 'Available'

                    var child_row = frm.add_child('available_timing_slot');
                    child_row.timing_from = child.timing_from;
                    child_row.timing_to = child.timing_to;
                    child_row.status = child.status;

                });

                // Refresh the child table to show the new data
                frm.refresh_field('available_timing_slot');
            }).fail(() => {
                // If there is an error (e.g., document does not exist), clear the timing slots
                frm.clear_table('available_timing_slot');
                frm.refresh_field('available_timing_slot');
            });
    }
}

