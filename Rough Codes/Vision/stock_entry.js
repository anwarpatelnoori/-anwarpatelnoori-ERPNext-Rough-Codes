frappe.ui.form.on('Stock Entry', {
    before_load: function (frm) {
        hide_fields(frm)
        hiding_link_options_with_query(frm)
    },
    onload: function (frm) {
        hide_fields(frm)
        hiding_link_options_with_query(frm)
    },
    refresh: function (frm) {
        hide_fields(frm)
        hiding_link_options_with_query(frm)
    },
    after_save: function (frm) {
    },
    stock_entry_type:function(frm){
        hiding_link_options_with_query(frm)
        if(frm.doc.stock_entry_type == 'Material Receipt'){
            $(`a[id="stock-entry-additional_costs_section-tab"]`).hide()
        }
    }
});
function hide_fields(frm){
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        // Hide specific fields and sections
        const fieldsToHide = [
            'posting_date','posting_time','set_posting_time','inspection_required','bom_info_section','scan_barcode',
            'get_stock_and_rate',
        ];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });

        // Hide sections
        const tab_break_to_hide = ['stock-entry-other_info_tab-tab','stock-entry-accounting_dimensions_section-tab'
        ];
        let doc_name = frm.doc.doctype.toLowerCase()
        tab_break_to_hide.forEach(tab_name => {
            $(`a[id="${tab_name}"]`).hide()
        });
    }
}
function hiding_link_options_with_query(frm){
    frm.fields_dict['stock_entry_type'].get_query = function() {
        return {
            filters: [
                ["Stock Entry Type", "name", "not in", [
                    "Manufacture",
                    "Material Consumption for Manufacture",
                    "Material Transfer for Manufacture",
                    "Send to Subcontractor",
                    "Repack"
                ]]
            ]
        };
    }
};


