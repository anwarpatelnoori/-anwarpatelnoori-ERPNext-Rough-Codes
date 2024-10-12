frappe.ui.form.on('Purchase Invoice', {
    refresh: function (frm) {       
        default_warehouse(frm)
        hide_fields(frm)
        if (frm.doc.__islocal){
            frm.set_value('custom_current_employee_user_id',frappe.user.name)
        }
    },
    before_save: function (frm) {
        default_cost_center(frm)
    },
    stock_entry_type: function (frm) {
        if (frm.doc.stock_entry_type == 'Material Receipt') {
            $(`a[id="stock-entry-additional_costs_section-tab"]`).hide()
        }
    }
})
function default_cost_center(frm) {
    console.log('Default Cost Center');
    
    if (frm.is_new()){

    }
    frm.doc.items.forEach((item, index) => {
        frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.custom_cost_center);
    });
    if (frm.doc.taxes !== undefined) {
        frm.doc.taxes.forEach((item, index) => {
            frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.cost_center);
        });
    }
}
function hide_fields(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        // Hide specific fields and sections
        const fieldsToHide = [
            'posting_date', 'posting_time', 'set_posting_time', 'apply_tds', 'accounting_dimensions_section', 'scan_barcode',
            'currency_and_price_list', 'tax_category', 'shipping_rule', 'incoterm', 'rounding_adjustment', 'rounding_adjustment', 'total_advance', 'rejected_warehouse',
            'is_subcontracted', 'raw_materials_supplied', 'rounded_total', 'use_company_roundoff_cost_center', 'taxes_and_charges_added', 'taxes_and_charges_deducted'

        ];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });
        // Hide sections
        const tab_break_to_hide = ['purchase-invoice-payments_tab-tab', 'purchase-invoice-terms_tab-tab', 'purchase-invoice-address_and_contact_tab-tab',
            'purchase-invoice-terms_tab-tab', 'purchase-invoice-terms_tab-tab', 'purchase-invoice-more_info_tab-tab'
        ];
        let doc_name = frm.doc.doctype.toLowerCase()
        tab_break_to_hide.forEach(tab_name => {
            $(`a[id="${tab_name}"]`).hide()
        });
    }
}
function default_warehouse(frm) {
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
