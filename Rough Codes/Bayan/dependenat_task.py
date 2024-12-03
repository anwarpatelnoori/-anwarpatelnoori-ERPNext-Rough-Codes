current_end_date = doc.exp_end_date

current_date = frappe.utils.get_datetime(current_end_date).date()


# Fetch all dependent tasks
dependent_tasks = frappe.db.get_list('Task',
    filters={'depends_on_tasks': ['like', f'%{doc.name}%']},
    # filters={'depends_on_tasks': ['like', '%%']},
    fields=['exp_start_date', 'exp_end_date', 'name'])

# Iterate through dependent tasks and adjust start dates
for task in dependent_tasks:
    dependant_start_date = frappe.utils.get_datetime(task.exp_start_date).date()    
    dependant_end_date = frappe.utils.get_datetime(task.exp_end_date).date()
    
    dependant_date_difference = (dependant_end_date - dependant_start_date).days
    # frappe.errprint(dependant_date_difference)
        
    
    # adjusted_start_date = frappe.utils.add_days(dependant_start_date, date_difference)
    adjusted_end_date = frappe.utils.add_days(current_date, dependant_date_difference)
    # frappe.errprint(adjusted_end_date)
    
    frappe.db.set_value('Task', task.name, 'exp_start_date', current_date)
    frappe.db.set_value('Task', task.name, 'exp_end_date', adjusted_end_date)
    # break
    