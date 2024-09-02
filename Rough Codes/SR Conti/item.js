frappe.ui.form.on('Item', {
    before_load: function (frm) {
        field_section_hide(frm)
        tab_break_hide(frm)
        
    },
    onload: function (frm) {
        
    },
    refresh: function (frm) {
        field_section_hide(frm)
        tab_break_hide(frm)
    },
});

function field_section_hide(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        const fieldsToHide = [
            'has_variants','allow_alternative_item','include_item_in_manufacturing','is_fixed_asset','section_break_11'
        ];
        fieldsToHide.forEach(fieldname => {
            frm.set_df_property(fieldname, 'hidden', 1);
        });
    }
}
function tab_break_hide(frm) {
    let user = frappe.user.name;
    if (user != 'anwar@standardtouch.com' && user != 'nasir@standardtouch.com' && user != 'zaid@standardtouch.com') {
        const tab_break_to_hide = ['Inventory','Accounting','Purchasing','Sales','Tax','Quality','Manufacturing']
        tab_break_to_hide.forEach(tab_name => {
            $(`a[aria-controls="${tab_name}"]`).hide()
        });
    }
}