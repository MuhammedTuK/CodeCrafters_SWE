<?php

// The purpose of this API is to act as an intermediary to determing the json information to be returned by the example PageReader page.
$jsonData = get_file_by_id($_GET["id"]);

//  Start dropdown gathering information 
function getDropDownInformationSNames()
{
	return readJSONFile("inputFiles/dropDownListStudents.json");
}
function getListInformationTeams()
{
	return readJSONFile("inputFiles/ListTeams.json");
}

// If it is a dropdown list, take the random value that is being passed in to randomly determine what the contents of the dropdown list should be. This will help with dynamically creating the page.
function getDropDownInformation($sel)
{
	switch ($sel) {
	case "1":
		$jsonData = getDropDownInformationSNames();
		break;
	case "2":
		$jsonData = getListInformationTeams();
		break;
	}
}

// ----------------------- THE PRIMARY PAGE FUNCTIONS -----------------------
// Create a basic file for just getting the contents of a JSON file
function readJSONFile($url)
{
	$JSON = file_get_contents($url);
	echo $JSON; // return the information to be read by the reader page
}

// The main function that drives the page
function get_file_by_id($id)
{
	$static_SNames = 1;
	$static_Teams = 2;
	
	switch ($id) {
		case "dropdown":
			$jsonData = getDropDownInformation($static_SNames);
			break;
		case "paragraphInfo":
			$jsonData = getDropDownInformation($static_Teams);
			break;
	}
}