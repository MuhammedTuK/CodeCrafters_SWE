/******************************Main Page Functions*****************************************/
$(document).ready(function () {

    loadPageInformation(0); // Call the primary function to load all of the page information
});

function loadPageInformation(reset)
{ 
    clearTable();
    // Call functions to load the page information
    loadStudentsListsInfo(reset);
}

function loadStudentsListsInfo(reset)
{
    var url;

    if(reset == 1)
        url = "PageAPI.php?id=studentsInfoBkup";
    else
        url = "PageAPI.php?id=studentsInfo";

    getData(url)
        .then(function(data) {
            // Code to execute after the asynchronous call has completed successfully
            pageListsPopulate(data);
            // if resetting, save the data
            if(reset == 1) saveTable();
        })
        .catch(function(error) {
            // Code to handle errors
            console.error("Error:", error);
        });
}

function pageListsPopulate(data)
{            
    $.each(data.studentsInfoTable, function (index, value) {  
        //load the table rows
        tablePopulate(index, value);
    });
}

// jason call in a promise
function getData(url) {
    return new Promise((resolve, reject) => {
        $.getJSON(url, function (data) {
            resolve(data); // Resolve the promise with the data
        }).fail(function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown); // Reject the promise if there's an error
        });
    });
}

/******************************Table Functions*****************************************/
var actionCellString = "<button class='small-btn' onclick='editRow(this)'>Edit</button>" + 
                       "<button class='remove-btn' onclick='removeRow(this)'>Remove</button>" + 
                       "<button class='small-btn' onclick='moveUp(this)'>Up</button>" +
                       "<button class='small-btn' onclick='moveDown(this)'>Down</button>" + 
                       "<button class='small-btn' onclick='uploadPhoto(this)'>Upload Photo</button>" + 
                       "<button class='small-btn' onclick='saveRow(this,1)'>Save</button>";


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
    actionsCell.innerHTML = actionCellString;
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
    actionsCell.innerHTML = actionCellString;
    
    // Disable the edit button for the newly added row
    var editButton = newRow.querySelector("button[onclick='editRow(this)']");
    editButton.disabled = true;
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

function saveRow(button, save_all) {
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

    if(save_all == 1)
    {
        // Save table to server
        saveTable();
    }
}

function saveTable() {
    var table = document.getElementById("rosterTable").getElementsByTagName('tbody')[0];
    
    // Save the row currently in edit mode, if any
    var editButtons = table.querySelectorAll("button[onclick='editRow(this)']:disabled");
    for (var i = 0; i < editButtons.length; i++) {
        saveRow(editButtons[i], 0);
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
            console.log(response);
            loadPageInformation(0);
        },
        error: function(xhr, status, error) {
            console.error("Error saving students list:", error);
        }
    });
}

function uploadPhoto(button) {
    // Create an input element of type file
    var input = document.createElement('input');
    input.type = 'file';

    // Add an event listener to handle file selection
    input.onchange = function(event) {
        var file = event.target.files[0];
        
        // Check if the file size exceeds 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB. Please upload a smaller image.');
            return;
        }
        
        // Create a FormData object to send the file to the server
        var formData = new FormData();
        formData.append('photo', file);

        // Send the file to the server using AJAX
        $.ajax({
            url: 'PageAPI.php', // Replace 'upload.php' with the appropriate server-side script
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                // Handle the response from the server
                console.log('File uploaded successfully:', response);
                
                // Remove surrounding double quotes and backslashes from the file name
                var fileName = response.replace(/^"|"$/g, '');
                var row = button.parentNode.parentNode;
                row.setAttribute('data-photo', fileName);
                //save new data to server
                saveTable();
            },
            error: function(xhr, status, error) {
                // Handle errors
                console.error('Error uploading file:', error);
            }
        });
    };

    // Trigger the file input dialog
    input.click();
}

function resetPhotosDirectory() {
    // Send an AJAX request to the server to reset the photos directory
    $.ajax({
        url: 'photoHndlr.php',
        type: 'POST',
        success: function(response) {
            // Handle the success response
            console.log(response); // Log the response from the server
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.error('Error resetting photos directory:', error);
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
    resetPhotosDirectory();
}

