<?php

// The purpose of this API is to act as an intermediary to determing the json information to be returned by the example PageReader page.
$jsonData = get_file_by_id($_GET["id"]);

function readJSONFile($url)
{
	$JSON = file_get_contents($url);
	echo $JSON; // return the information to be read by the reader page
}

//  Start dropdown gathering information 
function getDropDownInformationSNames()
{
	return readJSONFile("inputFiles/dropDownListStudents.json");
}

function getListInformationTeams()
{
	return readJSONFile("inputFiles/ListTeams.json");
}

function getOrigStudentNames()
{
	return readJSONFile("inputFiles/studentsSrc.json");
}

// If it is a dropdown list, take the sel value determine what the contents of the dropdown list should be
function getDropDownInformation($sel)
{
	switch ($sel) {
		case "1":
			$jsonData = getDropDownInformationSNames();
			break;
		case "2":
			$jsonData = getListInformationTeams();
			break;
		case "3":
			$jsonData = getOrigStudentNames();
			break;
	}
}

// ----------------------- THE PRIMARY PAGE FUNCTIONS -----------------------

// The main function that drives the page
function get_file_by_id($id)
{
	switch ($id) {
		case "studentsList":
			$jsonData = getDropDownInformation(1);
			break;
		case "paragraphInfo":
			$jsonData = getDropDownInformation(2);
			break;
		case "resetTable":
			$jsonData = getDropDownInformation(3);
			break;
	}
}

// Function to save students list
function saveStudentsList()
{
	// Check if the request method is POST
	if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
		http_response_code(400); // Bad request
		echo json_encode(array('error' => 'Invalid request method'));
		return;
	}

	// Get the JSON data from the request body
	$jsonString = file_get_contents('php://input');

	// Decode the JSON data
	$requestData = json_decode($jsonString, true);

	// Check if 'students' array is present
	if (!isset($requestData['students'])) {
		http_response_code(400); // Bad request
		echo json_encode(array('error' => 'Missing students data'));
		return;
	}

	// Extract students array
	$students = $requestData['students'];

	// Prepare data to write to the JSON file
	$data = array('dropdownOptions' => array());
	foreach ($students as $student) {
		// Debugging: Inspect the $student array
		var_dump($student);

		// Ensure required keys are set
		if (isset($student['value']) && isset($student['label'])) {
			$data['dropdownOptions'][] = array('value' => $student['value'], 'label' => $student['label']);
		} else {
			// Error handling: Log or echo an error message
			error_log("Invalid student data: " . print_r($student, true));
			// You can also return an error response if needed
			http_response_code(500);
			echo json_encode(array('error' => 'Invalid student data'));
			return;
		}
	}

	// Convert data to JSON format
	$jsonData = json_encode($data, JSON_PRETTY_PRINT);

	// Path to the JSON file
	$jsonFilePath = 'inputFiles/dropDownListStudents.json';

	// Write data to the JSON file
	if (file_put_contents($jsonFilePath, $jsonData) !== false) {
		echo json_encode(array('success' => 'Students list saved successfully'));
	} else {
		http_response_code(500); // Internal server error
		echo json_encode(array('error' => 'Failed to save students list'));
	}
}

// Call the function to save students list when the script receives a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	saveStudentsList();
}
