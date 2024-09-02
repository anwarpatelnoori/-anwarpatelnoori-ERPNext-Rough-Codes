let nameElement = root_element.querySelector('#name');
let emailElement = root_element.querySelector('#email');
let branchElement = root_element.querySelector('#branch');
let phoneElement = root_element.querySelector('#phone')
let photoElement = root_element.querySelector('#photo');
let email = frappe.session.user
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Employee',
        filters: [
            ['personal_email', '=', email]
        ],
        fields: ['employee_name', 'cell_number', 'personal_email', 'branch'] // Add fields you need to retrieve
    },
    callback: function (r) {
        if (r.message && r.message>0) {
            let employee = r.message[0]
            console.log(employee);
            photoElement.src = employee.user_image; 
            nameElement.textContent = "Name: " + employee.employee_name; 
            emailElement.textContent = "Email ID: " + employee.personal_email;
            branchElement.textContent = "Branch: " + employee.branch; 
            phoneElement.textContent = "Mobile Number: " + employee.cell_number;    
        }
    }
});


