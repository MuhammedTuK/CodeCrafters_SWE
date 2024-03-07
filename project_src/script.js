
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

function dropdownPopulate(value)
{
    $('#dropdownSel').append('<option value="' + value.value + '">' + value.label + '</option>');
}

function radioContainerPopulate(value)
{
    $('#radioContainer').append('<input type="radio" name="studentRadio" value="' + value.value + '">' + value.label + '<br>');
}

function pageListsPopulate(data)
{
    //dropdown header
    $('#dropdownSel').append('<option value="0"> Select </option>'); 
            
    $.each(data.dropdownOptions, function (index, value) {  
        //load the dropDownList
        dropdownPopulate(value);
        //load the radioContainer
        radioContainerPopulate(value);
        //load the table rows
        tablePopulate(value);
    });
}

function loadStudentsListformation(reset)
{
    var url;

    if(reset == 1)
        url = "PageAPI.php?id=resetTable";
    else
        url = "PageAPI.php?id=studentsList";

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

function radioContainerListenerAdd()
{
    // Get all radio buttons by their name
    const radioButtons = document.querySelectorAll('input[name="studentRadio"]');
    // Loop through each radio button and add an event listener
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', (event) => {
            // When any radio button is selected, this code will execute
            updateDropdownParagraph("radioSelection", event.target.value);
        });
    });
}

function loadParagraphInformation(selected, outputSel){
    var url = "PageAPI.php?id=paragraphInfo";
    $.getJSON(url, function (data) {
        $.each(data.list, function (index, value) {
            if(value.value == selected){
                if(outputSel == "dropdownInfo"){
                    $('#selctionMsg').append(value.label);
                }
                else if(outputSel == "radioInfo"){
                    $('#radioMsg').append(value.label);
                }
            }
        });
    });
}

function loadImgInformation(selected){
    var imageElement = document.getElementById('studentImg');
    imageElement.width = "300";
    imageElement.height = "400";

    if      (selected == 1) { imgSrc = "inputFiles/abdulatif.jpg"}
    else if (selected == 2) { imgSrc = "inputFiles/dawsari.jpg"}
    else if (selected == 3) { imgSrc = "inputFiles/johani.jpg"}
    else if (selected == 4) { imgSrc = "inputFiles/otaibi.jpg"}
    else if (selected == 5) { imgSrc = "inputFiles/shahrani.jpg"}
    /*else if (selected == 6) { imgSrc = "inputFiles/tukhays.jpg"}*/
    else if (selected == 7) { imgSrc = "inputFiles/zhrani.jpg"}            
    else if (selected == 8) { imgSrc = "inputFiles/ghadi.jpg"}
    else {
        imgSrc = "inputFiles/empty.png"
        imageElement.width = "300";
        imageElement.height = "400";
    }
    imageElement.src = imgSrc;
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

function updateDropdownParagraph(selctor, value){
    if (selctor == "dropdownSelection"){
        $('#selctionMsg').empty(); // clear the paragraph information     
        // Call functions to load the page information           
        loadParagraphInformation(value, "dropdownInfo");
    }
    else if(selctor == "radioSelection"){
        $('#radioMsg').empty(); // clear the paragraph information     
        // Call functions to load the page information
        loadParagraphInformation(value, "radioInfo");
    }
    loadImgInformation(value);
}

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

function loadPageInformationOnStartUp(reset)
{
    $('#selctionMsg').empty(); // clear the paragraph information
    $('#radioMsg').empty(); // clear the paragraph information
    $('#dropdownSel').empty();// clear the dropdown list information information
    $('#radioContainer').empty(); // clear the radio button container
    $('#txtSplit').empty(); // clear the Split txtbox
    document.getElementById('txtboxSplit').value ="";
    document.getElementById('selectionSwitch').checked = false;
    loadImgInformation(0);
    clearTable();

    // Call functions to load the page information
    loadStudentsListformation(reset);
}

$(document).ready(function () {

    // Get the checkbox element
    const checkbox = document.getElementById('selectionSwitch');
    // Add event listener for 'change' event
    checkbox.addEventListener('change', function() {
        selectionCtrl(this.checked);
    });
    
    loadPageInformationOnStartUp(); // Call the primary function to load all of the page information
});