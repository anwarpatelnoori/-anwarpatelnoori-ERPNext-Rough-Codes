frappe.ui.form.on('Payment Entry', {
    before_load: function (frm) {
        hide_fields(frm)
        default_branch(frm)
    },
    onload: function (frm) {
        hide_fields(frm)
    },
    refresh: function (frm) {
        hide_fields(frm)
        default_branch(frm)
    },
    after_save: function (frm) {
    },
    mode_of_payment: function(frm){
        default_cash_account(frm)
    }
})
function hide_fields(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        // Hide specific fields and sections
        const fieldsToHide = [
            'bank_account', 'party_bank_account', 'contact_person', 'paid_from_account_currency', 'paid_to_account_currency', 'taxes_and_charges_section',
            'taxes', 'accounting_dimensions_section'
        ];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });
    }
}
function default_branch(frm) {
    if (frm.is_new()) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Employee',
                filters: [
                    ['personal_email', '=', frappe.session.user]
                ],
                fields: ['employee_name', 'branch', 'custom_store', 'custom_employee_cash_account']
            },
            callback: function (r) {
                if (r.message) {
                    let employee = r.message[0]
                    console.log(employee);
                    frm.set_value('custom_branch', employee.branch)
                    frm.set_value('custom_store', employee.custom_store)
                    if (frm.doc.mode_of_payment == 'Cash') {
                        frm.set_value('paid_to',employee.custom_employee_cash_account)
                    }
                }
            }
        })
    }

}
function default_cash_account(frm) {
    if (frm.is_new()) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Employee',
                filters: [
                    ['personal_email', '=', frappe.session.user]
                ],
                fields: ['custom_employee_cash_account']
            },
            callback: function (r) {
                if (r.message) {
                    let employee = r.message[0]
                    if (frm.doc.mode_of_payment == 'Cash') {
                        frm.set_value('paid_to',employee.custom_employee_cash_account)
                    }
                }
            }
        })
    }

}
