frappe.ui.form.on('Contract Letter', {
    refresh: function (frm) {
        view_contract_button(frm);
    },
    custom__signed_by_hr: function (frm) {
        frappe.msgprint('Please wait for a moment, we are signing the document by HR');
        setTimeout(function () {
            sign_by_hr(frm);
        }, 1000);
    },
    custom_confirm_your_signature: function (frm) {
        if (frm.doc.custom_confirm_your_signature == 1) {
            create_img_of_sign(frm);
            frappe.msgprint('Please wait for a moment, we are saving your signature');
            setTimeout(function () {
                sign_by_applicant(frm);
            }, 1000);
        }
    },
    before_save: function (frm) {
        let user = frappe.user_roles.includes('Contract Signing')
        if (frm.doc.custom_confirm_your_signature != 1 && frm.doc.workflow_state === 'Pending Applicant Sign' && user) {
            frappe.throw(`Please confirm your signature by checking the checkbox "Confirm Your Signature"`);
        }
    },
    custom_candidate_signature: function (frm) {
        frm.set_value('custom_confirm_your_signature', 0);
    }
});

function view_contract_button(frm) {
    if (frm.doc.custom_candidate_signature_image) {
        let url = `https://erp.bayaanacademy.com/api/method/frappe.utils.print_format.download_pdf?doctype=Contract%20Letter&name=CNT-08-24-289&format=st2&no_letterhead=0&letterhead=Bayan%20Letter%20Head&settings=%7B%7D&_lang=en-US`;
        let contract_name = frm.doc.name;
        let view_contract_url = url.replace('CNT-08-24-289', contract_name);
        frm.add_custom_button('View Contract', function () {
            window.open(view_contract_url);
        });
    }
    else {
        let url = `https://erp.bayaanacademy.com/api/method/frappe.utils.print_format.download_pdf?doctype=Contract%20Letter&name=CNT-08-24-289&format=st2&no_letterhead=0&letterhead=Bayan%20Letter%20Head&settings=%7B%7D&_lang=en-US`;
        let contract_name = frm.doc.name;
        let view_contract_url = url.replace('CNT-08-24-289', contract_name);
        frm.add_custom_button('View Contract', function () {
            window.open(view_contract_url);
        });
    }
}

function sign_by_hr(frm) {
    if (frm.doc.custom__signed_by_hr == 1 && frm.doc.custom_candidate_signature_image) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        let letter_with_applicant_sign = frm.doc.custom_letter;
        frappe.call({
            method: 'frappe.client.get_single_value',
            args: {
                doctype: 'HR Signature',
                field: 'attach_hr_signature'
            },
            callback: function (response) {
                if (response && response.message) {
                    console.log('HR Signature:', response.message);
                    let hr_signature = response.message;
                    let letter_with_hr_sign = letter_with_applicant_sign
                        .replace('/private/files/QBBFyrc.png?fid=2c6186b2dd', hr_signature)
                        .replace('Date of Signature of HR', formattedDate);
                    frm.set_value('custom_letter', letter_with_hr_sign);
                    frm.save()
                }
                else {
                    console.log('No value found for attach_hr_signature');
                }
            }
        });
    }
}

function sign_by_applicant(frm) {
    console.log('Time Out Funtion');
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    let letter = frm.doc.custom_letter;
    let applicant_sign = `"${frm.doc.custom_candidate_signature_image}" width='200px' height='100px'`;
    let re_sign = frm.doc.custom_candidate_signature_image
    let re_sign_path = re_sign.replace('/files/', '')
    console.log('Re Sign Path is', re_sign_path)
    console.log('Applicant Sign Path is ')
    console.log(applicant_sign)

    if (letter.includes('"/private/files/Applicant Signature.png?fid=05451d96c0"')) {
        console.log('Applicant Sign Exists');
        let letter_with_applicant_sign = letter
            .replace('"/private/files/Applicant Signature.png?fid=05451d96c0"', applicant_sign)
            .replace('Date of Signature of Applicant', formattedDate);
        frm.set_value('custom_letter', letter_with_applicant_sign);
        frm.save()
    }
    else {
        let pattern = /digital_signature[a-zA-Z0-9]+\.png/g;
        if (pattern.test(letter)) {
            console.log('exists');
        }
        else {
            console.log('not found');
        }

        let new_letter = letter.replace(pattern, re_sign_path);
        console.log(new_letter)
        frm.set_value('custom_letter', new_letter);
        frm.save()
    }
}
function create_img_of_sign(frm) {
    if (frm.doc.custom_candidate_signature) {
        let base64Image = frm.doc.custom_candidate_signature;
        let fileDoc = {
            'doctype': 'File',
            'file_name': 'digital_signature.png',
            'is_private': 0,
            'content': base64Image.split(',')[1],  // Remove the data:image/png;base64, part
            'decode': true
        };

        // Insert this fileDoc into File doctype
        frappe.call({
            method: 'frappe.client.insert',
            args: {
                doc: fileDoc
            },
            callback: function (r) {
                if (r.message) {
                    let file_url = r.message.file_url;
                    frm.set_value('custom_candidate_signature_image', file_url);
                }
            }
        });
    }
}
