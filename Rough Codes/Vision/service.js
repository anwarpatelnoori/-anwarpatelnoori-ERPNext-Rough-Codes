frappe.ui.form.on("Service", {
    before_load:function(frm){
        deafult_branch(frm)
        lead_data(frm)
    },
    setup: function (frm) {
        frm.compute_total = (frm) => {
            let min_service_charge = frm.doc.minimum_service_charges;
            let discount = frm.doc.discount_on_amount;
            let spare_total = 0;
            frm.doc.spare_part_pricing.forEach(price => {
                spare_total += price.total;
            });
            let sub_total = spare_total + min_service_charge;
            frm.set_value('spare_part_total', spare_total);
            frm.set_value('sub_total', sub_total);
            frm.set_value('total_amount', sub_total);
        };
    },
    minimum_service_charges: calling_calculate_total,
    discount_on_amount: function (frm) {
        let sub_total = frm.doc.sub_total;
        console.log(`sub total is ${sub_total}`);
        let discount_on_amount = frm.doc.discount_on_amount;
        console.log(`discount amount is ${discount_on_amount}`);
        let total_amount = sub_total - discount_on_amount;
        console.log(`total amount is ${total_amount}}`);
        frm.set_value('total_amount', total_amount);
    },
    refresh:function(frm){
        if (frm.doc.workflow_state=='Completed' || frm.doc.workflow_state=='Cancelled by Engineer' || frm.doc.workflow_state=='Customer not Intersted') {
            add_sales_invoice_button(frm)
        }
    }
});

frappe.ui.form.on('Service Pricing Table', {
    item_code: calling_calculate_total,
    quantity: calling_calculate_total,
    spare_part_pricing_remove: remove
});

function calculate_total(frm, cdt, cdn) {
    let child = locals[cdt][cdn];
    let total_price = child.quantity * child.price;
    frappe.model.set_value(cdt, cdn, 'total', total_price);
}

function calling_calculate_total(frm, cdt, cdn) {
    calculate_total(frm, cdt, cdn);
    frm.compute_total(frm);
}

function remove(frm, cdt, cdn) {
    frm.compute_total(frm);
}

function lead_data(frm){
    var customMember = localStorage.getItem('customMemberForService');
    
    if(customMember) {
      // Set the 'member' field value
      frm.set_value('member', customMember);
      
      // Clear the localStorage to prevent unintended reuse
      localStorage.removeItem('customMemberForService');
    }
}
function add_sales_invoice_button(frm) {
    frm.add_custom_button('Sales Invoice', function() {
        // Collect the customer and spare parts data
        let customer_name = frm.doc.member;
        let spare_parts = frm.doc.spare_part_pricing.map(function(spare_part) {
            return {
                item_code: spare_part.item_code,
                item_name: spare_part.item_name,
                quantity: spare_part.quantity,
                price: spare_part.price,
                total: spare_part.total,
            };
        });
        frappe.call({
            method: 'frappe.client.insert',
            args: {
                doc: {
                    doctype: 'Sales Invoice',
                    customer: customer_name,
                    set_warehouse: frm.doc.store,
                    items: [
                        {
                            item_code: 'Minimum Service Charges',
                            item_name: 'Minimum Service Charges',
                            qty: 1,
                            rate: frm.doc.minimum_service_charges,
                            amount: frm.doc.minimum_service_charges
                        },
                        ...spare_parts.map(part => ({
                            item_code: part.item_code,
                            item_name: part.item_name,
                            qty: part.quantity,
                            rate: part.price,
                            amount: part.total
                        }))
                    ],
                    custom_branch: frm.doc.branch,
                    taxes_and_charges: 'Output GST In-state - VE',
                    taxes: [{
                            charge_type: 'On Net Total',
                            account_head: 'Output Tax SGST - VE',
                            rate: 9,
                            description: 'Output GST In-state - VE'
                        },
                        {
                            charge_type: 'On Net Total',
                            account_head: 'Output Tax CGST - VE',
                            rate: 9,
                            description: 'Output GST In-state - VE'
                        }
                    ],
                }
            },
            callback: function(response) {
                if (response.message) {
                    frappe.show_alert({message: 'Sales Invoice Created', indicator: 'green'});
                    frappe.set_route('Form', 'Sales Invoice', response.message.name);
                } else {
                    frappe.msgprint('Failed to create invoice');
                }
            }
        });
        
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
                fields: ['employee_name', 'branch','name']
            },
            callback: function (r) {
                if (r.message) {
                    let employee = r.message[0]
                    console.log(employee);
                    frm.set_value('branch', employee.branch)
                    frm.set_value('employee_code', employee.name)
                    frm.set_df_property('branch', 'read_only', 1);
                    frm.set_df_property('employee_code', 'read_only', 1);
                }
            }
        })
    }
}