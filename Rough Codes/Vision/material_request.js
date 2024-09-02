frappe.ui.form.on('Material Request', {
    before_load: function (frm) {
        hide_fields(frm)
    },
    onload: function (frm) {
        hide_fields(frm)
    },
    refresh: function (frm) {
        hide_fields(frm)
        default_warehouse(frm)

    },
    material_request_type: function (frm) {
        if (frm.doc.material_request_type === 'Material Transfer') {
            frm.set_df_property('set_from_warehouse', 'label', 'From Branch')
            frm.set_df_property('set_warehouse', 'label', 'To Branch')
        }
        else {
            frm.set_df_property('set_warehouse', 'label', 'Select Your Branch')
        }
    },
    before_save: function (frm) {
        default_cost_center(frm)
    }

})
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
                    frm.set_value('set_warehouse',frm.doc.custom_store)

                    frm.set_df_property('custom_branch', 'read_only', 1)
                    frm.set_df_property('custom_store', 'read_only', 1)
                    frm.set_df_property('custom_cost_center', 'read_only', 1)
                    frm.set_df_property('set_warehouse','read_only', 1)

                }
            }
        })
    }
    else {
        frm.set_df_property('custom_branch', 'read_only', 1)
        frm.set_df_property('custom_store', 'read_only', 1)
        frm.set_df_property('custom_cost_center', 'read_only', 1)
        frm.set_df_property('set_warehouse','read_only', 1)
    }
}
function default_cost_center(frm) {
    frm.doc.items.forEach((item, index) => {
        frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.custom_cost_center);
    });
}
function hide_fields(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        frm.set_df_property('set_warehouse', 'label', 'Select Your Branch')
        $("select[data-fieldname='material_request_type'] option[value='Customer Provided']").remove();
        const fields_to_hide = ['scan_barcode']
        fields_to_hide.forEach(field => {
            frm.set_df_property(field, 'hidden', 1)
        })
        let tab_break_to_hide = ['material-request-terms_tab-tab', 'material-request-more_info_tab-tab']
        tab_break_to_hide.forEach(tab_name => {
            $(`a[id="${tab_name}"]`).hide()
        });
    }
}
