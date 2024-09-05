frappe.ui.form.on('Employee', {
    refresh: function (frm) {
        field_tab_hide(frm)
        if (frm.doc.user_id) {
            read_only_branch(frm)
        }
    },
    custom_assign_employee_to_multiple_branch: function (frm) {
        if (frm.doc.custom_assign_employee_to_multiple_branch == 1) {
            display_all_branch(frm)
        }
    },
    custom_addremove_branch: function(frm){
        edit_only_branch(frm)
    }
});
// Child Table Branch and Store
frappe.ui.form.on('Branch and Store', {
    custom_select_branch_and_store_remove: function(frm, cdt, cdn) {
        // Get the row data before it's removed using frm.doc
        let removed_row = frappe.get_doc(cdt, cdn);
        
        // Check if removed_row is valid
        if (removed_row) {
            console.log('Removed Row Data:', removed_row);
        } else {
            console.log('Removed Row Data is undefined');
        }
    }
});



function field_tab_hide(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        const fieldsToHide = [
            'employment_type', 'reports_to', 'grade', 'company_email', 'prefered_email',
            'prefered_contact_email', 'unsubscribed', 'attendance_device_id', 'default_shift', 'erpnext_user',
            'company_details_section', 'shift_request_approver', 'create_user_permission'
        ];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });
        const tab_break_to_hide = ['Joining', 'Personal', 'Profile', 'Exit']
        tab_break_to_hide.forEach(tab_name => {
            $(`a[aria-controls="${tab_name}"]`).hide()
        });
        // frm.set_df_property('user_id', 'read_only', 1)
    }
}

function display_all_branch(frm) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Branch',
            fields: ['name', 'custom_store', 'custom_cost_center'],
        },
        callback: function (r) {
            if (r.message) {

                // clear existing table
                frm.clear_table('custom_select_branch_and_store')

                // adding new rows for each branch
                r.message.forEach(function (branch) {
                    let row = frm.add_child('custom_select_branch_and_store')
                    frappe.model.set_value(row.doctype, row.name, 'branch', branch.name);
                    frappe.model.set_value(row.doctype, row.name, 'store', branch.custom_store);
                    frappe.model.set_value(row.doctype, row.name, 'cost_center', branch.custom_cost_center);
                })
                frm.refresh_field("custom_select_branch_and_store");
            }
        }
    });
}

function read_only_branch(frm) {
    // Array of field names
    const fields = [
        'custom_create_user',
        'create_user_permission',
        'custom_select_branch_and_store',
        'custom_select_role',
        'custom_password',
        'custom_assign_employee_to_multiple_branch',
        'personal_email'
    ];

    // Loop through the fields and set them to read-only
    fields.forEach(function (field) {
        frm.set_df_property(field, 'read_only', 1);
    });
}
function edit_only_branch(frm) {
    // Array of field names
    const fields = [
        'custom_create_user',
        'create_user_permission',
        'custom_select_branch_and_store',
        'custom_select_role',
        'custom_password',
        'custom_assign_employee_to_multiple_branch',
        'personal_email'
    ];

    // Loop through the fields and set them to read-only
    if (frm.doc.custom_addremove_branch==1){
        fields.forEach(function (field) {
            frm.set_df_property(field, 'read_only', 0);
        });
    }
    else{
        fields.forEach(function (field) {
            frm.set_df_property(field, 'read_only', 1);
        });
    }
}
function get_branch_and_store(frm) {
    const branch = [];
    const store = [];
    const cost_center = [];
    frm.doc.custom_select_branch_and_store.forEach(function (row) {
        branch.push(row.branch);
        store.push(row.store);
        cost_center.push(row.cost_center);
    });
    console.log('Branch:', branch);
    console.log('Store:', store);
    console.log('Cost Center:', cost_center);
    
}