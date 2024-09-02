frappe.ui.form.on('Applicant Criminal Background', {
    on_submit: function (frm) {
        link_criminal_with_job_applicant(frm)
    }
})
function link_criminal_with_job_applicant(frm) {
    let applicant_id = frm.doc.applicant_id
    let verfication_file = frm.doc.upload_your_criminal_backgroung_verfication_file

    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Job Applicant',
            name: applicant_id
        },
        callback: function (r) {
            if (r.message) {
                frappe.call({
                    method: 'frappe.client.set_value',
                    args: {
                        doctype: 'Job Applicant',
                        name: applicant_id,
                        fieldname: {
                            'custom_criminal_background_verfication_file': verfication_file
                        }
                    },
                    callback: function (response) {
                        if (response) {
                            frappe.msgprint('Background Verfication File Submitted Successfully ');
                        }
                    }
                });
            }
        }
    });
}