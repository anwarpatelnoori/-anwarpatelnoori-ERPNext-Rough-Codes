frappe.ui.form.on('Contract Letter', {
    before_save: function (frm) {
        sign_by_applicant(frm)
        sign_by_hr(frm);
    },
    refresh: function (frm) {
        view_contract_buttom(frm)
    },
    custom_signed_by_hr: function (frm) {
    },
    custom_candidate_signature: function (frm) {
    },
    custom_candidate_signature_image: function (frm) {
        // sign_by_applicant(frm)
    },
});

function view_contract_buttom(frm) {
    if (frm.doc.custom_candidate_signature_image) {
        let url = `http://127.0.0.1:8003/api/method/frappe.utils.print_format.download_pdf?doctype=Contract%20Letter&name=CNT-08-24-001&format=st2&no_letterhead=1&letterhead=No%20Letterhead&settings=%7B%7D&_lang=en`;
        let contract_name = frm.doc.name
        view_contract__url = url.replace('CNT-08-24-001', contract_name);
        frm.add_custom_button(('View Contract'), function () {
            window.open(view_contract__url);
        });
    }
}
function sign_by_hr(frm) {
    if (frm.doc.custom_candidate_signature_image && frm.doc.custom_signed_by_hr == 1) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        let letter_with_applicant_sign = frm.doc.custom_letter
        let letter_with_hr_sign = letter_with_applicant_sign.replace('/private/files/SbwQfGl.png?fid=9bae3d129b', '/files/Bayan HR Signature.png').replace('Date of Signature of HR', `${formattedDate}`);
        frm.set_value('custom_letter', letter_with_hr_sign);
    }
}
function sign_by_applicant(frm) {
    create_img_of_sign(frm)
    if (frm.doc.custom_candidate_signature_image) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const letter = frm.doc.custom_letter;
        const applicant_sign = frm.doc.custom_candidate_signature_image;
        console.log(`Applicant SIgn Before If block${applicant_sign}`);
        

        if (letter.includes('"/private/files/PeDPjrr.png?fid=1f9e65a4f9"')) {
            console.log('found under if');

            let letter_with_applicant_sign = letter.replace('"/private/files/PeDPjrr.png?fid=1f9e65a4f9"', frm.doc.custom_candidate_signature_image).replace('Date of Signature of Applicant', `${formattedDate}`);
            console.log(`BeofreeeeeeLetter with applicant sign ${letter_with_applicant_sign}`);
            frm.set_value('custom_letter', letter_with_applicant_sign);
            frm.set_value('custom_tem_url', frm.doc.custom_candidate_signature_image);
            frm.set_value('custom_tem_url_copy', frm.doc.custom_candidate_signature_image);
        }
        else{
            console.log('Under Else If ');
            console.log(`Applicant SIgn in else if block ${applicant_sign}`)
            console.log(`Before replacinggggggggggg ${letter}`);
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    doctype: 'Contract Letter',
                    filters: { name: frm.doc.name },
                    fieldname: 'custom_letter'
                },
                callback: function(r) {
                    if (r.message) {
                        console.log('Custom Letter from data base value', r.message.custom_letter);
                        let letter_with_applicant_sign = r.message.custom_letter.replace(frm.doc.custom_tem_url, applicant_sign).replace('Date of Signature of Applicant', `${formattedDate}`);
                        console.log(`Letter with applicant sign ${letter_with_applicant_sign}`);
                        
                        frm.set_value('custom_letter', letter_with_applicant_sign);
                    }
                }
            });
        }

    }
    else {
        console.log('No signature');

    }
}

function create_img_of_sign(frm) {
    if (frm.doc.custom_candidate_signature) {
        let base64Image = frm.doc.custom_candidate_signature;
        let fileDoc = {
            'doctype': 'File',
            'file_name': 'signature.png',
            'is_private': 0,
            'content': base64Image.split(',')[1],  // Remove the data:image/png;base64, part
            'decode': true
        };
        // inset this filedoc into File doctype
        frappe.call({
            method: 'frappe.client.insert',
            args: {
                doc: fileDoc
            },
            callback: function (r) {
                if (r.message) {
                    let file_url = r.message.file_url
                    frm.set_value('custom_candidate_signature_image', file_url);
                }
            }
        });
    }
}