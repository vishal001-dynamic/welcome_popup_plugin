<?php
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    // Create a new admin settings page.
    $settings = new admin_settingpage(
        'local_welcome_modal',
        get_string('pluginname', 'local_welcome_modal')
    );

    // ✅ Only one field: full URL for "Continue Learning" button
    $settings->add(new admin_setting_configtext(
        'local_welcome_modal/button_url',
        get_string('button_url_label', 'local_welcome_modal'),
        get_string('button_url_desc', 'local_welcome_modal'),
        'https://softskill-library.com/my/courses.php?mycoursestab=inprogress&page=1&sort=coursefullname&dir=ASC&view=card',
        PARAM_URL
    ));

    // Add this settings page under "Local plugins"
    $ADMIN->add('localplugins', $settings);
}
