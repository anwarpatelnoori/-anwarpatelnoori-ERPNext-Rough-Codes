frappe.ui.form.on('Timesheet', {
    employee: function (frm) {
        // frappe.msgprint(frm.doc.employee)
        get_schedule_old_chatgp(frm)
    },
    date: function (frm) {
        get_schedule_old_chatgp(frm)
    }
})

function get_schedule(frm) {
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Teacher Schedule',
            name: 'anwar patel - 001',
            fields: 'weekly_time_table'
        },
        callback: function (r) {
            if (r.message) {
                console.log(r.message);
                frm.clear_table('time_logs');
                let time_table = r.message.weekly_time_table;
                let date = new Date(frm.doc.date); // Assuming frm.doc.date is in YYYY-MM-DD format

                time_table.forEach(element => {
                    const child = frm.add_child('time_logs');
                    let toDateTime = new Date(date.getTime());
                    let fromDateTime = new Date(date.getTime());

                    // Set hours, minutes, and seconds based on the element's time values
                    let [toHours, toMinutes, toSeconds] = element.to_time.split(':');
                    let [fromHours, fromMinutes, fromSeconds] = element.from_time.split(':');
                    toDateTime.setHours(toHours, toMinutes, toSeconds);
                    fromDateTime.setHours(fromHours, fromMinutes, fromSeconds);

                    // Setting the value in child
                    frappe.model.set_value(child.doctype, child.name, 'to_time', toDateTime.toTimeString().substr(0, 8));
                    frappe.model.set_value(child.doctype, child.name, 'from_time', fromDateTime.toTimeString().substr(0, 8));
                });
                frm.refresh_field('time_logs');
            }
        }
    });
}
function get_schedule_old(frm) {
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Teacher Schedule',
            name: 'anwar patel - 001',
            fields: 'weekly_time_table'
        },
        callback: function (r) {
            if (r.message) {
                console.log(r.message);
                frm.clear_table('time_logs')
                let time_table = r.message.weekly_time_table
                console.log(`Time Table is ${time_table}`);
                let date = frm.doc.date
                time_table.forEach((element, index) => {
                    const child = frm.add_child('time_logs')
                    let new_to_time = date + " " + element.to_time
                    let new_from_time = date + " " + element.from_time

                    console.log(`New Tooo time ${new_to_time.length}`);
                    console.log(`New Tooo time ${new_to_time}`);
                    console.log(`New frommmm time${new_from_time.length}`);
                    console.log(`Element Is ${index}`);
u
                    frappe.model.set_value(child.doctype, child.name, 'to_time', new_to_time)
                    frappe.model.set_value(child.doctype, child.name, 'from_time', new_from_time)
                    frm.refresh_field('time_logs')
                    
                    
                });
                // frm.refresh_field('time_logs')

            }
        }
    })
}

function get_date(frm) {
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Teacher Schedule',
            name: 'anwar patel - 001',
            fields: 'weekly_time_table'
        },
        callback: function (r) {
            if (r.message) {
                console.log(r.message);
                frm.clear_table('time_logs')
                let time_table = r.message.weekly_time_table
                date = frm.doc.date
                time_table.forEach(element => {
                    const child = frm.add_child('time_logs')
                    let new_to_time = frm.doc.date + " " + element.to_time
                    let new_from_time = frm.doc.date + " " + element.from_time
                    console.log(`New Tooo time dateeeeeeee${new_to_time.length}`);
                    console.log(`New frommmm time in dateeeeeeee${new_from_time.length}`);
                    frappe.model.set_value(child.doctype, child.name, 'to_time', new_to_time)
                    frappe.model.set_value(child.doctype, child.name, 'from_time', new_from_time)
                    frappe.mode.set_value(child.doctype, child.name, 'activity_type',element.day)
                });
                frm.refresh_field('time_logs')

            }
        }
    })
}

function get_schedule_old_chatgp(frm) {
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Teacher Schedule',
            name: 'anwar patel - 001',
            fields: 'weekly_time_table'
        },
        callback: function (r) {
            if (r.message) {
                console.log(r.message);
                frm.clear_table('time_logs')
                let time_table = r.message.weekly_time_table
                let date = frm.doc.date

                time_table.forEach((element) => {
                    const child = frm.add_child('time_logs')

                    let from_time = moment(date + " " + element.from_time).format("YYYY-MM-DD HH:mm:ss");
                    let to_time = moment(date + " " + element.to_time).format("YYYY-MM-DD HH:mm:ss");


                    // console.log(`Element from time is ${element.from_time}`);
                    // console.log(`Element  to is ${element.to_time}`);
                    // console.log(`New from time is ${from_time}`);
                    // console.log(`New to is ${to_time}`);




                    frappe.model.set_value(child.doctype, child.name, 'from_time', from_time);
                    frappe.model.set_value(child.doctype, child.name, 'to_time', to_time);
                    frappe.model.set_value(child.doctype, child.name, 'activity_type', element.day);


                    frm.refresh_field('time_logs');
                });
            }
        }
    });
}

