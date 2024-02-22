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
	}
}

// ----------------------- THE PRIMARY PAGE FUNCTIONS -----------------------

// The main function that drives the page
function get_file_by_id($id)
{
	switch ($id) {
		case "dropdown":
			$jsonData = getDropDownInformation(1);
			break;
		case "paragraphInfo":
			$jsonData = getDropDownInformation(2);
			break;
	}
}
