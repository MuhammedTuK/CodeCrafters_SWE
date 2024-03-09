/******************************Main Page Functions*****************************************/
$(document).ready(function () {

    checkBoxListenerAdd(); // add the checkbox listener event    
    loadPageInformation(); // Call the primary function to load all of the page information
});

function loadPageInformation(reset)
{ 
    selctionColClear();
    radioButtColClear();
    SplitColClear();
    loadEmptyImg();
    clearTable();
    document.getElementById('selectionSwitch').checked = false;

    // Call functions to load the page information
    loadStudentsListsInfo(reset);
}

function loadStudentsListsInfo(reset)
{
    var url;

    if(reset == 1)
        url = "PageAPI.php?id=resetTable";
    else
        url = "PageAPI.php?id=studentsInfo";

    getData(url)
        .then(function(data) {
            // Code to execute after the asynchronous call has completed successfully
            pageListsPopulate(data);
            // if resetting, save the data
            if(reset == 1) saveTable();
            //add radio container event listener
            radioContainerListenerAdd();
            //initialize selection box
            selectionCtrl(false);
        })
        .catch(function(error) {
            // Code to handle errors
            console.error("Error:", error);
        });
}

function pageListsPopulate(data)
{
    //dropdown header
    $('#dropdownSel').append('<option value="0"> Select </option>'); 
            
    $.each(data.studentsInfoTable, function (index, value) {  
        //load the dropDownList
        dropdownPopulate(index, value);
        //load the radioContainer
        radioContainerPopulate(index, value);
        //load the table rows
        tablePopulate(index, value);
    });
}

function updateSelectedInfo(selctor, selected){
    if (selctor == "dropdownSelection"){
        $('#selctionMsg').empty(); // clear the paragraph information  
        if(selected == 0) loadEmptyImg();   
        // Call functions to load the page information           
        loadSelectedInfo(selected, "dropdownInfo");
    }
    else if(selctor == "radioSelection"){
        $('#radioMsg').empty(); // clear the paragraph information     
        // Call functions to load the page information
        loadSelectedInfo(selected, "radioInfo");
    }
}

function loadSelectedInfo(selected, outputSel){
    var url = "PageAPI.php?id=studentsInfo";
    $.getJSON(url, function (data) {
        $.each(data.studentsInfoTable, function (index, value) {            
            if((index+1) == selected){
                if(outputSel == "dropdownInfo"){
                    $('#selctionMsg').append(value.team);
                }
                else if(outputSel == "radioInfo"){
                    $('#radioMsg').append(value.team);
                }
                loadImgInformation(value.photo);
            }
        });
    });
}

function disableContainer(containerId) {
    var container = document.getElementById(containerId);
    container.classList.add('disabled-container');
}

function enableContainer(containerId) {
    var container = document.getElementById(containerId);
    container.classList.remove('disabled-container');
}

function selectionCtrl(checked)
{
    if (checked) {
        disableContainer('dropdownContainer'); // To disable the container
        enableContainer('radioSContainer'); // To enable the container
    } else {
        disableContainer('radioSContainer'); // To disable the container
        enableContainer('dropdownContainer'); // To enable the container
    }
}

function checkBoxListenerAdd()
{
    // Get the checkbox element
    const checkbox = document.getElementById('selectionSwitch');
    // Add event listener for 'change' event
    checkbox.addEventListener('change', function() {
        selectionCtrl(this.checked);
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

/******************************Col#1 Functions*****************************************/
function dropdownPopulate(index, value)
{
    $('#dropdownSel').append('<option value="' + (index+1) + '">' + value.name + '</option>');
}

function selctionColClear()
{
    $('#dropdownSel').empty();// clear the dropdown list information information
    $('#selctionMsg').empty(); // clear the paragraph information
}

/******************************Col#2 Functions*****************************************/
function radioContainerPopulate(index, value)
{
    $('#radioContainer').append('<input type="radio" name="studentRadio" value="' + (index+1) + '">' + value.name + '<br>');
}

function radioContainerListenerAdd()
{
    // Get all radio buttons by their name
    const radioButtons = document.querySelectorAll('input[name="studentRadio"]');
    // Loop through each radio button and add an event listener
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', (event) => {
            // When any radio button is selected, this code will execute
            updateSelectedInfo("radioSelection", event.target.value);
        });
    });
}

function radioButtColClear()
{
    $('#radioMsg').empty(); // clear the paragraph information
    $('#radioContainer').empty(); // clear the radio button container
}

/******************************Col#3 Functions*****************************************/
function loadImgInformation(name){
    var imageElement = document.getElementById('studentImg');
    imageElement.width = "300";
    imageElement.height = "400";
    imageElement.src = "inputFiles/photos/" + name;
}

function loadEmptyImg()
{
    var imageElement = document.getElementById('studentImg');
    imageElement.width = "300";
    imageElement.height = "400";
    imageElement.src = "inputFiles/photos/none.png";
}

/******************************Col#4 Functions*****************************************/
function splitWords() {
    // Get the input value
    var inputText = document.getElementById('txtboxSplit').value;
    // Split the input text into an array of words
    var wordsArray = inputText.split(/\s+/);
    // Get the txtSplit paragraph element
    var txtSplit = document.getElementById('txtSplit');
    // Clear the existing content
    txtSplit.innerHTML = '';
    // Loop through the words array and append each word to txtSplit
    wordsArray.forEach(function(word) {
        // Create a new span element for each word
        var wordSpan = document.createElement('span');
        // Set the text content of the span to the current word
        wordSpan.textContent = word;
        // Append the span to txtSplit
        txtSplit.appendChild(wordSpan);
        // Create a line break element
        var lineBreak = document.createElement('br');
        // Append the line break after each word
        txtSplit.appendChild(lineBreak);
    });
}

function SplitColClear()
{
    $('#txtSplit').empty(); // clear the Split txtbox
    document.getElementById('txtboxSplit').value ="";
}