frappe.query_reports["My ToDos"] = {
    filters: [],
    onload(report) {
      // add an action button to visit ToDo List View
      report.page.add_inner_button("Go to ToDo List", () => {
        frappe.set_route("List", "ToDo");
      });
    },
    formatter(value, row, column, data, default_formatter) {
      // Show a button instead of the "name"
      if (column.fieldname == "name") {
          const button_html = `<button class="btn btn-default btn-xs" onclick="frappe.query_reports['My ToDos'].close_todo('${value}')">Close</button>`;
          value = button_html;
      }
      return default_formatter(value, row, column, data);
    },
    close_todo(name) {
      frappe.db.set_value("ToDo", name, "status", "Closed").then(() => {
        // refresh this report and show alert
        frappe.query_report.refresh();
        frappe.show_alert("ToDo Closed Successfully!");
      });
    },
  };