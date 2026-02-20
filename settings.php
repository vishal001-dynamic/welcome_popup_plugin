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
 * Admin settings for the Welcome Modal local plugin.
 *
 * @package    local_welcome_modal
 * @copyright  2026 Dynamic Pixel Multimedia Solutions
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $settings = new admin_settingpage(
        'local_welcome_modal',
        get_string('pluginname', 'local_welcome_modal')
    );

    $settings->add(new admin_setting_configtext(
        'local_welcome_modal/library_url',
        get_string('library_url_label', 'local_welcome_modal'),
        get_string('library_url_desc', 'local_welcome_modal'),
        'https://dynamicpixel.co.in',
        PARAM_URL
    ));

    $settings->add(new admin_setting_configselect(
        'local_welcome_modal/modal_size',
        get_string('modal_size_label', 'local_welcome_modal'),
        get_string('modal_size_desc', 'local_welcome_modal'),
        'medium',
        [
            'small' => get_string('size_small', 'local_welcome_modal'),
            'medium' => get_string('size_medium', 'local_welcome_modal'),
            'large' => get_string('size_large', 'local_welcome_modal'),
            'extralarge' => get_string('size_extralarge', 'local_welcome_modal'),
        ]
    ));

    $settings->add(new admin_setting_configcheckbox(
        'local_welcome_modal/use_session',
        get_string('use_session_label', 'local_welcome_modal'),
        get_string('use_session_desc', 'local_welcome_modal'),
        1
    ));

    $settings->add(new admin_setting_configtext(
        'local_welcome_modal/session_key',
        get_string('session_key_label', 'local_welcome_modal'),
        get_string('session_key_desc', 'local_welcome_modal'),
        'welcomeModalShown',
        PARAM_ALPHANUMEXT
    ));

    $settings->add(new admin_setting_configtext(
        'local_welcome_modal/welcome_title',
        get_string('welcome_title_label', 'local_welcome_modal'),
        get_string('welcome_title_desc', 'local_welcome_modal'),
        get_string('welcome_title', 'local_welcome_modal'),
        PARAM_TEXT
    ));

    $settings->add(new admin_setting_configtext(
        'local_welcome_modal/welcome_heading',
        get_string('welcome_heading_label', 'local_welcome_modal'),
        get_string('welcome_heading_desc', 'local_welcome_modal'),
        get_string('welcome_heading', 'local_welcome_modal'),
        PARAM_TEXT
    ));

    $settings->add(new admin_setting_configtext(
        'local_welcome_modal/welcome_subheading',
        get_string('welcome_subheading_label', 'local_welcome_modal'),
        get_string('welcome_subheading_desc', 'local_welcome_modal'),
        get_string('welcome_subheading', 'local_welcome_modal'),
        PARAM_TEXT
    ));

    $settings->add(new admin_setting_configtext(
        'local_welcome_modal/library_button',
        get_string('library_button_label', 'local_welcome_modal'),
        get_string('library_button_desc', 'local_welcome_modal'),
        get_string('library_button', 'local_welcome_modal'),
        PARAM_TEXT
    ));

    $settings->add(new admin_setting_configtext(
        'local_welcome_modal/dismiss_button',
        get_string('dismiss_button_label', 'local_welcome_modal'),
        get_string('dismiss_button_desc', 'local_welcome_modal'),
        get_string('dismiss_button', 'local_welcome_modal'),
        PARAM_TEXT
    ));

    $ADMIN->add('localplugins', $settings);
}
