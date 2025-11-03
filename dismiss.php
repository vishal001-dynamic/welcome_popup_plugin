<?php
require_once(__DIR__ . '/../../config.php');
require_login();

global $DB, $USER;

if (!$DB->get_manager()->table_exists('local_welcome_modal_dismissed')) {
    echo json_encode(['error' => 'missing_table']);
    die;
}

// Insert record if not already dismissed
if (!$DB->record_exists('local_welcome_modal_dismissed', ['userid' => $USER->id])) {
    $record = new stdClass();
    $record->userid = $USER->id;
    $record->timemodified = time();
    $DB->insert_record('local_welcome_modal_dismissed', $record);
}

echo json_encode(['success' => true]);
die;
