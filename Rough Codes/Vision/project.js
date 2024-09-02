frappe.ui.form.on('Project', {
	refresh(frm) {
		hide_fields(frm)
	}
})
function hide_fields(frm){
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        // Hide specific fields and sections
        const fieldsToHide = [
            'project_template','is_active','department','percent_complete_method','percent_complete','users_section','monitor_progress','project_type',
            'cost_center'
        ];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });
        
        // Hide sections
        const tab_break_to_hide = [];
        let doc_name = frm.doc.doctype.toLowerCase()
        tab_break_to_hide.forEach(tab_name => {
            $(`a[id="${tab_name}"]`).hide()
        });
    }
}