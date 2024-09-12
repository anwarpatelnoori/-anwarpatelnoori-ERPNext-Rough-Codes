frappe.ui.form.on('Purchase Receipt', {
    refresh:function(frm) {
        hide_field(frm)
        // if (frm.doc.__islocal){
        //     frm.set_value('custom_current_employee_user_id',frappe.user.name)
        // }
    },
    before_load: function (frm) {
        hide_field(frm)
        // default_employee(frm)
    },
    onload: function (frm) {
        hide_field(frm)
        // default_employee(frm)
    },
    before_save: function (frm) {
        // default_cost_center(frm)
    }
})
function hide_field(frm) {
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        let hide_fields = [
            'accounting_dimensions_section','currency_and_price_list','scan_barcode','rejected_warehouse','is_subcontracted','shipping_rule','incoterm','raw_material_details','is_reverse_charge','apply_putaway_rule','disable_rounded_total','base_taxes_and_charges_deducted','base_taxes_and_charges_added','taxes_and_charges_added','base_total_taxes_and_charges','taxes_and_charges_deducted','custom_section_break_iupkn','section_break_42','tax_category','supplier_delivery_note'
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