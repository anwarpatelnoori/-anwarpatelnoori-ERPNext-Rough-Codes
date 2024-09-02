# custom_app/custom_app/doctype/job_applicant/job_applicant.py

import frappe
from frappe.utils import get_url, get_formatted_email, get_url_to_form
from frappe.utils.user import get_user_fullname

STANDARD_USERS = ["Administrator", "Guest"]

def create_user_and_send_email(doc, method):
    if not frappe.db.exists("User", doc.email_id):
        user = frappe.get_doc({
            "doctype": "User",
            "email": doc.email_id,
            "first_name": doc.custom_first_name,
            "last_name": doc.custom_last_name,
            "send_welcome_email": 0,
            'module_profile': 'Applicant',
            "roles": [{"doctype": "Has Role", "role": "Applicant Stage 1"}]
        })
        user.insert(ignore_permissions=True)
        user.module_profile = "Applicant"

        # Set user password and get the reset password link
        link = user.reset_password()
      
        set_user_permissions(user, doc)

        # Send custom welcome email
        send_custom_welcome_email(user, link, doc)
    else:
        permission = frappe.get_doc({
            "doctype": "User Permission",
            "user": doc.email_id,
            "allow": "Job Applicant",
            "for_value": doc.name
        })
        permission.insert(ignore_permissions=True)
        send_application_email(doc)
        frappe.msgprint(
            msg='Please wait, your application is submitting.',
            title='Submitting',
            indicator='green'
        )

def set_user_permissions(user, job_applicant):
    permission = frappe.get_doc({
        "doctype": "User Permission",
        "user": user.name,
        "allow": "Job Applicant",
        "for_value": job_applicant.name
    })
    permission.insert(ignore_permissions=True)

def send_application_email(doc):
    subject = "Welcome to Bayan - Job Application Confirmation" 
    created_by = get_user_fullname(frappe.session["user"])
    if created_by == "Guest":
        created_by = "Administrator"

    sender = (
        frappe.session.user not in STANDARD_USERS and get_formatted_email(frappe.session.user) or None
    )

    email_content = f"""
    <p>Dear {doc.applicant_name},</p>

    <p>Thank you for applying for the position of {doc.job_title}. We have received your application and will review it shortly.</p>

    <p>Best regards,<br>
    Principle</p>

    <p>You can log in and view your application details <a href="https://bayaanerp.standardtouch.com/app/job-applicant/{doc.name}">Click here</a>.</p>
"""

    frappe.sendmail(
        recipients=doc.email_id,
        sender=sender,
        subject=subject,
        content=email_content,
        header=[subject, "green"],
        delayed=False,
        retry=3,  
    )

def send_custom_welcome_email(user, link, job_applicant):
    subject = "Welcome to Bayan - Job Application Confirmation" 
    welcome_email_template = frappe.db.get_system_setting("welcome_email_template")

    email_content = f"""
    Dear {job_applicant.applicant_name},

    Thank you for applying for the position of {job_applicant.job_title}. We have received your application and will review it shortly.

    Best regards,
    [Your Company Name]

    You can view your application details here: {get_url_to_form('Job Applicant', job_applicant.name)}
    """
    print('-------------------------------------linkkkkkkk-----------------------------------',link)
    user.send_login_mail(
        subject,
        "new_user",
        dict(
            link=link,
            site_url='https://bayaanerp.standardtouch.com',
            job_title=job_applicant.job_title,
            applicant_name=job_applicant.applicant_name,
            email_content=email_content
        ),
        custom_template=welcome_email_template,
    )

def send_login_mail(self, subject, template, add_args, now=None, custom_template=None):
    created_by = get_user_fullname(frappe.session["user"])
    if created_by == "Guest":
        created_by = "Administrator"

    args = {
        "first_name": self.first_name or self.last_name or "user",
        "user": self.name,
        "title": subject,
        "login_url": get_url(),
        "created_by": created_by,
    }

    args.update(add_args)

    sender = (
        frappe.session.user not in STANDARD_USERS and get_formatted_email(frappe.session.user) or None
    )

    if custom_template:
        from frappe.email.doctype.email_template.email_template import get_email_template

        email_template = get_email_template(custom_template, args)
        subject = email_template.get("subject")
        content = email_template.get("message")
    else:
        content = args.get("email_content")

    frappe.sendmail(
        recipients=self.email,
        sender=sender,
        subject=subject,
        template=template if not custom_template else None,
        content=content if custom_template else None,
        args=args,
        header=[subject, "green"],
        delayed=(not now) if now is not None else self.flags.delay_emails,
        retry=3,  
    )


# Assigning the new send_login_mail method to User class
from frappe.core.doctype.user.user import User
User.send_login_mail = send_login_mail


def assign_stage_2_role(doc, method):
    if doc.workflow_state == "Sent Demo Request":
        user = frappe.get_doc("User", doc.email_id)
   
        if "Applicant Stage 2" not in [d.role for d in user.roles]:
            user.add_roles("Applicant Stage 2")
           

    if doc.workflow_state == 'Job Offer Sent':
        user = frappe.get_doc("User", doc.email_id)
   
        if "Accept Job Offer" not in [d.role for d in user.roles]:
            user.add_roles("Accept Job Offer")
            

    if doc.workflow_state == 'Contract Sent':
        user = frappe.get_doc("User", doc.email_id)
   
        if "Contract Signing" not in [d.role for d in user.roles]:
            user.add_roles("Contract Signing")
          
    