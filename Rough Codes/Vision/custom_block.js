let nameElement = root_element.querySelector('#name');
let emailElement = root_element.querySelector('#email');
let branchElement = root_element.querySelector('#branch');
let phoneElement = root_element.querySelector('#phone')
let photoElement = root_element.querySelector('#photo');
let email=frappe.session.user
frappe.db.get_doc('User', email).then(doc => {
    console.log(doc);
    // Set the user data
    photoElement.src = doc.user_image;
    nameElement.textContent = "Name: " +doc.last_name
    emailElement.textContent = "Email ID: " +doc.name
    branchElement.textContent = "Branch: " +doc.first_name;
    phoneElement.textContent = "Mobile Number: " +doc.mobile_no

}).catch(err => {
            console.error(err);
        });
