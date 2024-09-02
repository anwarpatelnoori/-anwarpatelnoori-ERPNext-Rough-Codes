frappe.ui.form.on('Room Cleaning Entry', {
    before_submit: async function(frm) {
        let insufficient_stock = false;

        // Iterate over each cleaning item to check stock balance
        for (let item of frm.doc.cleaning_item_used) {
            // Asynchronous call to check stock balance
            await frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    doctype: 'Bin',
                    filters: {'item_code': item.item, 'warehouse': 'HouseKeeping - SR'},
                    fieldname: 'actual_qty'
                },
                callback: function(r) {
                    if (r.message && r.message.actual_qty < item.quantity) {
                        frappe.msgprint(`Insufficient stock for item: ${item.item}`);
                        insufficient_stock = true;
                    }
                }
            });

            if (insufficient_stock) break;
        }

        if (insufficient_stock) {
            frappe.validated = false;
            return;
        }

        // If sufficient stock, proceed to create and submit Stock Entry
   await frappe.call({
        method: 'frappe.client.insert',
        args: {
            doc: {
                doctype: 'Stock Entry',
                stock_entry_type: 'Material Consumption for Manufacture',
                from_warehouse: 'HouseKeeping - SR',
                items: frm.doc.cleaning_item_used.map(item => ({
                    item_code: item.item,
                    qty: item.quantity,
                    s_warehouse: item.s_warehouse
                })),
                docstatus: 1
            }
        },
        callback: function(r) {
            if (r.message) {
                frappe.msgprint(__('Stock entry created'));
            }
        },
        error: function(err) {
            frappe.msgprint(__('There was an error creating the stock entry.'));
        }
    });
}
});




