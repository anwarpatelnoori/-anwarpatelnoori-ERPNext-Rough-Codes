frappe.ui.form.on('Purchase Invoice', {
    setup: function (frm) {
        customize_puchase_inovie(frm)
        if (frm.is_new()) {
            set_value(frm)
        }
    },
    before_load: function (frm) {
        customize_puchase_inovie(frm)
        if (frm.is_new()) {
            set_value(frm)
        }
    },
    on_load: function (frm) {
        customize_puchase_inovie(frm)
        if (frm.is_new()) {
            set_value(frm)
        }
    },
    refresh: function (frm) {
        customize_puchase_inovie(frm)
        if (frm.is_new()) {
            set_value(frm)
        }
    }
});

function customize_puchase_inovie(frm) {

    let user = frappe.user.name;
    if (user == 'store@srconti.com') {
        $('.sidebar').hide();
        // Hide specific fields and sections
        let fieldsToHide = [
            'supplier_invoice_details', 'accounting_dimensions_section', 'currency_and_price_list',
            'sec_warehouse', 'taxes_section', 'section_break_51', 'totals', 'section_break_49', 'section_break_44',
            'tax_withheld_vouchers_section', 'sec_tax_breakup', 'pricing_rule_details', 'raw_materials_supplied',
            'naming_series', 'is_paid', 'is_return', 'apply_tds', 'due_date', 'set_posting_time',
            'set_posting_time'
        ]
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });
        // Hide tabs
        const tab_break_to_hide = ['payments_tab', 'address_and_contact_tab', 'terms_tab', 'more_info_tab', 'connections_tab'];
        tab_break_to_hide.forEach(tab_name => {
            $(`a[data-fieldname="${tab_name}"]`).hide();
        });
    }
}
function set_value(frm) {
    let user = frappe.user.name;
    if (user == 'store@srconti.com') {
        $('.sidebar').hide();
        frm.set_value('update_stock', 1)
        frm.set_value('set_warehouse', 'SR Stores - SR')
        frm.set_value('set_posting_time', 1)
    }

}
