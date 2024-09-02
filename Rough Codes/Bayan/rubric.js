frappe.ui.form.on('Job Applicant', {
    before_load: function (frm) {
        if (frm.doc.workflow_state === 'Sent Demo Request') {
            set_demo_rubric(frm);
        }
    }
});

function set_demo_rubric(frm) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Skill',
            filters: [['custom_interview_round', '=', 'Demo Request']],
            fields: ['description', 'skill_name']
        },
        callback: function(r) {
            if (r.message) {
                // Clear existing rows in all tables
                frm.clear_table('custom_demo_rubric');
                frm.clear_table('custom_demo_rubric_2');
                frm.clear_table('custom_demo_rubric_3');

                // Add new rows with skill names to all tables
                r.message.forEach(function(row) {
                    var child1 = frm.add_child('custom_demo_rubric');
                    var child2 = frm.add_child('custom_demo_rubric_2');
                    var child3 = frm.add_child('custom_demo_rubric_3');
                    [child1, child2, child3].forEach(function(child) {
                        child.skill = row.skill_name; // assuming 'skill_name' is the field name in child tables
                        child.description = row.description; // assuming 'description' is also a field in the child tables
                    });
                });

                // Refresh fields to show updated data
                frm.refresh_field('custom_demo_rubric');
                frm.refresh_field('custom_demo_rubric_2');
                frm.refresh_field('custom_demo_rubric_3');
            }
        }
    });
}
