function Dollar(amount) {
    var words = new Array();
    words[0] = 'zero';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    words[100] = 'One Hundred';
    words[200] = 'Two Hundred';
    words[300] = 'Three Hundred';
    words[400] = 'Four Hundred';
    words[500] = 'Five Hundred';
    words[600] = 'Six Hundred';
    words[700] = 'Seven Hundred';
    words[800] = 'Eight Hundred';
    words[900] = 'Nine Hundred';
    var op;
    amount = amount.toString();
    var atemp = amount.split('.');
    var number = atemp[0].split(',').join('');
    var n_length = number.length;
    var words_string = '';
    if (n_length <= 11) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 11 - n_length, j = 0; i < 11; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 11; i++, j++) {
            if (i == 0 || i == 3 || i == 6 || i == 9) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        var value = '';
        for (var i = 0; i < 11; i++) {
            if (i == 0 || i == 3 || i == 6 || i == 9) {
                value = n_array[i] * 10;
            } else if (i == 2 || i == 5 || i == 8) {
                value = n_array[i] * 100;
            } else {
                value = n_array[i];
            }

            if (value != 0) {
                words_string += words[value] + ' ';
            }
            if ((i == 1 && value != 0) && (n_array[i - 1] > 0)) {
                words_string += 'Billion ';
            } else if ((i == 1) && value != 0) {
                words_string += 'Biillion ';
            }
            if ((i == 4) && value == 0 && (n_array[i - 1] > 0 || n_array[i - 2] > 0)) {
                words_string += 'Million ';
            } else if ((i == 4) && value != 0) {
                words_string += 'Million ';
            }
            if ((i == 7) && value == 0 && (n_array[i - 1] > 0 || n_array[i - 2] > 0)) {
                words_string += 'Thousand ';
            } else if ((i == 7) && value != 0) {
                words_string += 'Thousand ';
            }
        }
        words_string = words_string.split(' ').join(' ');
    }
    return words_string;
}

function DollarCent(n) {
    var cur = 'Dollars';
    var frac = 'Cents';
    var nums = n.toString().split('.')
    var whole = Dollar(nums[0])
    if (nums[1] == null) nums[1] = 0;
    if (nums[1].length == 1) nums[1] = nums[1] + '0';
    if (nums[1].length > 2) {
        nums[1] = nums[1].substring(2, length - 1)

    }
    if (nums.length == 2) {

        if (nums[0] <= 12) {
            nums[0] = nums[0] * 10
        } else {
            nums[0] = nums[0]
        };
        var fraction = Dollar(nums[1])
        var op = '';
        if (whole == '' && fraction == '') {
            op = 'Zero only';
        }
        if (whole == '' && fraction != '') {
            op = fraction + ' ' + frac + ' only';
        }
        if (whole != '' && fraction == '') {
            op = + whole + ' ' + cur + ' only';
        }
        if (whole != '' && fraction != '') {
            op = whole + ' ' + cur + ' ' + 'and ' + fraction + ' ' + frac + ' only';
        }
        var amt = n;
        if (amt > 99999999999.99) {
            op = 'Oops!!! The amount is too big to convert';
        }
        if (isNaN(amt) == true) {
            op = 'Error : Amount in number appears to be incorrect. Please Check.';
        }
        // document.getElementById('op').innerHTML = op;
        return op;
    }
}
/*Currency Converter Ends Here*/

function unfnum(number) {
    var num;

    num = parseFloat(number.replace(/,/g, ''));

    return num;
}
function set_value(frm) {
    var sar_to_usd_rates = document.querySelector("input[data-fieldname='sar_to_usd_rate_1']").value;
    var previous_gross_billing3 = unfnum((document.querySelector("input[data-fieldname='previous_gross_billing3']").value.toString()));
    var current_period_billing3 = unfnum((document.querySelector("input[data-fieldname='current_period_billing3']").value.toString()));
    var total_gross_amount_billed_to_date3 = previous_gross_billing3 + current_period_billing3;
    // alert(typeof(previous_gross_billing3));
    var vat_for_this_current_period_at_15_percent3 = current_period_billing3 * 0.15;
    var current_period_billing_after_vat_at_153 = current_period_billing3 + vat_for_this_current_period_at_15_percent3;
    var retention_for_this_current_period_at_103 = current_period_billing3 * 0.05;
    var net_amount_for_this_period3 = current_period_billing_after_vat_at_153 - retention_for_this_current_period_at_103;

    var net_amount_in_words = DollarCent(Math.round(net_amount_for_this_period3 * 100) / 100);
    var net_amount_in_words_after_converting_usd = DollarCent(Math.round((net_amount_for_this_period3 * sar_to_usd_rates) * 100) / 100);



    // document.querySelector("input[data-fieldname='total_gross_amount_billed_to_date3']").value = total_gross_amount_billed_to_date3
    frm.set_value("total_gross_amount_billed_to_date3", total_gross_amount_billed_to_date3);
    frm.set_value("vat_for_this_current_period_at_15_percent3", vat_for_this_current_period_at_15_percent3);
    frm.set_value("current_period_billing_after_vat_at_153", current_period_billing_after_vat_at_153);
    frm.set_value("retention_for_this_current_period_at_103", retention_for_this_current_period_at_103);
    frm.set_value("net_amount_for_this_period3", net_amount_for_this_period3);

    var str_amt = net_amount_in_words;
    var st_amt1 = net_amount_in_words_after_converting_usd;
    frm.set_value("net_amount_in_words_english", str_amt.toUpperCase());
    frm.set_value("usd_net_amount_in_words_english", st_amt1.toUpperCase());
}
function advance_invoice(frm) {
    var sar_to_usd_rates = document.querySelector("input[data-fieldname='sar_to_usd_rate_1']").value;
    console.log(sar_to_usd_rates);
    var previous_month_adjustment = frm.doc.adjustments_in_previous_month
    var current_period = unfnum((document.querySelector("input[data-fieldname='current_period']").value.toString()));
    var total_gross_amount_billed_to_date3 = previous_month_adjustment + current_period;

    // alert(typeof(previous_month_adjustment));
    var total_value = previous_month_adjustment + current_period

    var vat_for_this_current_period_at_15_percent3 = total_value * 0.15;

    var current_period_billing_after_vat_at_153 = total_value + vat_for_this_current_period_at_15_percent3;

    var retention_for_this_current_period_at_103 = total_value * 0.05;

    var net_amount_for_this_period3 = current_period_billing_after_vat_at_153 - retention_for_this_current_period_at_103;
    console.log('net_amount_for_this_period3');
    console.log(net_amount_for_this_period3);

    var net_amount_in_words = DollarCent(Math.round(net_amount_for_this_period3 * 100) / 100);

    var net_amount_in_words_after_converting_usd = DollarCent(Math.round((net_amount_for_this_period3 * sar_to_usd_rates) * 100) / 100);
    console.log('net_amount_in_words_after_converting_usd');
    console.log(net_amount_in_words_after_converting_usd);



    // document.querySelector("input[data-fieldname='total_gross_amount_billed_to_date3']").value = total_gross_amount_billed_to_date3
    frm.set_value("total_gross_amount_billed_to_date3", total_gross_amount_billed_to_date3);
    frm.set_value("vat_for_this_current_period_at_15_percent3", vat_for_this_current_period_at_15_percent3);
    frm.set_value("current_period_billing_after_vat_at_153", current_period_billing_after_vat_at_153);
    frm.set_value("retention_for_this_current_period_at_103", retention_for_this_current_period_at_103);
    frm.set_value("net_amount_for_this_period3", net_amount_for_this_period3);
    frm.set_value('total_value', total_value)

    var str_amt = net_amount_in_words;
    var st_amt1 = net_amount_in_words_after_converting_usd;
    frm.set_value("net_amount_in_words_english", str_amt.toUpperCase());
    frm.set_value("usd_net_amount_in_words_english", st_amt1.toUpperCase());
}



frappe.ui.form.on('Sales Invoice', {
    previous_gross_billing3(frm) {
        set_value(frm)
    },
    current_period_billing3(frm) {
        set_value(frm)
    },
    adjustments_in_previous_month(frm) {
        advance_invoice(frm)
    },
    current_period(frm) {
        advance_invoice(frm)
    },
    is_advance_invoice(frm) {
        if (frm.doc.is_advance_invoice) {
            frm.set_df_property('current_period_billing3', 'hidden', 1);
            frm.set_df_property('previous_gross_billing3', 'hidden', 1);
            frm.set_df_property('total_gross_amount_billed_to_date3', 'hidden', 1);
        }
        else {
            frm.set_df_property('current_period_billing3', 'hidden', 0);
            frm.set_df_property('previous_gross_billing3', 'hidden', 0);
            frm.set_df_property('total_gross_amount_billed_to_date3', 'hidden', 0);

        }
    }
});

