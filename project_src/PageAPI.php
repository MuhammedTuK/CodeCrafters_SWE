<?php
// The purpose of this API is to act as an intermediary to determing the json information to be returned by the example PageReader page.

/*****************GET request**********************/
// Call the function to get students info when the script receives a GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	get_file_by_id($_GET["id"]);
}

// The main function that drives the page
function get_file_by_id($id)
{
	getStudentInfoJASON($id);
}

function getStudentInfoJASON($id)
{
	readJSONFile("assets/jason/$id.json");
}

function readJSONFile($url)
{
	$JSON = file_get_contents($url);
	echo $JSON; // return the information to be read by the reader page
}

/*****************POST request**********************/
// Call the function to save students info when the script receives a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// Check if the request is for saving students info
	// if (isset($_POST['students'])) {
	// }
	saveStudentsInfo();

	// Check if the request is for uploading a photo
	if (isset($_FILES['photo'])) {
		$result = uploadPhoto($_FILES['photo']);
		echo json_encode($result);
	}
}

// Function to save students list
function saveStudentsInfo()
{
	// Get the JSON data from the request body
	$jsonString = file_get_contents('php://input');

	// Decode the JSON data
	$requestData = json_decode($jsonString, true);

	// Check if 'students' array is present
	if (!isset($requestData['students'])) {
		//http_response_code(400); // Bad request
		//echo json_encode(array('error' => 'Missing students data'));
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
	$jsonFilePath = 'assets/jason/studentsInfo.json';

	// Write data to the JSON file
	if (file_put_contents($jsonFilePath, $jsonData) !== false) {
		echo json_encode(array('success' => 'Students list saved successfully'));
	} else {
		http_response_code(500); // Internal server error
		echo json_encode(array('error' => 'Failed to save students list'));
	}
}

function uploadPhoto($file)
{
	// Check if the file was uploaded without errors
	if ($file['error'] === UPLOAD_ERR_OK) {
		$uploadDir = dirname(__FILE__) . '/assets/photos/'; // Directory to save the uploaded photos

		// Generate a unique filename
		$fileName = uniqid() . '_' . $file['name'];
		$targetPath = $uploadDir . $fileName;

		// Move the uploaded file to the target directory
		if (move_uploaded_file($file['tmp_name'], $targetPath)) {
			// File uploaded successfully
			return $fileName;
		} else {
			// Error moving the file
			return array('error' => 'Failed to move the uploaded file.');
		}
	} else {
		// No file uploaded or an error occurred during upload
		return array('error' => 'No file uploaded or an error occurred.');
	}
}
