frappe.ui.form.on('Payment Entry', {
    refresh(frm) {
        hide_fields(frm)
        if(frm.is_new()){
            frm.set_value('cost_center', 'Main - SR');
        }

    }
})
function hide_fields(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        frm.set_value('cost_center', 'Main - SR');

        // Hide specific fields
        const fieldsToHide = [
            'taxes_and_charges_section', 'section_break_56', 'section_break_60', 'deductions_or_loss_section',
            'accounting_dimensions_section', 'section_break_12', 'subscription_section','section_break_34','paid_to',
            'paid_to_account_currency','mode_of_payment'
        ];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });


    }
}