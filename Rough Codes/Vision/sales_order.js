frappe.ui.form.on('Sales Order', {
    before_save: function (frm) {
        set_cost_center_in_taxes_and_warehouse_in_item(frm)
    },
    before_load: function (frm) {
        if (frm.is_new()){
            set_value(frm)
        }
    },
    refresh: function (frm) {
        hide_button_and_fields(frm)
        deafult_employee_branch_store_cost_center(frm)
        if (frm.doc.__islocal) {
            frm.set_value('custom_current_employee_user_id', frappe.user.name)
            frm.set_value('custom_current_employee_user_id_', frappe.user.name)
        }
    },
    customer: function (frm) {
        set_value(frm)
        let doc_name = frm.doc.doctype.toLowerCase()
        let tab_name = 'address_and_contact_tab'
        $(`a[id="${doc_name}-${tab_name}-tab"]`).hide();
    },
    on_submit: function (frm) {
        lead_status(frm)
    }
});
function set_value(frm) {
    if (frm.doc.customer) {
        let field_value_customer = [
            'custom_first_name', 'gender', 'custom_mobile_number', 'custom_member_group', 'custom_taluka', 'custom_location', 'custom_full_address',
            'custom_last_name', 'custom_date_of_birth', 'custom_alteranate_mobile_number', 'custom_particular', 'custom_district_', 'custom_pin_code',
            'custom_city', 'custom_full_address'
        ];
        let sales_order_field_name = [
            'custom_first_name', 'custom_gender', 'custom_mobile_number', 'custom_member_group', 'custom_taluka', 'custom_location', 'custom_full_address',
            'custom_last_name', 'custom_date_of_birth', 'custom_alternate_mobile_number', 'custom_particular', 'custom_district', 'custom_pin_code', 'custom_city',
            'custom_delivery_address'
        ];
        field_value_customer.forEach((field_value, index) => {
            frappe.db.get_value('Customer', frm.doc.customer, field_value)
                .then(r => {
                    if (r.message) {
                        let result_object = r.message;
                        let first_key = Object.keys(result_object)[0];
                        let first_value = result_object[first_key];
                        frm.set_value(sales_order_field_name[index], first_value);
                    }
                });
        });
    }
}
function hide_button_and_fields(frm) {
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        const fieldsToHide = [
            'po_no', 'accounting_dimensions_section', 'currency_and_price_list',
            'sec_warehouse',
            'base_total_taxes_and_charges', 'section_break_48', 'tax_category',
            'shipping_rule', 'incoterm'
        ];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });

        // Hide sections
        const tab_break_to_hide = ['sales-order-more_info-tab', 'sales-order-contact_info-tab'];
        let doc_name = frm.doc.doctype.toLowerCase()
        tab_break_to_hide.forEach(tab_name => {
            $(`a[id="${tab_name}"]`).hide()
        });
        setTimeout(function () {
            // Create button hide
            $(frm.wrapper).find('div.inner-group-button[data-label = "Status"]').remove()
        }, 200);

        const button_to_hide = ['Pick List', 'Delivery Note', 'Work Order', 'Material Request', 'Request for Raw Materials',
            'Purchase Order', 'Project', 'Subscription', 'Payment Request']
        var buttons_formatted = button_to_hide.map(function (button_name) {
            return button_name.replace(/\s/g, '%20');
        });
        setTimeout(function () {
            buttons_formatted.forEach(button => {
                $(frm.wrapper).find(`a.dropdown-item[data-label = "${button}"]`).remove()
                console.log(`a.dropdown-item[data-label = "${button}"]`);
            })
        }, 200);

    }
}
function lead_status(frm) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Lead',
            filters: [
                ['first_name', '=', frm.doc.custom_first_name],
                ['last_name', '=', frm.doc.custom_last_name],
                ['mobile_no', '=', frm.doc.custom_mobile_number],
                ['phone', '=', frm.doc.custom_alternate_mobile_number],
            ],
            fields: ['name', 'custom_lead_status']  // Fetch the 'name' field as it's needed to identify the lead to update
        },
        callback: function (response) {
            var leads = response.message;
            // Update the status of each lead
            leads.forEach(function (lead) {
                frappe.call({
                    method: 'frappe.client.set_value',
                    args: {
                        'doctype': 'Lead',
                        'name': lead.name,
                        'fieldname': 'custom_lead_status',
                        'value': 'Completed'  // Replace 'New Status' with the actual status you want to set
                    },
                });

            });
        }
    });
}
function set_warehouse_in_items(frm) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Employee',
            filters: [
                ['personal_email', '=', frappe.session.user]
            ],
            fields: ['custom_store']
        },
        callback: function (r) {
            if (r.message.length > 0) {
                let employee = r.message[0];
                frm.doc.items.forEach((item, index) => {
                    frappe.model.set_value(item.doctype, item.name, 'warehouse', employee.custom_store);
                    console.log(employee.custom_store)
                });
            }
        }
    });
}
function deafult_employee_branch_store_cost_center(frm) {
    if (frappe.session.user != 'anwar@standardtouch.com') {
        if (frm.is_new()) {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Employee',
                    filters: [
                        ['personal_email', '=', frappe.session.user]
                    ],
                    fields: ['employee_name', 'branch', 'name', 'custom_assign_employee_to_multiple_branch']
                },
                callback: function (r) {
                    if (r.message) {
                        let employee = r.message[0]
                        console.log(employee);
                        frm.set_value('custom_employee_id', employee.name)
                        if (employee.custom_assign_employee_to_multiple_branch == 1) {
                            frm.set_df_property('custom_branch', 'reqd', 1)
                            frm.set_value('custom_branch', '')
                        }
                        else {
                            frm.set_value('custom_branch', employee.branch)
                        }
                    }
                }
            })
        }
    }
}
function set_cost_center_in_taxes_and_warehouse_in_item(frm) {
    frm.doc.taxes.forEach((item, index) => {
        frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.custom_cost_center);
    });
    frm.doc.items.forEach((item, index) => {
        frappe.model.set_value(item.doctype, item.name, 'warehouse', frm.doc.custom_store);
    });
    frm.refresh_field('taxes');
    frm.refresh_field('items');
};