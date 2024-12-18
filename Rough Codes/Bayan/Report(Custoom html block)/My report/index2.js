document.addEventListener('DOMContentLoaded', function() {
    const employees = [
        { name: "John Doe", dept: "Development", designation: "Senior Developer", weeks: [
            { estHour: 40, actualHour: 42, diff: -2, verify: "Ok" },
            { estHour: 40, actualHour: 38, diff: 2, verify: "Ok" },
            { estHour: 40, actualHour: 39, diff: 1, verify: "Ok" },
            { estHour: 40, actualHour: 40, diff: 0, verify: "Ok" },
            { estHour: 40, actualHour: 41, diff: -1, verify: "Ok" }
        ]}
        // More employees can be added here
    ];

    const tbody = document.getElementById('employeeData');
    employees.forEach(employee => {
        const tr = document.createElement('tr');
        let innerHTML = `<td>${employee.name}</td><td>${employee.dept}</td><td>${employee.designation}</td>`;
        let totalEstHours = 0, totalActualHours = 0, totalDiff = 0;
        employee.weeks.forEach(week => {
            totalEstHours += week.estHour;
            totalActualHours += week.actualHour;
            totalDiff += week.diff;
            innerHTML += `
                <td>${week.estHour}</td>
                <td>${week.actualHour}</td>
                <td>${week.diff}</td>
                <td><button onclick="verifyWeek('${employee.name}')">${week.verify}</button></td>
                <td><button onclick="viewDetails('${employee.name}', ${week.estHour}, ${week.actualHour})">View Hours</button></td>
            `;
        });
        innerHTML += `
            <td>${totalEstHours}</td>
            <td>${totalActualHours}</td>
            <td>${totalDiff}</td>
        `;
        tr.innerHTML = innerHTML;
        tbody.appendChild(tr);
    });

    window.verifyWeek = function(employeeName) {
        alert(`Verification complete for ${employeeName}`);
    };

    window.viewDetails = function(employeeName, estHour, actualHour) {
        alert(`Details for ${employeeName}: Estimated Hours: ${estHour}, Actual Hours: ${actualHour}`);
    };
});
