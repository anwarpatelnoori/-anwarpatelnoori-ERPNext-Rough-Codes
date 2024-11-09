frappe.ui.form.on('Employee', {
    refresh: function (frm) {
        read_only_fields(frm)
    }
})

function read_only_fields(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        // Get all fields from the document meta (fields declared in the form)
        let all_field_names = cur_frm.meta.fields.map(field => field.fieldname);
        let editable_fields = [
            "first_name",
            "middle_name",
            "gender",
            "date_of_birth",
            "salutation",
            "current_address",
            "current_accommodation_type",
            "permanent_accommodation_type",
            "permanent_address",
            "custom_current_country",
            "custom_origin_country",
            "cell_number"
        ];
        // Loop & making read_only
        all_field_names.forEach(fieldname => {
            // If the field name is not in the list of editable fields, set it to read-only
            if (!editable_fields.includes(fieldname)) {
                frm.set_df_property(fieldname, 'read_only', 1);
            }
        });
        const tab_break_to_hide = ['connections_tab', "salary_information", "employment_details"]
        tab_break_to_hide.forEach(tab_name => {
            $(`a[data-fieldname="${tab_name}"]`).hide()
        });
        if (user === 'elementarylead@bayaanacademy.com' || user === 'middleschoollead@bayaanacademy.com' || user === 'highschoollead@bayaanacademy.com' || user === "hr@bayaanacademy.com" || user === "director@bayaanacademy.com") {
            frm.set_df_property('department', 'read_only', 0);
            frm.set_df_property('designation', 'read_only', 0);
            
        }
    }
}