document.addEventListener('DOMContentLoaded', function () {
   if (!window.userData) return;
    const user = window.userData;
    const lang = user.lang;

    // --- Respect session storage settings ---
    if (user.usesession) {
        if (sessionStorage.getItem(user.sessionkey) === '1') {
            return; // Already shown in this session
        }
    }

    if (user.dismissed === 1) return;
    if (user.policyenabled && user.policyagreed !== 1) return;

    // Mark as shown in this session (if enabled)
    if (user.usesession) {
        sessionStorage.setItem(user.sessionkey, '1');
    }
     
  let modalMaxWidth, modalMaxHeight, modalPadding,
     headingFontSize, bodyFontSize, buttonPadding, buttonGap;

    switch (user.modalsize) {
        case 'small':
            modalMaxWidth = '360px';
            modalMaxHeight = '420px';
            modalPadding = '28px 5px';
            headingFontSize = '20px';
            bodyFontSize = '14px';
            buttonPadding = '8px 18px';
            buttonGap = '8px';
            break;
        case 'large':
            modalMaxWidth = '600px';
            modalMaxHeight = '620px';
            modalPadding = '56px 40px';
            headingFontSize = '28px';
            bodyFontSize = '18px';
            buttonPadding = '14px 32px';
            buttonGap = '16px';
            break;
        case 'extralarge':
            modalMaxWidth = '720px';
            modalMaxHeight = '720px';
            modalPadding = '64px 50px';
            headingFontSize = '32px';
            bodyFontSize = '20px';
            buttonPadding = '16px 40px';
            buttonGap = '20px';
            break;
        case 'medium':
        default:
            modalMaxWidth = '480px';
            modalMaxHeight = '520px';
            modalPadding = '40px 20px';
            headingFontSize = '24px';
            bodyFontSize = '16px';
            buttonPadding = '12px 26px';
            buttonGap = '12px';
            break;
    }

    const style = document.createElement('style');
    style.textContent = `
        .welcome-overlay {
            position: fixed !important;
            inset: 0 !important;
            background: rgba(17, 24, 39, 0.65) !important;
            backdrop-filter: blur(10px) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 999999 !important;
            animation: fadeIn 0.3s ease forwards !important;
            padding: 20px !important;
        }

        .welcome-modal {
            background: #ffffff !important;
            color: #111827 !important;
            border-radius: 20px !important;
            box-shadow: 0 12px 45px rgba(0, 0, 0, 0.25) !important;
            padding: ${modalPadding} !important;
            text-align: center !important;
            font-family: "Inter", "Poppins", sans-serif !important;
            max-width: ${modalMaxWidth} !important;
            width: 100% !important;
            max-height: ${modalMaxHeight} !important;
            overflow-y: auto !important;
            position: relative !important;
            transform: scale(0.95);
            opacity: 0;
            animation: popIn 0.35s cubic-bezier(0.25, 1, 0.3, 1) forwards !important;
        }

        /* Headings */
        .welcome-modal h2,
        .welcome-modal h3 {
            font-weight: 700 !important;
            color: #111827 !important;
            line-height: 1.4 !important;
            word-wrap: break-word !important;
            margin-bottom: 16px !important;
        }

        .welcome-modal h2 {
            font-size: ${headingFontSize} !important;
        }

        .welcome-modal h3 {
            font-size: ${bodyFontSize} !important;
            color: #4b5563 !important;  /* Lighter color for subheading */
            margin-bottom: 16px !important;
        }

        /* Paragraph (description) */
        .welcome-modal p {
            font-size: ${bodyFontSize} !important;
            color: #4b5563 !important;
            line-height: 1.6 !important;
            margin-bottom: 24px !important;
            font-weight: 400 !important;   /* Normal weight for readability */
        }

        .welcome-actions {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: ${buttonGap} !important;
            margin-top: 16px !important;
        }

        .welcome-modal .action {
            display: inline-block !important;
            background: linear-gradient(135deg, #7c3aed, #06b6d4) !important;
            border: none !important;
            color: #fff !important;
            padding: ${buttonPadding} !important;
            border-radius: 10px !important;
            cursor: pointer !important;
            font-weight: 500 !important;
            font-size: ${bodyFontSize} !important;
            letter-spacing: 0.5px;
            transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease !important;
        }

        .welcome-modal .action:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 18px rgba(124, 58, 237, 0.3) !important;
            opacity: 0.95 !important;
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
            top: 1px !important;
            right: 8px !important;
            background: none !important;
            border: none !important;
            color: #9ca3af !important;
            font-size: 28px !important;
            cursor: pointer !important;
            transition: color 0.2s ease !important;
        }

        .welcome-close:hover {
            color: #111 !important;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes popIn {
            to { transform: scale(1); opacity: 1; }
        }

        /* Mobile responsiveness */
        @media (max-width: 480px) {
            .welcome-modal {
                padding: 28px 20px !important;
                max-height: 90vh !important;
            }
            .welcome-modal h2 {
                font-size: 20px !important;
            }
            .welcome-modal h3,
            .welcome-modal p {
                font-size: 15px !important;
            }
            .welcome-actions {
                flex-direction: column;
                gap: 10px !important;
            }
            .welcome-modal .action {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);

 
const overlay = document.createElement('div');
overlay.className = 'welcome-overlay';
overlay.innerHTML = `
        <div class="welcome-modal">
            <button class="welcome-close" aria-label="${lang.close_aria_label}">${lang.close_button}</button>
            <h2>${lang.welcome_title.replace('{$a}', `<span style="color:#7c3aed;">${user.fullname}</span>`)}</h2>
            <h3>${lang.welcome_heading}</h3>
            <p>${lang.welcome_subheading}</p>
            <div class="welcome-actions">
                <button class="action" id="continue-btn">${lang.library_button}</button>
                <button class="action dismiss-btn" id="dismiss-btn">${lang.dismiss_button}</button>
            </div>
        </div>
    `;
document.body.appendChild(overlay);

    const closePopup = () => {
        overlay.remove();
         if(user.usesession){
          sessionStorage.setItem(user.sessionkey ,'1');
        }
    };
   
 const handleDismiss = async () => {
        try {
            const response = await fetch(user.dismissphppath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `sesskey=${encodeURIComponent(user.sesskey)}`
            });

            if (response.ok) {
                user.dismissed = 1;
                sessionStorage.setItem(user.sessionkey, '1');
            }
        } catch (e) {
            console.log('Error dismissing modal');
        } finally {
            overlay.remove();
        }
    };

     
    const handleContinue = () => {
        
        if (user.libraryurl) {
            if (user.libraryurl.startsWith('/')) {
                const fullUrl = user.wwwroot + user.libraryurl;
                window.location.href = fullUrl;
            } else {
                window.location.href = user.libraryurl;
            }
        }

         overlay.remove();
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