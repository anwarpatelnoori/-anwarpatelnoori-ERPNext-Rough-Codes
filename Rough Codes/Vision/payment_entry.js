frappe.ui.form.on('Payment Entry', {
    setup: function (frm) {
    },
    payment_type:function(frm){
        if(frm.doc.payment_type==="Internal Transfer"){
            frm.set_value('mode_of_payment','Cash')
            frm.set_df_property('mode_of_payment','read_only',1)
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
                        frm.set_query("paid_from", (doc) => {
                            return {
                                filters: {
                                    "name": r.message[0].custom_employee_cash_account
                                }
                            }
                        });
                    }

                }
            })
        }
        else{
            frm.set_df_property('mode_of_payment','read_only',0)
        }
    },
    refresh: function (frm) {
        hide_fields(frm)
        default_branch(frm)
        remove_pay(frm)
    },
    mode_of_payment: function (frm) {
        if (frm.doc.mode_of_payment === 'Cash' && frm.doc.payment_type == 'Receive') {
            set_emp_cash_account(frm)
        }
    },
})
function hide_fields(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        // Hide specific fields and sections
        const fieldsToHide = [
            'bank_account', 'party_bank_account', 'contact_person', 'paid_from_account_currency', 'paid_to_account_currency', 'taxes_and_charges_section',
            'taxes', 'accounting_dimefnsions_section'
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
                    frm.set_df_property('custom_branch', 'read_only', 1)
                    if (frm.doc.mode_of_payment == 'Cash') {
                        frm.set_value('paid_to', employee.custom_employee_cash_account)
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
                        frm.set_value('paid_to', employee.custom_employee_cash_account)
                    }
                }
            }
        })
    }

}
function set_emp_cash_account(frm) {
    if (frm.is_new()) {
        let flag = frappe.user_roles.some(role => ['BO Technical', 'BO Service Assistant Manager', 'BO Service Manager', 'BO Service Operation Head'].includes(role));
        if (flag === true) {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Employee',
                    filters: {
                        'personal_email': frappe.session.user
                    },
                    fields: ['name', 'custom_employee_cash_account']
                },
                callback: function (r) {
                    if (r.message) {
                        frm.set_value('paid_to', r.message[0].custom_employee_cash_account)
                    }
                    else {
                        frm.set_value('paid_to', "Cash - BIPL")
                    }
                }
            });
        }
        else {
            frm.set_value('paid_to', "Cash - BIPL")
        }
    }
}
function remove_pay(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        let flag = frappe.user_roles.some(role => ['BO Technical', 'BO Service Assistant Manager', 'BO Service Manager', 'BO Service Operation Head'].includes(role));
        if (flag === true) {
            $('select[data-fieldname="payment_type"] option[value="Pay"]').remove();
        }
    }
}