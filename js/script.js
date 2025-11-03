document.addEventListener('DOMContentLoaded', function () {
    if (!window.userData) return;
    const user = window.userData;
    
    // --- Prevent popup from showing again during same session ---
if (sessionStorage.getItem('welcomeModalShown') === '1') {
    return;
}

    // ✅ Only show if policy agreed and not dismissed
    if (user.dismissed === 1) return;
 // If site has a policy, only show popup when agreed.
// If no policy exists, allow popup normally.
if (user.policyenabled && user.policyagreed !== 1) return;


       sessionStorage.setItem('welcomeModalShown', '1');
    // --- Styles ---
    const style = document.createElement('style');
    style.textContent = `
        .welcome-overlay {
            position: fixed !important;
            inset: 0 !important;
            background: rgba(0,0,0,0.6) !important;
            backdrop-filter: blur(6px) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 999999 !important;
            animation: fadeIn 0.25s ease !important;
        }

        .welcome-modal {
            background: #fff !important;
            color: #111 !important;
            border-radius: 16px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
            padding: 32px 36px !important;
            text-align: center !important;
            font-family: "Poppins", sans-serif !important;
            max-width: 420px !important;
            width: 90% !important;
            position: relative !important;
            transform: scale(0.95);
            opacity: 0;
            animation: popIn 0.3s cubic-bezier(0.25, 1, 0.3, 1) forwards !important;
        }

        .welcome-modal h2 {
            margin-bottom: 10px !important;
            font-size: 22px !important;
            color: #111 !important;
        }

        .welcome-modal h3 {
            margin-bottom: 5px !important;
            font-size: 18px !important;
            color: #333 !important;
        }

        .welcome-modal p {
            margin-bottom: 20px !important;
            color: #555 !important;
            line-height: 1.5 !important;
        }

        .welcome-modal .action {
            background: linear-gradient(135deg, #7c3aed, #06b6d4) !important;
            border: none !important;
            color: #fff !important;
            padding: 10px 22px !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            font-weight: 600 !important;
            margin: 5px !important;
        }

        .welcome-modal .dismiss-btn {
            background: #f3f4f6 !important;
            color: #374151 !important;
        }

        .welcome-modal .dismiss-btn:hover {
            background: #e5e7eb !important;
        }

        .welcome-close {
            position: absolute !important;
            top: 10px !important;
            right: 12px !important;
            background: none !important;
            border: none !important;
            color: #888 !important;
            font-size: 24px !important;
            cursor: pointer !important;
        }

        .welcome-close:hover {
            color: #000 !important;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes popIn {
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // --- Structure ---
    const overlay = document.createElement('div');
    overlay.className = 'welcome-overlay';
    overlay.innerHTML = `
        <div class="welcome-modal">
            <button class="welcome-close" aria-label="Close">&times;</button>
            <h2>Hello!, ${user.fullname} 🎉</h2>
            <h3>Welcome to Knowx Box !!!</h3>
            <p>Explore our available courses</p>
            <button class="action" id="continue-btn">Continue Learning</button>
            <button class="action dismiss-btn" id="dismiss-btn">Don't show again</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // --- Close behavior (just remove, no dismiss) ---
    const closePopup = () => {
        overlay.remove();
    };

    // --- Dismiss behavior (AJAX + redirect/update to default dashboard) ---
   // --- Dismiss behavior (AJAX + redirect/update to default dashboard) ---
const handleDismiss = async () => {
    try {
        const response = await fetch(`${window.location.origin}/local/welcome_modal/dismiss.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `userid=${user.id}`
        });

        if (response.ok) {
            // ✅ Immediately mark as dismissed for this session
            user.dismissed = 1;
            sessionStorage.setItem('welcomePopupClosed', '1');

            // ✅ Close popup instantly (no reload delay)
            overlay.remove();

            // ✅ Redirect to dashboard (safe, no /my/my loop)
            const origin = window.location.origin;
            const tabName = user.defaultTab || 'inprogress';
            const dashboardUrl = `${origin}/my/?mycoursestab=${tabName}&page=1&sort=coursefullname&dir=ASC&view=card`;
            const currentPath = window.location.pathname;

            // If already on dashboard, just update params
            if (currentPath === '/my/' || currentPath === '/my') {
                const url = new URL(window.location);
                url.searchParams.set('mycoursestab', tabName);
                url.searchParams.set('page', '1');
                url.searchParams.set('sort', 'coursefullname');
                url.searchParams.set('dir', 'ASC');
                url.searchParams.set('view', 'card');
                history.replaceState(null, '', url.toString());
                // If you want to refresh dashboard widgets uncomment:
                // window.location.reload();
            } else {
                // Full redirect if on another page
                window.location.href = dashboardUrl;
            }
        } else {
            // Fallback if request fails
            sessionStorage.setItem('welcomePopupClosed', '1');
            overlay.remove();
        }
    } catch (e) {
        // Fallback in case of error
        sessionStorage.setItem('welcomePopupClosed', '1');
        overlay.remove();
    }
};

    // --- Continue behavior (redirect/update to admin URL) ---
    const handleContinue = () => {
        closePopup();  // Remove first

        try {
            const buttonUrlObj = new URL(user.buttonUrl);
            const origin = window.location.origin;
            const currentPath = window.location.pathname;

            // If buttonUrl is /my/ variant and we're on /my/, update in-place
            if ((buttonUrlObj.pathname === '/my/' || buttonUrlObj.pathname === '/my') && (currentPath === '/my/' || currentPath === '/my')) {
                const url = new URL(window.location);
                // Append all params from buttonUrl
                buttonUrlObj.searchParams.forEach((value, key) => url.searchParams.set(key, value));
                history.replaceState(null, '', url.toString());
                // Optional: If params change view, uncomment below
                // window.location.reload();
            } else {
                // Different page or not on /my/: Full redirect
                window.location.href = user.buttonUrl;
            }
        } catch (e) {
            // Fallback if malformed URL: Use dashboard
            const tabName = user.defaultTab || 'inprogress';
            const fallbackUrl = `${origin}/my/?mycoursestab=${tabName}&page=1&sort=coursefullname&dir=ASC&view=card`;
            if (window.location.pathname === '/my/' || window.location.pathname === '/my') {
                // In-place if on /my/
                const url = new URL(window.location);
                url.searchParams.set('mycoursestab', tabName);
                url.searchParams.set('page', '1');
                url.searchParams.set('sort', 'coursefullname');
                url.searchParams.set('dir', 'ASC');
                url.searchParams.set('view', 'card');
                history.replaceState(null, '', url.toString());
                // Optional reload
                // window.location.reload();
            } else {
                window.location.href = fallbackUrl;
            }
        }
    };

    // --- Event bindings ---
    overlay.querySelector('.welcome-close').addEventListener('click', closePopup);
    overlay.querySelector('#continue-btn').addEventListener('click', handleContinue);
    overlay.querySelector('#dismiss-btn').addEventListener('click', handleDismiss);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closePopup();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePopup();
    });
});