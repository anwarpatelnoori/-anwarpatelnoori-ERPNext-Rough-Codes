frappe.ui.form.on('Job Applicant', {
    onload_post_render:function(frm){
        remove_access_of_linked_doctype(frm)
    }
});

function remove_access_of_linked_doctype(frm) {
    if (frappe.user_roles.includes('Applicant Stage 1')) {
        let linked_doctypes = ['country', 'custom_country_copy', 'phone_number', 'custom_contract_letter_name', 'currency', 'employee_referral', 'source_name', 'source', 'designation', 'job_title']
        linked_doctypes.forEach(doctype=>{
            let link = $(`.frappe-control.input-max-width[data-fieldname=${doctype}] .control-value a`);
            let link_text = link.text()
            link.replaceWith(link_text)

        })

    }
}
