<?php

function resetPhotosDirectory($specifiedPhotos)
{
    $photosDirectory = dirname(__FILE__) . '/assets/photos/';

    // Get all files in the photos directory
    $files = glob($photosDirectory . '*');

    // Delete each file that is not in the list of specified photos
    foreach ($files as $file) {
        if (is_file($file) && !in_array(basename($file), $specifiedPhotos)) {
            unlink($file);
        }
    }

    return 'Photos directory reset successfully.';
}

// Specify the filenames of the photos you want to keep
$specifiedPhotos = ["abdallah.jpg", "mohammed.jpg", "turkey.jpg", "osama.jpg", "musleh.jpg", "none.png", "zharani.jpg", "rayan.jpg"];

// Call the function to reset the photos directory
echo resetPhotosDirectory($specifiedPhotos);
