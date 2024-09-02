frappe.ui.form.on('User', {
    refresh: function (frm) {
        frm.add_custom_button(('Set User Permission'), function () {
            frappe.call({
                method: 'frappe.client.insert',
                args: {
                    doc: {
                        doctype: 'User Permission',
                        user: frm.doc.email,
                        allow: 'User',
                        for_value: frm.doc.email,
                    }
                },
                callback: function (response) {
                    if (!response.exc) {
                        frappe.show_alert(__('User Permission created for ' + frm.doc.email));
                    }
                }
            });
        },);
    }
});