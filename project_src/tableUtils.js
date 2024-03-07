function tablePopulate(value)
{
    var table = document.getElementById("rosterTable").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(-1);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    cell1.textContent = value.label;
    newRow.setAttribute("data-value", value.value);
    cell2.innerHTML = "<button class='small-btn' onclick='editRow(this)'>Edit</button> <button class='small-btn' onclick='removeRow(this)'>Remove</button> <button class='small-btn' onclick='moveUp(this)'>Up</button> <button class='small-btn' onclick='moveDown(this)'>Down</button> <button class='small-btn' onclick='saveRow(this)'>Save</button>";
}

function editRow(button) {
    var row = button.parentNode.parentNode;
    var cells = row.getElementsByTagName("td");
    var cell = cells[0];
    var input = document.createElement("input");
    input.type = "text";
    input.value = cell.innerHTML;
    cell.innerHTML = "";
    cell.appendChild(input);
    
    // Disable the edit button once clicked
    button.disabled = true;
}

function removeRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function moveUp(button) {
    var row = button.parentNode.parentNode;
    var previousRow = row.previousElementSibling;
    if (previousRow) {
        row.parentNode.insertBefore(row, previousRow);
    }
}

function moveDown(button) {
    var row = button.parentNode.parentNode;
    var nextRow = row.nextElementSibling;
    if (nextRow) {
        row.parentNode.insertBefore(nextRow, row);
    }
}

function saveRow(button) {
    var row = button.parentNode.parentNode;
    var input = row.getElementsByTagName("input")[0];
    var cell = row.getElementsByTagName("td")[0];
    cell.innerHTML = input.value;
    
    // Enable the edit button after saving
    var editButton = row.querySelector("button[onclick='editRow(this)']");
    editButton.disabled = false;

    //save table to server
    saveTable();
}

function addStudent() {
    var table = document.getElementById("rosterTable").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(-1);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    newRow.setAttribute("data-value", table.rows.length);
    cell1.innerHTML = "<input type='text'>";
    cell2.innerHTML = "<button class='small-btn' onclick='editRow(this)'>Edit</button> <button class='small-btn' onclick='removeRow(this)'>Remove</button> <button class='small-btn' onclick='moveUp(this)'>Up</button> <button class='small-btn' onclick='moveDown(this)'>Down</button> <button class='small-btn' onclick='saveRow(this)'>Save</button>";
}     

function saveTable() {
    var table = document.getElementById("rosterTable").getElementsByTagName('tbody')[0];
    
    // Save the row currently in edit mode, if any
    var editButtons = table.querySelectorAll("button[onclick='editRow(this)']:disabled");
    for (var i = 0; i < editButtons.length; i++) {
        saveRow(editButtons[i]);
    }
    
     // Prepare data to send to server
    var students = [];
    for (var i = 0; i < table.rows.length; i++) {
        var studentName = table.rows[i].cells[0].innerText.trim();
        var studentValue = table.rows[i].getAttribute("data-value"); // Retrieve the value associated with the student
        students.push({ value: studentValue, label: studentName });
    }
    
    // Send data to server using AJAX
    $.ajax({
        url: 'PageAPI.php', // Specify your server endpoint here
        type: 'POST', // or 'PUT', depending on your server configuration
        contentType: 'application/json',
        data: JSON.stringify({ students: students }),
        success: function(response) {
        console.log("Students list saved successfully:", students);
        },
        error: function(xhr, status, error) {
        console.error("Error saving students list:", error);
        }
    });
}

function clearTable() {
    var table = document.getElementById("rosterTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear all rows from the table
}

function resetTable() 
{
    var reset = 1;
    loadPageInformationOnStartUp(reset);
}