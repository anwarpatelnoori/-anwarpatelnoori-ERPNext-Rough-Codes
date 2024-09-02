frappe.ui.form.on('Demo Request', {
    after_workflow_action: function (frm) {
        demo_pending_review_state(frm)
        link_demo_with_job_applicant(frm)
    },
})
function demo_pending_review_state(frm){
    if (frm.doc.workflow_state === 'Demo Submitted') {
        console.log('hellos')
        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'Job Applicant',
                name: frm.doc.custom_applicant_id
            },
            callback: function (response) {
                var job_applicant = response.message;
                if (job_applicant.workflow_state === 'Sent Demo Request') {
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            doctype: 'Job Applicant',
                            name: frm.doc.custom_applicant_id,
                            fieldname: 'workflow_state',
                            value: 'Demo Received - Pending Review'
                        },
                        callback: function () {
                        }
                    });
                }
            }
        });
    }

}
function link_demo_with_job_applicant(frm){
    if (frm.doc.workflow_state === 'Demo Submitted') {

        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'Job Applicant',
                name: frm.doc.custom_applicant_id
            },
            callback: function (r) {
                if (r.message) {
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            doctype: 'Job Applicant',
                            name: frm.doc.custom_applicant_id,
                            fieldname: {
                                'custom_demo_request_': frm.doc.custom_applicant_id
                            }
                        },
                        callback: function (response) {
                            if (response) {
                                frappe.msgprint('Demo Submitted Successfully');
                            }
                        }
                    });
                }
            }
        });
    }

}