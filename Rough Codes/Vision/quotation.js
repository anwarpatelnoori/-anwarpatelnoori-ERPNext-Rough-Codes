// Event handlers for the Quotation form
frappe.ui.form.on('Quotation', {
    before_load: function (frm) {
        hide_fields(frm)
        set_value(frm);
        deafult_branch(frm)
    },
    before_save: function (frm) {
        set_cost_center(frm)
    },
    onload: function (frm) {
        $('div[data-fieldname="valid_till"] label.control-label').text('Delivery Date');
        setTimeout(() => frm.set_df_property('customer_name', 'hidden', 1), 1);
    },
    refresh: function (frm) {
        hide_fields(frm)
    },
    party_name: function (frm) {
        hide_fields(frm)
        set_value(frm);
    },
    after_save: function (frm) {
        hide_fields(frm)
        hide_button(frm);
    },
    on_submit: function (frm) {
        lead_status(frm);
    },
    status: function (frm) {
        console.log('status calling function');
        lead_status(frm)
    },
    timeline_refresh: function (frm) {
        if (frm.doc.status === 'Lost') {
            console.log('timeline calling');
            lead_status(frm);
        }
    }
});
// Child Table
frappe.ui.form.on('Quotation Item', {
    item_code: function (frm, cdt, cdn) {
        set_warehouse_in_items(frm)
    }
})

// All function
function set_cost_center(frm) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Employee',
            filters: [
                ['personal_email', '=', frappe.session.user]
            ],
            fields: ['custom_cost_center']
        },
        callback: function (r) {
            if (r.message.length > 0) {
                let employee = r.message[0];
                frm.doc.taxes.forEach((item, index) => {
                    frappe.model.set_value(item.doctype, item.name, 'cost_center', employee.custom_cost_center);
                });
            }
        }
    });
    frm.refresh_field('taxes');

}

function hide_fields(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        frm.set_value('quotation_to', 'Lead'); // Setting default value
        $('div[data-fieldname="valid_till"] label.control-label').text('Delivery Date'); // Changing label

        // Hide specific fields
        const fieldsToHide = [
            'quotation_to', 'currency_and_price_list', 'scan_barcode',
            'section_break_44', 'tax_category', 'shipping_rule', 'incoterm'
        ];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });

        // Hide specific sections
        const sectionsToHide = ['address_and_contact_tab', 'terms_tab', 'more_info_tab'];
        let docName = frm.doc.doctype.toLowerCase();
        sectionsToHide.forEach(tabName => {
            $(`a[id="${docName}-${tabName}-tab"]`).hide();
        });
    }
}
// Function definitions
function set_value(frm) {
    if (frm.is_new()){
        console.log('calling set_value');
        if (frm.doc.party_name) {
            console.log('inside set_value');
            const fieldMapping = [
                ['first_name', 'custom_first_name'],
                ['last_name', 'custom_last_name'],
                ['mobile_no', 'custom_mobile_number'],
                ['phone', 'custom_alternate_mobile_number'],
                ['custom_location', 'custom_location'],
                ['custom_pin_code', 'custom_pin_code'],
                ['custom_member_group', 'custom_member_group'],
                ['custom_particular', 'custom_particular'],
                ['custom_full_address', 'custom_full_address'],
                ['custom_city', 'custom_city'],
                ['custom_district_', 'custom_district'],
                ['custom_date_of_birth', 'custom_date_of_birth'],
                ['custom_taluka', 'custom_taluka']
            ];
    
            fieldMapping.forEach(([srcField, destField]) => {
                frappe.db.get_value('Lead', frm.doc.party_name, srcField)
                    .then(r => {
                        if (r.message) {
                            let value = r.message[srcField];
                            frm.set_value(destField, value);
                            console.log(destField, value, srcField);
                        }
                    });
            });
            console.log('done');
        }
    }
}

function hide_button(frm) {
    let user = frappe.user.name; // Ensure user is defined within the function scope
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        setTimeout(() => $(frm.wrapper).find('a.dropdown-item[data-label="Subscription"]').remove(), 200);
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
                if (frm.doc.status === 'Partially Ordered' || frm.doc.status === 'Open') {
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            'doctype': 'Lead',
                            'name': lead.name,
                            'fieldname': 'custom_lead_status',
                            'value': 'In Progress'  // Replace 'New Status' with the actual status you want to set
                        },
                    });
                }
                else if (frm.doc.status === 'Ordered') {
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            'doctype': 'Lead',
                            'name': lead.name,
                            'fieldname': 'custom_lead_status',
                            'value': 'Completed'  // Replace 'New Status' with the actual status you want to set
                        },
                    });
                }
                else if (frm.doc.status === 'Lost') {
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            'doctype': 'Lead',
                            'name': lead.name,
                            'fieldname': 'custom_lead_status',
                            'value': 'Cancelled'  // Replace 'New Status' with the actual status you want to set
                        },
                    });
                }
            });
        }
    });
}
function deafult_branch(frm) {
    if (frm.is_new()) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Employee',
                filters: [
                    ['personal_email', '=', frappe.session.user]
                ],
                fields: ['employee_name', 'branch']
            },
            callback: function (r) {
                if (r.message) {
                    let employee = r.message[0]
                    console.log(employee);
                    frm.set_value('custom_branch', employee.branch)
                }
            }
        })
    }
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
                });
            }
        }
    });
}