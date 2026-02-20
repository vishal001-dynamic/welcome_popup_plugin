<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Handles dismissal of the welcome modal for logged-in users.
 *
 * This script stores a record indicating that the welcome modal
 * has been dismissed by the current user.
 *
 * @package    local_welcome_modal
 * @copyright  2026 Dynamic Pixel Multimedia Solutions
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../config.php');
require_login();
require_sesskey();

global $DB, $USER;

if (!$DB->get_manager()->table_exists('local_welcome_modal_dismissed')) {
    echo json_encode(['error' => get_string('missing_table', 'local_welcome_modal')]);
    die;
}

if (!$DB->record_exists('local_welcome_modal_dismissed', ['userid' => $USER->id])) {
    $record = new stdClass();
    $record->userid = $USER->id;
    $record->timemodified = time();
    $DB->insert_record('local_welcome_modal_dismissed', $record);
}

echo json_encode(['success' => get_string('success' , 'local_welcome_modal')]);
die;
