frappe.ui.form.on('Job Applicant', {
    before_load: function (frm) {
        hide_fields_and_tabs(frm);
    },
    onload: function (frm) {
        hide_fields_and_tabs(frm);
    },
    refresh: function (frm) {
        hide_fields_and_tabs(frm);
    },
});

function hide_fields_and_tabs(frm) {
    console.log(frappe.user_roles)
    if (frappe.user_roles.includes('Applicant Stage 1')) {
        console.log(frappe.user_roles)
        hide_fields(frm);
        $(document).ready(function () {
            $(".section-head.collapsible").each(function () {
                if ($(this).next(".section-body").text().trim() === "No Interview has been scheduled.") {
                    $(this).next(".section-body").remove(); // Remove the section-body element
                    $(this).remove(); // Remove the section-head element
                }
            });
            $("button.btn.btn-default.ellipsis").hide();
        });

        // hide_tabs(frm);
    }
}

function hide_fields(frm) {
    const fieldsToHide = [
        'undefined', 'custom_demo_video_rating', 'custom_resume_rating', 'source_and_rating_section', 'country', 'designation'

        , 'custom_interviews_availiablity'];
    const fieldsToReadOnly = [

        'custom_first_name', 'custom_middle_name_', 'custom_last_name', 'applicant_name', 'email_id', 'phone_number', 'job_title', 'custom_street_address', 'custom_citytown', 'custom_state', 'custom_zip_code_copy', 'custom_street_address_copy'
        , 'custom_zip_code_copy', 'custom_country_copy', 'custom_citytown_copy', 'custom_zip_code', 'custom_phone_number_copy', 'custom_state_copy'

        , 'resume_attachment', 'resume_link', 'lower_range', 'upper_range', 'cover_letter', 'custom_what_date_are_you_available_to_start_work', 'custom_working_time', 'status', 'custom_demo_request_', 'custom_demo_link']
    fieldsToHide.forEach(fieldname => {
        frm.set_df_property(fieldname, 'hidden', 1);
    });

    fieldsToReadOnly.forEach(fieldname => {
        frm.set_df_property(fieldname, 'read_only', 1);
    });
}

