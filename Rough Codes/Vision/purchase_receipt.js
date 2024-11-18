frappe.ui.form.on('Purchase Receipt', {
    refresh: function (frm) {
        hide_field(frm)
        deafult_employee_branch_store_cost_center(frm)
        if (frm.doc.__islocal) {
            frm.set_value('custom_current_employee_user_id', frappe.user.name)
        }
    },
    before_save: function (frm) {
        set_cost_center_in_taxes_and_warehouse_in_item(frm)
    }
})
function hide_field(frm) {
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        let hide_fields = [
            'accounting_dimensions_section', 'currency_and_price_list', 'scan_barcode', 'rejected_warehouse', 'is_subcontracted', 'shipping_rule', 'incoterm', 'raw_material_details', 'is_reverse_charge', 'apply_putaway_rule', 'disable_rounded_total', 'base_taxes_and_charges_deducted', 'base_taxes_and_charges_added', 'taxes_and_charges_added', 'base_total_taxes_and_charges', 'taxes_and_charges_deducted', 'custom_section_break_iupkn', 'section_break_42', 'tax_category', 'supplier_delivery_note'
        ]
        hide_fields.forEach(field => {
            frm.set_df_property(field, 'hidden', 1)
        })
        let tabs_hide = [
            'Address & Contact', 'Terms', 'More Info'
        ]
        tabs_hide.forEach(tab => {
            $(`a[aria-controls="${tab}"]`).hide();
        })
    }
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
        frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.cost_center);
    });
    frm.doc.items.forEach((item, index) => {
        frappe.model.set_value(item.doctype, item.name, 'warehouse', frm.doc.custom_store);
        frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.cost_center);
    });
    frm.refresh_field('taxes');
    frm.refresh_field('items');
};