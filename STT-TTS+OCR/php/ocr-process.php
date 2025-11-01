<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['image_data'])) {
            throw new Exception('No image data provided');
        }

        $imageData = $input['image_data'];
        $language = $input['language'] ?? 'eng';
        
        // Remove data URL prefix
        $imageData = str_replace('data:image/png;base64,', '', $imageData);
        $imageData = str_replace('data:image/jpeg;base64,', '', $imageData);
        $imageData = str_replace('data:image/jpg;base64,', '', $imageData);
        $imageData = str_replace(' ', '+', $imageData);
        
        // Decode base64 image
        $imageBinary = base64_decode($imageData);
        
        // Save temporary image file
        $tempFile = tempnam(sys_get_temp_dir(), 'ocr') . '.png';
        file_put_contents($tempFile, $imageBinary);
        
        // Use Tesseract OCR via command line
        $command = "tesseract " . escapeshellarg($tempFile) . " stdout -l $language 2>/dev/null";
        $output = shell_exec($command);
        
        // Clean up temporary file
        unlink($tempFile);
        
        if ($output === null) {
            throw new Exception('OCR processing failed');
        }
        
        echo json_encode([
            'success' => true,
            'text' => trim($output),
            'language' => $language
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>