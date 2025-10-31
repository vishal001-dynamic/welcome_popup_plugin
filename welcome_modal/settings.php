<?php
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    // Create a new admin settings page.
    $settings = new admin_settingpage(
        'local_welcome_modal',
        get_string('pluginname', 'local_welcome_modal')
    );

    // Add a text field for redirect URL.
    $settings->add(new admin_setting_configtext(
        'local_welcome_modal/button_url',
        get_string('button_url_label', 'local_welcome_modal'),
        get_string('button_url_desc', 'local_welcome_modal'),
        '',
        PARAM_URL
    ));
    
    
    // ---------------------------------------------
    // (2) NEW setting: default tab for course view
    // ---------------------------------------------
    $settings->add(new admin_setting_configselect(
        'local_welcome_modal/default_tab',
        get_string('default_tab_label', 'local_welcome_modal'),
        get_string('default_tab_desc', 'local_welcome_modal'),
        'inprogress', // Default selected option.
        [
            'available'  => 'Available courses',
            'inprogress' => 'In progress courses',
            'completed'  => 'Completed courses'
        ]
        ));

    // Finally add our settings page under "Local plugins".
    $ADMIN->add('localplugins', $settings);
}
 