document.addEventListener('DOMContentLoaded', function () {
    if (!window.userData) {
        return;
    }
    const user = window.userData;

    // ✅ Only show for new users who agreed to policy
    if (localStorage.getItem('welcomePopupDismissed') === 'true') {
        return;
    }
   
    if (user.policyagreed !== 1) {
        return;
    }
    if (!(user.firstaccess === 0 || user.firstaccess === user.lastaccess)) {
        return;}

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
        <h1>Welcome to Knowx Box !!! </h1>
        <button class="action" id="continue-btn">Continue</button>
    </div>
`;
document.body.appendChild(overlay);

// --- Close behavior ---
const dismissPopup = () => {
    overlay.remove();
    localStorage.setItem('welcomePopupDismissed', 'true'); // never show again
};

// --- Continue behavior (change tab or redirect) ---
// --- Continue behavior (change tab or redirect) ---
const handleContinue = () => {
    dismissPopup(); // always remove popup first

    const tabName = user.defaultTab || 'inprogress';
    const origin = window.location.origin;
    const path = window.location.pathname;

    // Normalize: treat "/my", "/my/", "/my/index.php" as the same
    const isDashboard = /^\/my(\/|\/index\.php)?$/.test(path);

    if (isDashboard) {
        // ✅ Already on dashboard → switch tab
        const tabButton = document.querySelector(`a[href*="mycoursestab=${tabName}"]`);
        if (tabButton) {
            tabButton.click();
        } else {
            // fallback: open dashboard tab directly
            window.location.href = `${origin}/my/?mycoursestab=${tabName}`;
        }
    } else {
        // 🚀 Not on dashboard
        try {
            const buttonUrl = new URL(user.buttonUrl);
            const restrictedPaths = ['/admin/policy.php', '/login/change_password.php'];
            if (restrictedPaths.includes(buttonUrl.pathname)) {
                // fallback to dashboard safely
                window.location.href = `${origin}/my/?mycoursestab=${tabName}`;
            } else {
                window.location.href = user.buttonUrl;
            }
        } catch (e) {
            // Fallback if malformed URL
            window.location.href = `${origin}/my/?mycoursestab=${tabName}`;
        }
    }
};


// --- Event bindings ---
overlay.querySelector('.welcome-close').addEventListener('click', dismissPopup);
overlay.querySelector('#continue-btn').addEventListener('click', handleContinue);
overlay.addEventListener('click', e => {
    if (e.target === overlay) dismissPopup();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') dismissPopup();
});

});
