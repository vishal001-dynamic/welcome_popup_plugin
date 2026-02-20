# Welcome Modal

A Moodle local plugin that displays a friendly, customizable welcome modal to users after they log in, encouraging them to explore the platform and access the library. The modal can be dismissed temporarily (for the session) or permanently, and respects site policy agreements.

## Features

- **Personalised welcome** – Greets the user by name.
- **Fully configurable** – Choose modal size (small, medium, large, extra large) and the destination URL for the "Go to Library" button.
- **Session‑based suppression** – Optionally prevent the modal from reappearing during the same browser session when closed with the X button.
- **Permanent dismissal** – Users can click "Don't show again" to never see the modal again (record stored in the database).
- **Privacy‑aware** – Implements Moodle's Privacy API to handle user data correctly.
- **Policy integration** – If a site policy is enabled, the modal will only appear after the user has agreed to it.
- **Responsive design** – Looks great on all devices.

## Requirements

- Moodle 4.1 or later
- PHP 7.4 or later

## Installation

1. **Unzip** the plugin folder and place it into `/local/` directory of your Moodle installation.  
   The folder must be named `welcome_modal` (i.e. `/local/welcome_modal/`).

2. **Log in** to your Moodle site as an administrator and go to *Site administration → Notifications*.

3. Follow the on‑screen instructions to complete the installation. The plugin will create its own database table automatically.

## Configuration

After installation, you can customise the plugin under *Site administration → Plugins → Local plugins → Welcome Modal*.

| Setting | Description |
|---------|-------------|
| **Go to Library URL** | The URL where the "Go to Library" button will take users. Can be an absolute URL (e.g. `https://example.com/library`) or a relative Moodle path (e.g. `/course/index.php`). |
| **Modal Size** | Choose the visual size of the modal: Small, Medium (default), Large, or Extra Large. |
| **Enable session suppression** | If enabled, clicking the **X** (close) button will prevent the modal from reappearing during the same browser session. If disabled, the modal will reappear on every page load until the user clicks "Don't show again". |
| **Session storage key** | The key used in the browser's `sessionStorage` to track whether the modal has been shown in the current session. Only alphanumeric characters allowed. The default is `welcomeModalShown`. |

Save the settings and the plugin is ready to use.

## Usage

- After a user logs in and visits their dashboard, the welcome modal will appear automatically (provided they have not permanently dismissed it).
- The modal displays a personalised welcome message, a friendly heading, and a short description.
- **Go to Library** – takes the user to the configured URL.
- **Don't show again** – permanently dismisses the modal (stores a record in the database). The user will never see it again, even after logging out and back in.
- **Close (X)** – closes the modal for the current page view. If session suppression is enabled, the modal will also be hidden for the remainder of the browser session.

## Privacy

This plugin stores the user ID and a timestamp when a user chooses to permanently dismiss the modal. All stored data is handled in accordance with Moodle's Privacy API, allowing users to request export or deletion of their data.

## Troubleshooting

- **The modal does not appear at all**  
  - Ensure you are logged in as a non‑admin, non‑guest user.  
  - Check that you are on the dashboard. The modal only loads there.  
  - If a site policy is enabled, make sure the user has agreed to it.  
  - Verify that the database table `local_welcome_modal_dismissed` exists (it is created during installation).

- **The modal reappears after clicking X, even though session suppression is enabled**  
  - Go to the plugin settings and confirm that **"Enable session suppression"** is checked.  
  - Clear your browser cache and Moodle cache (*Site administration → Development → Purge all caches*).

- **The "Go to Library" button does not work**  
  - Verify that the configured URL is correct. If using a relative path, it must start with a slash (e.g. `/course/index.php`).

## Support

If you encounter any issues or have questions, please contact:

**Dynamic Pixel Multimedia Solutions**  
Website: [https://dynamicpixel.co.in](https://dynamicpixel.co.in)  
Email: support@dynamicpixel.co.in

## License

This plugin is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

It is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Moodle. If not, see <http://www.gnu.org/licenses/>.

---

**Enjoy welcoming your users!**
