
# SQL query to fetch data
data = frappe.db.sql("""
    SELECT 
        t1.custom_staff_schedule_hour_,  
        t1.employee_name, 
        t1.custom_weekly_scheduled_hour, 
        t1.custom_total_worked_hours_weekly, 
        t1.custom_hours_difference,
        t1.department,
        t1.custom_designation
    FROM 
        tabTimesheet t1
    JOIN (
        SELECT 
            custom_staff_schedule_hour_, 
            MAX(custom_total_worked_hours_weekly) AS max_hours
        FROM 
            tabTimesheet
        WHERE 
            workflow_state IN ('Lead Verification Pending', 'HR Verification Pending', 'HR Verified')
        GROUP BY 
                custom_staff_schedule_hour_
        ) t2 
        ON 
            t1.custom_staff_schedule_hour_ = t2.custom_staff_schedule_hour_
            AND t1.custom_total_worked_hours_weekly = t2.max_hours
        WHERE 
            t1.workflow_state IN ('Lead Verification Pending', 'HR Verification Pending', 'HR Verified')
    """, as_dict=1)

    # Group data by employee
employee_weeks = {}
for entry in data:
    employee_name = entry['employee_name']
    if employee_name not in employee_weeks:
        employee_weeks[employee_name] = []
    employee_weeks[employee_name].append(entry)
print(employee_weeks)
print(len(employee_weeks))
# Display data for each employee
for employee, weeks in employee_weeks.items():
    print('+++++++++++++++++++++++++++')
    print(f"\n{employee}:")
    print('+++++++++++++++++++++++++++')
    for week in weeks:
        week_range = week['custom_staff_schedule_hour_'].split(' ')[-3:]
        print("--------------------------------------------------")
        print(f"  Week: {' '.join(week_range)}")
        print(f"    Scheduled Hours: {week['custom_weekly_scheduled_hour']}")
        print(f"    Total Worked Hours: {week['custom_total_worked_hours_weekly']}")
        print(f"    Hours Difference: {week['custom_hours_difference']}")
        print(f"    Department: {week['department']}")
        print(f"    Designation: {week['custom_designation']}")