frappe.ui.form.on('User', {
    refresh: function (frm) {
        hide_fields(frm)
    }
})
function hide_fields(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        let all_fields_to_hide = ["time_zone", "desk_settings_section", "navigation_settings_section", "list_settings_section", "reset_password_key", "last_reset_password_key_generated_on", "last_password_reset_date", "redirect_url", "document_follow_notifications_section", "email_signature", "workspace_section", "app_section", "sb2", "sb3", "third_party_authentication", "api_access","form_settings_section","email_settings"]
        all_fields_to_hide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });
    }
}