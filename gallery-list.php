<?php

header("Content-Type: application/json; charset=UTF-8");

$galleryFolder = __DIR__ . "/gallery/";

$allowedExtensions = [
    "jpg",
    "jpeg"
];

$images = [];

if (is_dir($galleryFolder)) {

    $files = scandir($galleryFolder);

    foreach ($files as $file) {

        if ($file === "." || $file === "..") {
            continue;
        }

        $fullPath = $galleryFolder . $file;

        if (!is_file($fullPath)) {
            continue;
        }

        $extension = strtolower(
            pathinfo($file, PATHINFO_EXTENSION)
        );

        if (!in_array($extension, $allowedExtensions, true)) {
            continue;
        }

        $images[] = $file;
    }
}

natcasesort($images);

$images = array_values($images);

echo json_encode(
    $images,
    JSON_UNESCAPED_SLASHES |
    JSON_UNESCAPED_UNICODE
);