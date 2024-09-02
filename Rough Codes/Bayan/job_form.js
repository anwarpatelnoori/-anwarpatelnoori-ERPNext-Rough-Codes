const saveButton = document.querySelector('.submit-btn');
if (saveButton) {
    saveButton.addEventListener('click', function () {
        const message = frappe.msgprint({
            title: __('Please wait'),
            indicator: 'blue',
            message: __('Your application is being saved. Please wait...')
        });

        // Hide the message after 2 seconds
        setTimeout(function () {
            message.hide();
        }, 6000);
    });
}
// Bind the change event for the checkbox
$('[data-fieldname="custom_same_address"]').change(function () {
    same_address();
});

function same_address() {
    const current_street_address = frappe.web_form.get_value('custom_street_address_copy')
    const current_citytown = frappe.web_form.get_value('custom_citytown_copy')
    const current_state = frappe.web_form.get_value('custom_state_copy')
    const current_country = frappe.web_form.get_value('custom_country_copy')
    const current_zip_code = frappe.web_form.get_value('custom_zip_code')

    const perm_street_address = 'custom_street_address'
    const perm_citytown = 'custom_citytown'
    const perm_state = 'custom_state'
    const perm_country = 'country'
    const perm_zip_code = 'custom_zip_code_copy'
    if ($('[data-fieldname="custom_same_address"]').is(':checked')) {
        frappe.web_form.set_value(perm_street_address, current_street_address)
        frappe.web_form.set_value(perm_citytown, current_citytown)
        frappe.web_form.set_value(perm_state, current_state)
        frappe.web_form.set_value(perm_country, current_country)
        frappe.web_form.set_value(perm_zip_code, current_zip_code)

    }
    else {
        frappe.web_form.set_value(perm_street_address, '')
        frappe.web_form.set_value(perm_citytown, '')
        frappe.web_form.set_value(perm_state, '')
        frappe.web_form.set_value(perm_country, '')
        frappe.web_form.set_value(perm_zip_code, '')
    }
}

frappe.web_form.on('custom_first_name', set_full_name);
frappe.web_form.on('custom_middle_name_', set_full_name);
frappe.web_form.on('custom_last_name', set_full_name);

function set_full_name(){
    let first_name = frappe.web_form.get_value('custom_first_name') || ''
    let middle_name = frappe.web_form.get_value('custom_middle_name_') || ''
    let last_name = frappe.web_form.get_value('custom_last_name') || ''
    let full_name = `${first_name} ${middle_name} ${last_name}`.replace(/\s+/g, ' ').trim();

    frappe.web_form.set_value('applicant_name',full_name)
}
