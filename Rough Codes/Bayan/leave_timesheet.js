frappe.ui.form.on('Timesheet', {
    refresh: function (frm) {
        disbale_timesheet_onleave(frm)
    }
});

frappe.ui.form.on('Timesheet Detail', {
 time_logs_add(frm, cdt, cdn) { 
        // const child = frm.add_child('time_logs')
        const child = locals[cdt][cdn];
        console.log(child)
        const now = new Date();
        frappe.model.set_value(child.doctype, child.name, 'from_time', '2024-08-28')
    }
})

function disbale_timesheet_onleave(frm){
    let user = frappe.user.name
    let today = new Date()


    let dateString = cur_frm.doc.custom_current_date; // "2024-11-03"
    let dateObject = new Date(dateString);


    frappe.call({
        method:'frappe.client.get_list',
        args:{
            doctype:'Leave Application',
            fiters:{
                'from_date':['>=',dateObject],
                'to_date':['<=',dateObject],
                'custom_employee_user_id':user
            },
            fields: ['name', 'from_date', 'to_date']
        },
        callback:function(r){
            if(r){
                frappe.msgprint('Leave Exisits');
                console.log(r);
                console.log(typeof(r.message[0].from_date))
            }
            else{
                frappe.msgprint('Not Exisits')
            }
        }
    })
}

