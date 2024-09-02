frappe.ui.form.on('Expense Claim', {
    refresh: function (frm) {
        default_employee(frm)
    },
    before_save: function (frm) {
        cost_center(frm)
    }
})
function cost_center(frm) {
    frm.doc.expenses.forEach((item, index) => {
        frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.cost_center);
    });
    if (frm.doc.taxes !== undefined) {
        frm.doc.taxes.forEach((item, index) => {
            frappe.model.set_value(item.doctype, item.name, 'cost_center', frm.doc.cost_center);
        });
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
                fields: ['name', 'custom_cost_center', 'expense_approver']
            },
            callback: function (r) {
                if (r.message) {
                    let employee = r.message[0]
                    frm.set_value('employee', employee.name)
                    frm.set_value('cost_center', employee.custom_cost_center)
                    frm.set_value('expense_approver', employee.expense_approver)
                    frm.set_df_property('employee', 'read_only', 1);
                    frm.set_df_property('cost_center', 'read_only', 1);
                    frm.set_df_property('expense_approver', 'read_only', 1);
                }
            }
        })
    }
    if (!frm.is_new()) {
        frm.set_df_property('employee', 'read_only', 1);
        frm.set_df_property('cost_center', 'read_only', 1);
        frm.set_df_property('expense_approver', 'read_only', 1);
    }

}
