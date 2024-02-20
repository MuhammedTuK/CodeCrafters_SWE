<?php

// The purpose of this API is to act as an intermediary to determing the json information to be returned by the example PageReader page.
$jsonData = get_file_by_id($_GET["id"]);

function readJSONFile($url)
{
	$JSON = file_get_contents($url);
	echo $JSON; // return the information to be read by the reader page
}

function readImgFile($url)
{
	$img = file_get_contents($url);
	echo $img; // return the information to be read by the reader page
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
function getPhotoInformation($sel)
{
	switch($sel){
		case "1":
			return readImgFile("inputFiles/abdulatif.jpg");
			break;
		case "2":
			return readImgFile("inputFiles/dawsari.jpg");
			break;
		case "3":
			return readImgFile("inputFiles/johani.jpg");
			break;
		case "4":
			return readImgFile("inputFiles/otaibi.jpg");
			break;
		case "5":
			return readImgFile("inputFiles/shahrani.jpg");
			break;
		case "6":
			return readImgFile("inputFiles/zhrani.jpg");
			break;
		case "7":
			return readImgFile("inputFiles/tukhays.jpg");
			break;
		case "8":
			return readImgFile("inputFiles/ghadi.jpg");
			break;
	}
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
	$sel = $_GET["selected"];
	
	switch ($id) {
		case "dropdown":
			$jsonData = getDropDownInformation(1);
			break;
		case "paragraphInfo":
			$jsonData = getDropDownInformation(2);
			break;
		case "photoInfo":
			$jsonData = getPhotoInformation($sel);
			break;
	}
}