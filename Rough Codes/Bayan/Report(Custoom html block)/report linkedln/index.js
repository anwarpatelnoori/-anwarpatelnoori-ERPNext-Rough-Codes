const getCurrentYear = () => {
    return new Date().getFullYear();
};

// Function to format numbers with commas and two decimal places
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

// Function to get the start and end date for each quarter of the current year
const getQuarterDateRange = (quarter, year) => {
    let startDate, endDate;
    switch (quarter) {
        case "Q1":
            startDate = `${year}-01-01`;
            endDate = `${year}-03-31`;
            break;
        case "Q2":
            startDate = `${year}-04-01`;
            endDate = `${year}-06-30`;
            break;
        case "Q3":
            startDate = `${year}-07-01`;
            endDate = `${year}-09-30`;
            break;
        case "Q4":
            startDate = `${year}-10-01`;
            endDate = `${year}-12-31`;
            break;
        default:
            startDate = "";
            endDate = "";
    }
    return { startDate, endDate };
};

// Function to update the year filter dynamically
const updateYearFilter = () => {
    const yearFilter = root_element.getElementById('yearFilter');
    const currentYear = getCurrentYear();
    yearFilter.innerHTML = `
        <option value="">--Select Year--</option>
        <option value="${currentYear}">${currentYear}</option>
        <option value="${currentYear - 1}">${currentYear - 1}</option>
        <option value="${currentYear - 2}">${currentYear - 2}</option>
    `;
};

// Function to update the quarter filter dynamically
const updateQuarterFilter = () => {
    const quarterFilter = root_element.getElementById('quarterFilter');
    const currentYear = getCurrentYear();
    quarterFilter.innerHTML = `
        <option value="">--Select Quarter--</option>
        <option value="Q1">Q1 (Jan-Mar ${currentYear})</option>
        <option value="Q2">Q2 (Apr-Jun ${currentYear})</option>
        <option value="Q3">Q3 (Jul-Sep ${currentYear})</option>
        <option value="Q4">Q4 (Oct-Dec ${currentYear})</option>
        <option value="custom">Custom Date Range</option>
    `;
};

// Function to fetch and populate the user filter with the first 10 users
const populateUserFilter = () => {
    const userFilter = root_element.getElementById('userFilter');
    userFilter.innerHTML = "<option value=''>--Select User--</option>"; // Clear existing options

frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "User",
            fields: ["full_name", "email"],
            limit_page_length: 10000
        },
        
        callback: function(response) {
            if (response.message) {
                response.message.forEach(user => {
                    const option = document.createElement("option");
                    option.value = user.email;
                    option.textContent = user.full_name;
                    userFilter.appendChild(option);
                });
            }
        },
        error: function(err) {
            console.error("Error fetching users:", err);
        }
    });
};


// Function to fetch sales order data based on selected year and user
const fetchSalesOrderData = (year, user, callback) => {
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Sales Order",
            fields: ["base_net_total", "transaction_date", "custom_created_by","per_billed","custom_total_gp_amount"],
            filters: {
                transaction_date: ["between", [`${year}-01-01`, `${year}-12-31`]],
                custom_created_by: user,
                docstatus:1
            },
            limit_page_length: 100000
        },
        callback: callback,
        error: function(err) {
            console.error("Error fetching sales orders:", err);
        }
    });
};

// Function to sum the sales order amounts for each quarter
const sumSalesOrderAmountsForQuarter = (salesOrders, quarter, year) => {
    let sum = 0;
    const { startDate, endDate } = getQuarterDateRange(quarter, year);
    salesOrders.forEach(order => {
        const orderDate = order.transaction_date;
        if (orderDate >= startDate && orderDate <= endDate) {
            sum += parseFloat(order.base_net_total || 0);
        }
    });
    return sum;
};
const sumAchievedInvoiceForQuarter = (salesOrders, quarter, year) => {
    let sum = 0;
    const { startDate, endDate } = getQuarterDateRange(quarter, year);
    salesOrders.forEach(order => {
        const orderDate = order.transaction_date;
        const perBilled = parseFloat(order.per_billed || 0);
        const baseNetTotal = parseFloat(order.base_net_total || 0);
        const billedAmount = baseNetTotal * (perBilled / 100);
        if (orderDate >= startDate && orderDate <= endDate) {
            sum += billedAmount;
        }
    });
    return sum;
};
const sumSalesOrderGPForQuarter = (salesOrders, quarter, year) => {
    let sum = 0;
    const { startDate, endDate } = getQuarterDateRange(quarter, year);
    salesOrders.forEach(order => {
        const orderDate = order.transaction_date;
        if (orderDate >= startDate && orderDate <= endDate) {
            sum += parseFloat(order.custom_total_gp_amount || 0);
        }
    });
    return sum;
};
// Function to update the achieved values for each quarter (Q1-Q4)
const updateAchievedValues = (year, user) => {
    fetchSalesOrderData(year, user, function(response) {
        if (response.message) {
            
            const achievedGPData = {
                Q1: sumSalesOrderGPForQuarter(response.message, 'Q1', year),
                Q2: sumSalesOrderGPForQuarter(response.message, 'Q2', year),
                Q3: sumSalesOrderGPForQuarter(response.message, 'Q3', year),
                Q4: sumSalesOrderGPForQuarter(response.message, 'Q4', year)
            }; 
            root_element.getElementById('gpQ1').innerText = formatCurrency(achievedGPData.Q1);
            root_element.getElementById('gpQ2').innerText = formatCurrency(achievedGPData.Q2);
            root_element.getElementById('gpQ3').innerText = formatCurrency(achievedGPData.Q3);
            root_element.getElementById('gpQ4').innerText = formatCurrency(achievedGPData.Q4);
            
            const achievedData = {
                Q1: sumSalesOrderAmountsForQuarter(response.message, 'Q1', year),
                Q2: sumSalesOrderAmountsForQuarter(response.message, 'Q2', year),
                Q3: sumSalesOrderAmountsForQuarter(response.message, 'Q3', year),
                Q4: sumSalesOrderAmountsForQuarter(response.message, 'Q4', year)
            };
            
            updateAchievedColor('Q1', achievedData.Q1);
            updateAchievedColor('Q2', achievedData.Q2);
            updateAchievedColor('Q3', achievedData.Q3);
            updateAchievedColor('Q4', achievedData.Q4);
            
            // Update the achieved values in the table
            root_element.getElementById('achievedQ1').innerText = formatCurrency(achievedData.Q1);
            root_element.getElementById('achievedQ2').innerText = formatCurrency(achievedData.Q2);
            root_element.getElementById('achievedQ3').innerText = formatCurrency(achievedData.Q3);
            root_element.getElementById('achievedQ4').innerText = formatCurrency(achievedData.Q4);
            
            const achievedInvoiceData = {
                Q1: sumAchievedInvoiceForQuarter(response.message, 'Q1', year),
                Q2: sumAchievedInvoiceForQuarter(response.message, 'Q2', year),
                Q3: sumAchievedInvoiceForQuarter(response.message, 'Q3', year),
                Q4: sumAchievedInvoiceForQuarter(response.message, 'Q4', year)
            };
            updateAchievedColor('I1', achievedInvoiceData.Q1);
            updateAchievedColor('I2', achievedInvoiceData.Q2);
            updateAchievedColor('I3', achievedInvoiceData.Q3);
            updateAchievedColor('I4', achievedInvoiceData.Q4);
            
            root_element.getElementById('achievedI1').innerText = formatCurrency(achievedInvoiceData.Q1);
            root_element.getElementById('achievedI2').innerText = formatCurrency(achievedInvoiceData.Q2);
            root_element.getElementById('achievedI3').innerText = formatCurrency(achievedInvoiceData.Q3);
            root_element.getElementById('achievedI4').innerText = formatCurrency(achievedInvoiceData.Q4);
            
        }
    });
};

const updateAchievedColor = (quarter, achievedAmount) => {
    const targetElement = root_element.getElementById(`target${quarter}`);
    const achievedElement = root_element.getElementById(`achieved${quarter}`);
    
    // Parse the target and achieved amounts to compare
    const targetAmount = parseFloat(targetElement.innerText.replace('AED', '').trim().replace(',', ''));
    const achieved = parseFloat(achievedAmount);
    
    // Set the color based on comparison
    if (achieved < targetAmount) {
        achievedElement.style.color = "red";
    } else {
        achievedElement.style.color = "green";
    }
    
    achievedElement.innerText = formatCurrency(achieved);
};
// Function to sum the opportunity amounts based on category and filters
const sumCategoryAmounts = (category, opportunities) => {
    return opportunities
        .filter(opportunity => opportunity.custom_category_type === category)
        .reduce((sum, opportunity) => {
            if (["Open", "Quotation", "Closed", "Replied"].includes(opportunity.status)) {
                const amount = parseFloat(opportunity.opportunity_amount || 0);
                return sum + amount;
            }
            return sum;
        }, 0);
};

// Function to fetch opportunity data based on filters and then update the table
const fetchOpportunityData = (filters, callback) => {
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Opportunity",
            fields: ["opportunity_amount", "status", "transaction_date", "opportunity_owner", "custom_category_type"],
            filters: filters,
            limit_page_length: 1000000
        },
        callback: callback,
        error: function(err) {
            console.error("Error fetching opportunities:", err);
        }
    });
};

// Function to fetch sales target data based on the selected year and user
const fetchSalesTargetData = (year, user, callback) => {
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Sales Target Allocation",
            fields: ["year", "user", "amount1", "amount2", "amount3", "amount4","amount5","amount6","amount7","amount8"],
            filters: {
                year: year,
                user: user
            },
            limit_page_length: 100000
        },
        callback: callback,
        error: function(err) {
            console.error("Error fetching sales targets:", err);
        }
    });
};

// Function to update the table with the summed opportunity amounts for each category and sales targets
const updateTable = (startDate, endDate, quarter, user) => {
    const year = root_element.getElementById('yearFilter').value;
    const filters = {
        transaction_date: ["between", [startDate, endDate]],
        opportunity_owner: user ? user : undefined,
        status: ["in", ["Open", "Quotation"]]
    };

    // Fetch opportunity data based on filters (Year, Quarter, User)
    fetchOpportunityData(filters, function(response) {
        if (response.message) {
            // Sum the opportunity amounts for each category (A, B, C)
            const categoryData = {
                A: sumCategoryAmounts('Category A', response.message),
                B: sumCategoryAmounts('Category B', response.message),
                C: sumCategoryAmounts('Category C', response.message)
            };

            // Update the table with the formatted values for each category
            root_element.getElementById('categoryA').innerText = formatCurrency(categoryData.A);
            root_element.getElementById('categoryB').innerText = formatCurrency(categoryData.B);
            root_element.getElementById('categoryC').innerText = formatCurrency(categoryData.C);
        }
    });

    // Fetch the sales target data based on the selected user and year (Only Year and User filters)
    fetchSalesTargetData(year, user, function(response) {
        if (response.message && response.message.length > 0) {
            const target = response.message[0];

            // Update the sales target values for each quarter
            root_element.getElementById('targetQ1').innerText = formatCurrency(target.amount1 || 0);
            root_element.getElementById('targetQ2').innerText = formatCurrency(target.amount2 || 0);
            root_element.getElementById('targetQ3').innerText = formatCurrency(target.amount3 || 0);
            root_element.getElementById('targetQ4').innerText = formatCurrency(target.amount4 || 0);
            root_element.getElementById('targetI1').innerText = formatCurrency(target.amount5 || 0);
            root_element.getElementById('targetI2').innerText = formatCurrency(target.amount6 || 0);
            root_element.getElementById('targetI3').innerText = formatCurrency(target.amount7 || 0);
            root_element.getElementById('targetI4').innerText = formatCurrency(target.amount8 || 0);
        }
    });

    // Update achieved values for each quarter (Q1-Q4)
    updateAchievedValues(year, user);
};

// Function to handle the apply button click
const handleApplyButtonClick = () => {
    const year = root_element.getElementById('yearFilter').value;
    const quarter = root_element.getElementById('quarterFilter').value;
    const user = root_element.getElementById('userFilter').value;
    let startDate = '', endDate = '';
    
    if (year) {
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
    }
    // Get the date range based on the quarter or custom date range
    else if (quarter === "custom") {
        startDate = root_element.getElementById('dateRangeStart').value;
        endDate = root_element.getElementById('dateRangeEnd').value;
    } else {
        const { startDate: qStartDate, endDate: qEndDate } = getQuarterDateRange(quarter, year);
        startDate = qStartDate;
        endDate = qEndDate;
    }

    // Update the table with the filtered data (Year, Quarter, User)
    updateTable(startDate, endDate, quarter, user);
};

// Function to handle the clear button click
const handleClearButtonClick = () => {
    root_element.getElementById('yearFilter').value = '';
    root_element.getElementById('quarterFilter').value = '';
    root_element.getElementById('userFilter').value = '';
    root_element.getElementById('dateRangeStart').value = '';
    root_element.getElementById('dateRangeEnd').value = '';
    root_element.getElementById('customDateRange').style.display = "none";

    // Reset the table
    root_element.getElementById('categoryA').innerText = formatCurrency(0);
    root_element.getElementById('categoryB').innerText = formatCurrency(0);
    root_element.getElementById('categoryC').innerText = formatCurrency(0);
    root_element.getElementById('targetQ1').innerText = formatCurrency(0);
    root_element.getElementById('targetQ2').innerText = formatCurrency(0);
    root_element.getElementById('targetQ3').innerText = formatCurrency(0);
    root_element.getElementById('targetQ4').innerText = formatCurrency(0);
    root_element.getElementById('targetI1').innerText = formatCurrency(0);
    root_element.getElementById('targetI2').innerText = formatCurrency(0);
    root_element.getElementById('targetI3').innerText = formatCurrency(0);
    root_element.getElementById('targetI4').innerText = formatCurrency(0);
    root_element.getElementById('achievedQ1').innerText = formatCurrency(0);
    root_element.getElementById('achievedQ2').innerText = formatCurrency(0);
    root_element.getElementById('achievedQ3').innerText = formatCurrency(0);
    root_element.getElementById('achievedQ4').innerText = formatCurrency(0);
    root_element.getElementById('achievedI1').innerText = formatCurrency(0);
    root_element.getElementById('achievedI2').innerText = formatCurrency(0);
    root_element.getElementById('achievedI3').innerText = formatCurrency(0);
    root_element.getElementById('achievedI4').innerText = formatCurrency(0);
    root_element.getElementById('gpQ1').innerText = formatCurrency(0);
    root_element.getElementById('gpQ2').innerText = formatCurrency(0);
    root_element.getElementById('gpQ3').innerText = formatCurrency(0);
    root_element.getElementById('gpQ4').innerText = formatCurrency(0);
};

// Initialize the filters and event listeners
const initializeFilters = () => {
    updateYearFilter();
    updateQuarterFilter();
    populateUserFilter();

    // Apply button click listener
    root_element.getElementById('applyBtn').addEventListener('click', handleApplyButtonClick);

    // Clear button click listener
    root_element.getElementById('clearBtn').addEventListener('click', handleClearButtonClick);

    // Change event listener for the quarter filter to toggle the custom date range
    root_element.getElementById('quarterFilter').addEventListener('change', function() {
        if (this.value === "custom") {
            root_element.getElementById('customDateRange').style.display = "block";
        } else {
            root_element.getElementById('customDateRange').style.display = "none";
        }
    });
};

initializeFilters();