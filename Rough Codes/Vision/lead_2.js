frappe.ui.form.on('Lead', {
    after_save: function (frm) {
        add_service_button(frm)
        assign_lead_to_employee(frm)
    },
});
function assign_lead_to_employee(frm) {
    if (frm.doc.custom_assign_lead == 1) {
        let email_id = frm.doc.custom_employee_user_id;
        frappe.call({
            method: "frappe.desk.form.assign_to.add",
            args: {
                "assign_to": JSON.stringify([email_id]),
                "doctype": "Lead",
                "name": frm.docname,
            },
            callback: function (r) {
                give_write_access(frm)
            },
        });
    }
}
function give_write_access(frm) {
    if (frm.doc.custom_assign_lead == 1) {
        frappe.call({
            method: "frappe.share.add",
            args: {
                "doctype": "Lead",
                "name": frm.docname,
                "user": frm.doc.custom_employee_user_id,
                "read": 1,
                "write": 1
            },
            callback: function (r) {
                if (r) {
                    console.log("Sucesssssss", r)
                }
            },
        });
    }
}
