frappe.ui.form.on('Lead', {
  before_load: function (frm) {
    hide_fields(frm)
    hide_button(frm)
  },
  after_save: function (frm) {
    hide_fields(frm)
    hide_button(frm)
    service_button(frm)
    add_todo(frm)
  },
  refresh: function (frm) {
    hide_fields(frm)
    hide_button(frm)
    service_button(frm)

  },

  custom_member: function (frm) {
    set_value(frm)
  },
  on_load: function (frm) {
    service_button(frm)
  },
  setup: function (frm) {
    set_warehouse_and_store(frm)
  }

});

function add_todo(frm) {
  if (frm.doc.custom_assign_lead == 1) {
    let email_id = frm.doc.custom_employee_user_id; // Assuming custom_employee_user_id contains the email ID
    frappe.call({
      method: "frappe.desk.form.assign_to.add",
      args: {
        "assign_to": JSON.stringify([email_id]), // Pass email_id directly as a string
        "doctype": "Lead", // Specify the Lead doctype here
        "name": frm.docname, // Assuming docname is relevant to the Lead
        // Add other required data like "description", "assignment_rule", etc.
      },
      callback: function (r) {
      },
    });
  }
  frm.set_df_property('custom_assign_lead', 'hidden', 1)
}

function hide_button(frm) {
  if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {

    setTimeout(function () {
      $(frm.wrapper).find('a.dropdown-item[data-label="Customer"]').remove();
      $(frm.wrapper).find('a.dropdown-item[data-label="Prospect"]').remove();
      $(frm.wrapper).find('a.dropdown-item[data-label="Opportunity"]').remove();
      $(frm.wrapper).find('div.inner-group-button[data-label="Action"]').remove();
      $(frm.wrapper).find('div.menu-btn-group').remove();
    }, 50);
  }
}
function hide_fields(frm) {
  let user = frappe.user.name;
  if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
    console.log(user);
    // Hide specific fields and sections
    const fieldsToHide = [
      'salutation', 'job_title', 'source', 'lead_type', 'middle_name',
      'email_id', 'customer', 'type', 'website', 'whatsapp_no',
      'phone_ext', 'organization_section', 'qualification_tab',
      'other_info_tab', 'country', 'address_section', 'city',
      'request_type', 'status', 'mobile_no', 'phone',
      'first_name', 'last_name'
    ];
    fieldsToHide.forEach(fieldname => {
      frm.set_df_property(fieldname, 'hidden', 1);
    });

    // Hide sections
    const tab_break_to_hide = [
      'accounting_dimensions_section', 'other_info_tab',
      'additional_costs_section'
    ];
    tab_break_to_hide.forEach(tab_name => {
      $(`a[data-fieldname="${tab_name}"]`).hide();
    });
  }
}
function set_value(frm) {
  if (frm.doc.custom_member) {
    let field_value_from_member = [
      'first_name', 'last_name', 'date_of_birth', 'gender',
      'mobile_number', 'alternate_mobile_number', 'talluka',
      'district', 'location', 'pincode', 'group', 'particular',
      'full_address', 'city', 'mobile_number', 'alternate_mobile_number',
      'first_name', 'last_name'
    ];
    let lead_field_name = [
      'first_name', 'last_name', 'custom_date_of_birth', 'gender',
      'mobile_no', 'phone', 'custom_taluka', 'custom_district_',
      'custom_location', 'custom_pin_code', 'custom_member_group',
      'custom_particular', 'custom_full_address', 'custom_city', 'custom_mobile_number', 'custom_alteranate_mobile_number',
      'custom_first_name', 'custom_last_name'
    ];
    field_value_from_member.forEach((field_value, index) => {
      frappe.db.get_value('Member Registration', frm.doc.custom_member, field_value)
        .then(r => {
          if (r.message) {
            let result_object = r.message;
            let first_key = Object.keys(result_object)[0];
            let first_value = result_object[first_key];
            frm.set_value(lead_field_name[index], first_value);
          }
        });
    });
  }
}

function service_button(frm) {
  if (frm.doc.custom_lead_type === 'Service') {
    setTimeout(function () {
      frm.add_custom_button('Create Service', function () {
        // Store 'custom_member' value temporarily
        localStorage.setItem('customMemberForService', frm.doc.custom_member);
        let storedValue = localStorage.getItem('customMemberForService');
        console.log(storedValue); // This should log the value you just set        
        // Redirect to create a new Service record
        frappe.set_route('Form', 'Service', 'new-service');
      });
    }, 50)
  }
}

function set_warehouse_and_store(frm) {
  frappe.call({
    method: 'frappe.client.get_list',
    args: {
      doctype: 'Employee',
      filters: {
        'personal_email': frappe.session.user
      },
      fields: ['employee_name', 'branch', 'last_name', 'custom_store']
    },
    callback: function (r) {
      if (r.message) {
        console.log('Employees Found:', r.message);
      }
    }
  });

}


