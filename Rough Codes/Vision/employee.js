frappe.ui.form.on('Employee', {
    before_load: function (frm) {
        field_tab_hide(frm)
    },
    onload: function (frm) {
        field_tab_hide(frm)
    },
    refresh: function (frm) {
        field_tab_hide(frm)
    },
    before_save: function (frm) {
        // if (frm.is_new()) {
        //     create_user_and_set_permissions(frm)
        // }
    },
    after_save: function (frm) {
        // frm.set_value('user_id', frm.doc.personal_email)
    },
    custom_assign_employee_to_multiple_branch: function (frm) {
        if (frm.doc.custom_assign_employee_to_multiple_branch == 1) {
            display_all_branch(frm)
        }
    }
});

function field_tab_hide(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        const fieldsToHide = [
            'employment_type', 'reports_to', 'grade', 'company_email', 'prefered_email',
            'prefered_contact_email', 'unsubscribed', 'attendance_device_id', 'default_shift','erpnext_user',
            'company_details_section', 'shift_request_approver','create_user_permission'
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
function create_user_and_set_permissions(frm) {
    let first_name = frm.doc.first_name;
    let email = frm.doc.personal_email;
    let role = frm.doc.custom_select_role;
    let new_password = frm.doc.custom_password;

    if (frm.doc.custom_create_user == 1) {
        // Create user
        frappe.call({
            method: 'frappe.client.insert',
            args: {
                doc: {
                    doctype: 'User',
                    first_name: first_name,
                    email: email,
                    module_profile: 'Empty',
                    role_profile_name: role,
                    send_welcome_email: 0,
                    new_password: new_password
                }
            },
            callback: function (response) {
                if (!response.exc) {
                    // Show alert that user has been created
                    frappe.show_alert(__('User created for ' + frm.doc.first_name));

                    let default_cost_center = 'Main - VE'
                    // Set user permissions for single branch
                    if (frm.doc.custom_assign_employee_to_multiple_branch === 0) {
                        let branch = frm.doc.branch;
                        let store = frm.doc.custom_store;
                        let cost_center = frm.doc.custom_cost_center

                        frappe.call({
                            method: 'frappe.client.insert',
                            args: {
                                doc: {
                                    doctype: 'User Permission',
                                    user: email,
                                    allow: 'Branch',
                                    for_value: branch
                                }
                            },
                        });

                        // Set permission for Warehouse
                        frappe.call({
                            method: 'frappe.client.insert',
                            args: {
                                doc: {
                                    doctype: 'User Permission',
                                    user: email,
                                    allow: 'Warehouse',
                                    for_value: store
                                }
                            },
                        });

                        // set permissions for cost center
                        frappe.call({
                            method: 'frappe.client.insert',
                            args: {
                                doc: {
                                    doctype: 'User Permission',
                                    user: email,
                                    allow: 'Cost Center',
                                    for_value: cost_center
                                }
                            },
                        });

                        // default cost center permission
                        frappe.call({
                            method: 'frappe.client.insert',
                            args: {
                                doc: {
                                    doctype: 'User Permission',
                                    user: email,
                                    allow: 'Cost Center',
                                    for_value: default_cost_center
                                }
                            },
                        });

                    }
                    // set multipermissions 
                    else if (frm.doc.custom_assign_employee_to_multiple_branch == 1) {
                        let branch_store = frm.doc.custom_select_branch_and_store;
                        branch_store.forEach(element => {
                            let branch = element.branch;
                            let store = element.store;
                            let cost_center = element.cost_center

                            // Set permission for Branch
                            frappe.call({
                                method: 'frappe.client.insert',
                                args: {
                                    doc: {
                                        doctype: 'User Permission',
                                        user: email,
                                        allow: 'Branch',
                                        for_value: branch
                                    }
                                },
                            });

                            // Set permission for Warehouse
                            frappe.call({
                                method: 'frappe.client.insert',
                                args: {
                                    doc: {
                                        doctype: 'User Permission',
                                        user: email,
                                        allow: 'Warehouse',
                                        for_value: store
                                    }
                                },
                            });

                            // set permissions for cost center
                            frappe.call({
                                method: 'frappe.client.insert',
                                args: {
                                    doc: {
                                        doctype: 'User Permission',
                                        user: email,
                                        allow: 'Cost Center',
                                        for_value: cost_center
                                    }
                                },
                            });
                        });
                        frappe.call({
                            method: 'frappe.client.insert',
                            args: {
                                doc: {
                                    doctype: 'User Permission',
                                    user: email,
                                    allow: 'Cost Center',
                                    for_value: default_cost_center
                                }
                            },
                        });

                    }
                }
            }
        });
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
