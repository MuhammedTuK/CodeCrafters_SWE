function tablePopulate(index, value)
{
    var table = document.getElementById("rosterTable").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(-1);
    var nameCell = newRow.insertCell(0);
    var teamCell = newRow.insertCell(1);
    var actionsCell = newRow.insertCell(2);
    nameCell.textContent = value.name;
    teamCell.textContent = value.team;
    newRow.setAttribute("data-photo", value.photo);
    actionsCell.innerHTML = "<button class='small-btn' onclick='editRow(this)'>Edit</button> <button class='small-btn' onclick='removeRow(this)'>Remove</button> <button class='small-btn' onclick='moveUp(this)'>Up</button> <button class='small-btn' onclick='moveDown(this)'>Down</button> <button class='small-btn' onclick='saveRow(this)'>Save</button>";
}

function editRow(button) {
    var row = button.parentNode.parentNode;
    var cells = row.getElementsByTagName("td");
    
    // Loop through each cell in the row
    for (var i = 0; i < (cells.length-1); i++) {
        var cell = cells[i];
        var existingContent = cell.textContent.trim(); // Get the existing content of the cell

        // Create an input field for editing
        var input = document.createElement("input");
        input.type = "text";
        input.value = existingContent; // Set the value of the input field to the existing content
        cell.textContent = ""; // Clear the cell's content
        cell.appendChild(input); // Append the input field to the cell
    }
    
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
    var inputs = row.getElementsByTagName("input");
    var inputsLength = inputs.length;

    // Loop through each input field in the row
    for (var i = 0; i < inputsLength; i++) {
        var input = inputs[0];
        var cell = input.parentNode; // Get the parent td element
        
        // Set the cell's content to the input value
        cell.textContent = input.value;
    }
    
    // Enable the edit button after saving
    var editButton = row.querySelector("button[onclick='editRow(this)']");
    editButton.disabled = false;

    // Save table to server
    saveTable();
}

function addStudent() {
    var table = document.getElementById("rosterTable").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(-1);
    var nameCell = newRow.insertCell(0);
    var teamCell = newRow.insertCell(1);
    var actionsCell = newRow.insertCell(2);
    nameCell.innerHTML = "<input type='text'>";
    teamCell.innerHTML = "<input type='text'>";
    newRow.setAttribute("data-photo", "none.png");
    actionsCell.innerHTML = "<button class='small-btn' onclick='editRow(this)'>Edit</button> <button class='small-btn' onclick='removeRow(this)'>Remove</button> <button class='small-btn' onclick='moveUp(this)'>Up</button> <button class='small-btn' onclick='moveDown(this)'>Down</button> <button class='small-btn' onclick='saveRow(this)'>Save</button>";
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
        var studentData = {};
        var row = table.rows[i];
        
        // Iterate over each cell in the row
        for (var j = 0; j < row.cells.length; j++) {
            studentData.index = i+1;
            var cell = row.cells[j];
            var cellData = cell.innerText.trim(); // Get the text content of the cell
            
            // Extract data based on the cell index
            if (j === 0) {
                studentData.name = cellData;
            } else if (j === 1) {                
                studentData.team = cellData;
            }
            // Add more conditions if you have additional cells with data
            
        }
        // add student photo file source
        studentData.photo = row.getAttribute("data-photo");
        
        // Push the student data to the array
        students.push({ data: studentData });
    }
    
    // Send data to server using AJAX
    $.ajax({
        url: 'PageAPI.php', // Specify your server endpoint here
        type: 'POST', // or 'PUT', depending on your server configuration
        contentType: 'application/json',
        data: JSON.stringify({ students: students }),
        success: function(response) {
            console.log("Students list saved successfully:", students);
            loadPageInformation(0);
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
    loadPageInformation(reset);
}