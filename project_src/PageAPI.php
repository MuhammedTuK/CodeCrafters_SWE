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
	return readJSONFile("inputFiles/studentsInfo.json");
}

function getOrigStudentNames()
{
	return readJSONFile("inputFiles/studentsInfoBkup.json");
}

// If it is a dropdown list, take the sel value determine what the contents of the dropdown list should be
function getDropDownInformation($sel)
{
	switch ($sel) {
		case "1":
			$jsonData = getDropDownInformationSNames();
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
		case "studentsInfo":
			$jsonData = getDropDownInformation(1);
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
	$data = array('studentsInfoTable' => array());
	foreach ($students as $student) {
		$data['studentsInfoTable'][] = $student['data'];
	}

	// Convert data to JSON format
	$jsonData = json_encode($data, JSON_PRETTY_PRINT);

	// Read the existing JSON file
	$jsonFilePath = 'inputFiles/studentsInfo.json';

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
