frappe.ui.form.on('Purchase Order', {
    refresh(frm) {
        hide_field(frm)
    },
    before_load: function (frm) {
        hide_field(frm)
        default_employee(frm)
    },
    onload: function (frm) {
        hide_field(frm)
        default_employee(frm)
    },
    before_save: function (frm) {
        default_cost_center(frm)
    }
})
function hide_field(frm) {
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        let hide_fields = [
            'apply_tds', 'tax_withholding_category', 'is_subcontracted', 'accounting_dimensions_section',
            'Currency and Price List', 'shipping_rule', 'incoterm', 'tax_category', 'base_rounding_adjustment',
            'rounding_adjustment', 'disable_rounded_total', 'rounded_total', 'base_rounded_total', 'currency_and_price_list',
            'scan_barcode', 'advance_paid'
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
function default_employee(frm) {
    if (frm.is_new()) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Employee',
                filters: [
                    ['personal_email', '=', frappe.session.user]
                ],
                fields: ['employee_name', 'branch', 'custom_store', 'custom_cost_center']
            },
            callback: function (r) {
                if (r.message) {
                    let employee = r.message[0]
                    console.log(employee);
                    frm.set_value('custom_branch', employee.branch)
                    frm.set_value('custom_store', employee.custom_store)
                    frm.set_value('custom_cost_center', employee.custom_cost_center)
                    frm.set_value('set_warehouse',employee.custom_store)

                    frm.set_df_property('custom_branch', 'read_only', 1)
                    frm.set_df_property('custom_store', 'read_only', 1)
                    frm.set_df_property('custom_cost_center', 'read_only', 1)
                }
            }
        })
    }
    else {
        frm.set_df_property('custom_branch', 'read_only', 1)
        frm.set_df_property('custom_store', 'read_only', 1)
        frm.set_df_property('custom_cost_center', 'read_only', 1)
    }
}
function default_cost_center(frm) {
    frm.doc.items.forEach((item, index) => {
        frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.custom_cost_center);
    });
    if (frm.doc.taxes !== undefined) {
        frm.doc.taxes.forEach((item, index) => {
            frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.cost_center);
        });
    }
}