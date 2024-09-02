
frappe.ui.form.on('Material Request', {
    onload: function (frm) {
        console.log('it works')
        let user = frappe.user.name;
        if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
            $('.sidebar').hide();
            frm.fields_dict.scan_barcode.$wrapper.hide();
            let tab_to_hide = ['terms_tab', 'more_info_tab', 'connections_tab']
            tab_to_hide.forEach(tab_name => {
                $(`a[data-fieldname="${tab_name}"]`).hide();
            });
            if (user === 'kitchen@srconti.com') {
                frm.set_value({
                    material_request_type: 'Material Transfer',
                    set_warehouse: 'SR Kitchen  - SR',
                    set_from_warehouse: 'SR Stores - SR',
                    custom_user:user
                });
                let child_table_read_only = ["warehouse", "uom"];
                child_table_read_only.forEach(field => {
                    console.log(field)
                    frappe.meta.get_docfield("Material Request Item", field).read_only = 1;
                });
                frm.set_df_property('material_request_type','read_only',1)
                frm.set_df_property('set_from_warehouse', 'hidden', 1);
                frm.set_df_property('set_warehouse', 'hidden', 1);
                frappe.meta.get_docfield("Material Request Item", "warehouse").read_only = 1;
            }
            else if (user === 'housekeeping@srconti.com') {
                frm.set_value({
                    material_request_type: 'Material Transfer',
                    set_warehouse: 'HouseKeeping - SR',
                    set_from_warehouse: 'SR Stores - SR',
                    custom_user:user
                });
                frm.set_df_property('material_request_type','read_only',1)
                frm.set_df_property('set_from_warehouse', 'hidden', 1);
                frm.set_df_property('set_warehouse', 'hidden', 1);
                frappe.meta.get_docfield("Material Request Item", "warehouse").read_only = 1;
            }
            else if (user == 'restaurant@srconti.com') {
                frm.set_value({
                    material_request_type: 'Material Transfer',
                    set_warehouse: 'SR Restaurants - SR',
                    set_from_warehouse: 'SR Stores - SR',
                    custom_user:user
                });
                frm.set_df_property('material_request_type','read_only',1)
                frm.set_df_property('set_from_warehouse', 'hidden', 1);
                frm.set_df_property('set_warehouse', 'hidden', 1);
                frappe.meta.get_docfield("Material Request Item", "warehouse").read_only = 1;
            }
            else if (user == 'frontoffice@srconti.com') {
                frm.set_value({
                    material_request_type: 'Material Transfer',
                    set_warehouse: 'SR Front Office - SR',
                    set_from_warehouse: 'SR Stores - SR',
                    custom_user:user
                });
                frm.set_df_property('material_request_type','read_only',1)
                frm.set_df_property('set_from_warehouse', 'hidden', 1);
                frm.set_df_property('set_warehouse', 'hidden', 1);
                frappe.meta.get_docfield("Material Request Item", "warehouse").read_only = 1;
            }
            else if (user == 'mainoffice@srconti.com') {
                frm.set_value({
                    material_request_type: 'Material Transfer',
                    set_warehouse: 'SR Main Office - SR',
                    set_from_warehouse: 'SR Stores - SR',
                    custom_user:user
                });
                frm.set_df_property('material_request_type','read_only',1)
                frm.set_df_property('set_from_warehouse', 'hidden', 1);
                frm.set_df_property('set_warehouse', 'hidden', 1);
                frappe.meta.get_docfield("Material Request Item", "warehouse").read_only = 1;
            }
            else if (user == 'maurya@srconti.com') {
                frm.set_value({
                    material_request_type: 'Material Transfer',
                    set_warehouse: 'SR Maurya Hotel - SR',
                    set_from_warehouse: 'SR Stores - SR',
                    custom_user:user
                });
                frm.set_df_property('material_request_type','read_only',1)
                frm.set_df_property('set_from_warehouse', 'hidden', 1);
                frm.set_df_property('set_warehouse', 'hidden', 1);
                frappe.meta.get_docfield("Material Request Item", "warehouse").read_only = 1;
            }
        }
    }
},);
