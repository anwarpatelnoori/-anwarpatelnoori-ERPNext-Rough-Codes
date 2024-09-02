frappe.ui.form.AssignTo = class AssignTo {
	constructor(opts) {
		$.extend(this, opts);
		this.btn = this.parent.find(".add-assignment-btn").on("click", () => this.add());
		this.btn_wrapper = this.btn.parent();

		this.refresh();
	}
	refresh() {
		if (this.frm.doc.__islocal) {
			this.parent.toggle(false);
			return;
		}
		this.parent.toggle(true);
		this.render(this.frm.get_docinfo().assignments);
	}
	render(assignments) {
		this.frm.get_docinfo().assignments = assignments;

		let assignments_wrapper = this.parent.find(".assignments");

		assignments_wrapper.empty();
		let assigned_users = assignments.map((d) => d.owner);

		if (!assigned_users.length) {
			assignments_wrapper.hide();
			return;
		}

		let avatar_group = frappe.avatar_group(assigned_users, 5, {
			align: "left",
			overlap: true,
		});

		assignments_wrapper.show();
		assignments_wrapper.append(avatar_group);
		avatar_group.click(() => {
			new frappe.ui.form.AssignmentDialog({
				assignments: assigned_users,
				frm: this.frm,
			});
		});
	}
	add() {
		var me = this;

		if (this.frm.is_new()) {
			frappe.throw(__("Please save the document before assignment"));
			return;
		}

		if (!me.assign_to) {
			me.assign_to = new frappe.ui.form.AssignToDialog({
				method: "frappe.desk.form.assign_to.add",
				doctype: me.frm.doctype,
				docname: me.frm.docname,
				frm: me.frm,
				callback: function (r) {
					me.render(r.message);
				},
			});
		}
		me.assign_to.dialog.clear();
		me.assign_to.dialog.show();
	}
	remove(owner) {
		if (this.frm.is_new()) {
			frappe.throw(__("Please save the document before removing assignment"));
			return;
		}

		return frappe
			.xcall("frappe.desk.form.assign_to.remove", {
				doctype: this.frm.doctype,
				name: this.frm.docname,
				assign_to: owner,
			})
			.then((assignments) => {
				this.render(assignments);
			});
	}
};
