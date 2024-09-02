frappe.ui.form.on('Stock Entry', {
    onload: function (frm) {
        hide_field_set_value(frm)
        if(frm.is_new()){
            warehouse_set(frm)
        }
    },



});
function hide_field_set_value(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com'){
        let child_table_read_only = ["s_warehouse", "t_warehouse", "basic_rate", "uom"];
        child_table_read_only.forEach(field => {
            frappe.meta.get_docfield("Stock Entry Detail", field).read_only = 1;
        });
        // Hide specific fields and sections
        const fieldsToHide = ['scan_barcode', 'set_posting_time', 'inspection_required', 'bom_info_section', 'get_stock_and_rate', 'posting_date', 'posting_time', 'source_warehouse_address', 'work_order', 'target_warehouse_address', 'to_warehouse', 'from_warehouse', 'apply_putaway_rule', 'add_to_transit', 'total_outgoing_value', 'total_incoming_value', 'value_difference'];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });

        // Hide sections
        const tab_break_to_hide = ['accounting_dimensions_section', 'other_info_tab', 'additional_costs_section'];
        tab_break_to_hide.forEach(tab_name => {
            $(`a[data-fieldname="${tab_name}"]`).hide();
        });
        $('.sidebar').hide();
    }
}
function warehouse_set(frm){
    let user = frappe.user.name;
    if (user === 'kitchen@srconti.com' || user == 'maurya@srconti.com') {
        frm.set_value('from_warehouse', 'SR Kitchen  - SR');
        frm.set_value('stock_entry_type', 'Material Consumption for Manufacture');
        frm.set_value('custom_user', user);
    }
    else if (user == 'restaurant@srconti.com') {
        frm.set_df_property('custom_table_', 'read_only', 0)
        frm.set_df_property('custom_room', 'read_only', 0)
        frm.set_value('from_warehouse', 'SR Restaurants - SR');
        frm.set_value('stock_entry_type', 'Material Consumption for Manufacture');
        frm.set_value('custom_user', user);
    }
    else if (user == 'frontoffice@srconti.com') {
        frm.set_value('from_warehouse', 'SR Front Office - SR');
        frm.set_value('stock_entry_type', 'Material Consumption for Manufacture');
        frm.set_value('custom_user', user);
    }
    else if (user == 'mainoffice@srconti.com') {
        frm.set_value('from_warehouse', 'SR Main Office - SR');
        frm.set_value('stock_entry_type', 'Material Consumption for Manufacture');
        frm.set_value('custom_user', user);
    }
    else if (user == 'maurya@srconti.com') {
        frm.set_value('from_warehouse', 'SR Maurya Hotel - SR');
        frm.set_value('stock_entry_type', 'Material Consumption for Manufacture');
        frm.set_value('custom_user', user);
    }
}