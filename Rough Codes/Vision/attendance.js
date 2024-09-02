    frappe.ui.form.on('Attendance', {
        after_save:function(frm) {
            remove_submit(frm)
            approve_attendance(frm)
        },
        refresh: function(frm){
            approve_attendance(frm)
            frm.set_df_property('details_section', 'hidden', 1);
        },
        setup:function(frm){
            default_employee(frm)
        }
    })

    function remove_submit(frm){
        let employee = frm.doc.custom_employee_email_id
        let current_user = frappe.session.user
        if (employee == current_user){
            $("button.btn-primary[data-label='Submit']").remove();
            $("div.form-message").filter(function() {
                return $(this).text().trim() === "Submit this document to confirm";
            }).remove();
        }
    }
    function approve_attendance(frm){
        let attendance_approver = frm.doc.custom_attendance_approver
        let current_user = frappe.session.user
        if (attendance_approver != current_user){
            $("button.btn-primary[data-label='Submit']").remove();
            $("div.form-message").filter(function() {
                return $(this).text().trim() === "Submit this document to confirm";
            }).remove();
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
                    fields: ['name','leave_approver']
                },
                callback: function (r) {
                    if (r.message) {
                        let employee = r.message[0]
                        console.log(employee);
                        frm.set_value('employee', employee.name)
                        frm.set_value('custom_attendance_approver',employee.leave_approver)
                        frm.set_df_property('employee','hidden',1)
                    }
                }
            })
        }

    }