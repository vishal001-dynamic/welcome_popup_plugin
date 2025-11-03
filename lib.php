<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Handles showing the welcome popup after login until dismissed.
 */
function local_welcome_modal_before_standard_html_head() {
    global $PAGE, $USER, $DB, $CFG, $FULLME;

    // 1️⃣ Show only for logged-in, non-admin, non-guest users
    if (!isloggedin() || isguestuser() || is_siteadmin($USER)) {
        return;
    }

    // 2️⃣ Load only on dashboard (/my/) – prevent redirect loops
    $path = parse_url($FULLME, PHP_URL_PATH);
    if (strpos($path, '/my/') === false && $path !== '/my') {
        return;
    }

    // 3️⃣ Get admin-configured Continue Learning URL
    $customurl = get_config('local_welcome_modal', 'button_url') ?:
        $CFG->wwwroot . '/my/courses.php?mycoursestab=inprogress&page=1&sort=coursefullname&dir=ASC&view=card';

    // 4️⃣ Get user info (check if policy column exists)
    $user = $DB->get_record('user', ['id' => $USER->id], 'id, policyagreed', IGNORE_MISSING);
    if (!$user) {
        return;
    }

    // 5️⃣ Detect if site policy is enabled
    $policyenabled = !empty($CFG->sitepolicy) || !empty($CFG->sitepolicyhandler);

    // 6️⃣ If policy required but not agreed → skip popup
    if ($policyenabled && empty($user->policyagreed)) {
        return;
    }

    // 7️⃣ Check if popup was dismissed before
    $tableexists = $DB->get_manager()->table_exists('local_welcome_modal_dismissed');
    $dismissed = 0;
    if ($tableexists) {
        $dismissed = $DB->record_exists('local_welcome_modal_dismissed', ['userid' => $USER->id]) ? 1 : 0;
    }

    // 8️⃣ Pass user data to JavaScript
    $userdata = [
        'id'            => $USER->id,
        'fullname'      => fullname($USER),
        'dismissed'     => $dismissed,
        'buttonUrl'     => $customurl,
        'policyenabled' => $policyenabled ? 1 : 0,
        'policyagreed'  => (int)$user->policyagreed,
    ];

    // 9️⃣ Load JS (popup) and initialize data
    $PAGE->requires->js(new moodle_url('/local/welcome_modal/js/script.js'));
    $PAGE->requires->js_init_code('window.userData = ' . json_encode($userdata) . ';');
}
