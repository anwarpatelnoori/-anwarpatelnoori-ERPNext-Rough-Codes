frappe.ui.form.on('Lead', {
    onload: function (frm) {

        let user = frappe.user.name;
        if (user != 'anwar@standardtouch.com' || user != 'nasir@standardtouch.com') {

            // Hide specific fields and sections
            const fieldsToHide = ['salutation','job_title', 'source', 'lead_type', 'middle_name', 'email_id', 'customer', 'type','website','phone','whatsapp_no','phone_ext','organization_section','qualification_tab','other_info_tab'];
            fieldsToHide.forEach(fieldname => {
                frm.set_df_property(fieldname, 'hidden', 1);
            });

            // Hide sections
            const tab_break_to_hide = ['accounting_dimensions_section', 'other_info_tab','additional_costs_section'];
            tab_break_to_hide.forEach(tab_name => {
                $(`a[data-fieldname="${tab_name}"]`).hide();
            });
        }

    },
    custom_member(frm) {
        if (frm.doc.custom_member) {
            let field_value_from_member = ['mobile_number', 'first_name', 'last_name'];
            let lead_field_name = ['mobile_no', 'first_name', 'last_name'];
            field_value_from_member.forEach((field_value, index) => {
                frappe.db.get_value('Member Registration', frm.doc.custom_member, field_value)
                    .then(r => {
                        if (r.message) {
                            let result_object = r.message;
                            let first_key = Object.keys(result_object)[0];
                            let first_value = result_object[first_key];
                            frm.set_value(lead_field_name[index], first_value);
                        }
                    });
            }
            );
        }
    }
});


