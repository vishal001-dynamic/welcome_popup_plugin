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
 * Library callbacks for the Welcome Modal local plugin.
 *
 * This file contains Moodle callback functions used by the
 * local_welcome_modal plugin.
 *
 * @package    local_welcome_modal
 * @copyright  2026 Dynamic Pixel Multimedia Solutions
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Handles showing the welcome popup after login until dismissed.
 */
function local_welcome_modal_before_standard_html_head() {
    global $PAGE, $USER, $DB, $CFG, $FULLME;

    if (!isloggedin() || isguestuser() || is_siteadmin($USER)) {
        return;
    }

    $path = parse_url($FULLME, PHP_URL_PATH);
    if (strpos($path, '/my/') === false && $path !== '/my') {
        return;
    }

    $user = $DB->get_record('user', ['id' => $USER->id], 'id, policyagreed', IGNORE_MISSING);
    if (!$user) {
        return;
    }

    $policyenabled = !empty($CFG->sitepolicy) || !empty($CFG->sitepolicyhandler);

    if ($policyenabled && empty($user->policyagreed)) {
        return;
    }

    $tableexists = $DB->get_manager()->table_exists('local_welcome_modal_dismissed');
    $dismissed = 0;
    if ($tableexists) {
        $dismissed = $DB->record_exists('local_welcome_modal_dismissed', ['userid' => $USER->id]) ? 1 : 0;
    }

    // Get configurable settings.
    $libraryurl = get_config('local_welcome_modal', 'library_url');
    $modalsize = get_config('local_welcome_modal', 'modal_size');
    $usesession = get_config('local_welcome_modal', 'use_session');
    $sessionkey = get_config('local_welcome_modal', 'session_key');

    if (empty($modalsize)) {
        $modalsize = 'medium';
    }

    if (empty($libraryurl)) {
        $libraryurl = 'https://dynamicpixel.co.in';
    } else {
        if (!preg_match('/^https?:\/\//', $libraryurl)) {
            if (strpos($libraryurl, '/') !== 0) {
                $libraryurl = (new moodle_url($libraryurl))->out(false);
            }
        }
    }

    if ($usesession === false) {
        $usesession = 1;
    }
    if (empty($sessionkey)) {
        $sessionkey = 'welcomeModalShown';
    }

    $dismissphppath = (new moodle_url('/local/welcome_modal/dismiss.php'))->out(false);

    $welcometitle = get_config('local_welcome_modal', 'welcome_title');
    if ($welcometitle === false) {
        $welcometitle = get_string('welcome_title', 'local_welcome_modal');
    }

    $welcomeheading = get_config('local_welcome_modal', 'welcome_heading');
    if ($welcomeheading === false) {
        $welcomeheading = get_string('welcome_heading', 'local_welcome_modal');
    }

    $welcomesubheading = get_config('local_welcome_modal', 'welcome_subheading');
    if ($welcomesubheading === false) {
        $welcomesubheading = get_string('welcome_subheading', 'local_welcome_modal');
    }

    $librarybutton = get_config('local_welcome_modal', 'library_button');
    if ($librarybutton === false) {
        $librarybutton = get_string('library_button', 'local_welcome_modal');
    }

    $dismissbutton = get_config('local_welcome_modal', 'dismiss_button');
    if ($dismissbutton === false) {
        $dismissbutton = get_string('dismiss_button', 'local_welcome_modal');
    }

    $langstrings = [
        'close_button'       => get_string('close_button', 'local_welcome_modal'),
        'close_aria_label'   => get_string('close_aria_label', 'local_welcome_modal'),
        'welcome_title'      => $welcometitle,
        'welcome_heading'    => $welcomeheading,
        'welcome_subheading' => $welcomesubheading,
        'library_button'     => $librarybutton,
        'dismiss_button'     => $dismissbutton,
    ];

    $userdata = [
        'id'            => $USER->id,
        'fullname'      => fullname($USER),
        'dismissed'     => $dismissed,
        'policyenabled' => $policyenabled ? 1 : 0,
        'policyagreed'  => (int)$user->policyagreed,
        'lang'          => $langstrings,
        'wwwroot'       => $CFG->wwwroot,
        'libraryurl'    => $libraryurl,
        'dismissphppath' => $dismissphppath,
        'usesession'    => (int)$usesession,
        'sessionkey'    => $sessionkey,
        'sesskey'       => sesskey(),
        'modalsize'     => $modalsize,
    ];

    $PAGE->requires->js(new moodle_url('/local/welcome_modal/js/script.js'));
    $PAGE->requires->js_init_code('window.userData = ' . json_encode($userdata) . ';');
}
