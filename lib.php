<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Redirects  users away from admin pages,
 * and shows a welcome popup only for new users after they agree to policy.
 */
function local_welcome_modal_before_standard_html_head() {
    global $PAGE, $USER, $DB, $CFG, $FULLME;

    $selectedtab = get_config('local_welcome_modal', 'default_tab') ?: 'inprogress';
$customurl   = get_config('local_welcome_modal', 'button_url') ?: '/my/';

    // ✅ 1. Redirect normal users away from restricted pages
    if (isloggedin() && !isguestuser() && !is_siteadmin($USER)) {
        if (
            strpos($FULLME, '/admin/policy.php') !== false ||
            strpos($FULLME, '/login/change_password.php') !== false
        ) {
            redirect($CFG->wwwroot . '/my/');
        }
        
    }

    // ✅ 2. Only logged-in, non-guest users
    if (!isloggedin() || isguestuser()) {
        return;
    }

    // ✅ 3. Skip admins (they can stay anywhere)
    if (is_siteadmin($USER)) {
        return;
    }

    // ✅ 4. Load JS for popup
    $PAGE->requires->js(new moodle_url('/local/welcome_modal/js/script.js'));

    // ✅ 5. Get user info from DB
    $user = $DB->get_record('user', ['id' => $USER->id],
        'id, policyagreed, firstaccess, lastaccess', IGNORE_MISSING);

    if (!$user) {
        return;
    }

    // ✅ 6. Prepare data for JS
    $userdata = [
        'policyagreed' => (int)$user->policyagreed,
        'firstaccess'  => (int)$user->firstaccess,
        'lastaccess'   => (int)$user->lastaccess,
        'fullname'     => fullname($USER),
        'buttonUrl'    => $CFG->wwwroot . $customurl,
         'defaultTab'   => $selectedtab
    ];

    // ✅ 7. Pass to JS
    $PAGE->requires->js_init_code('window.userData = ' . json_encode($userdata) . ';');
}
