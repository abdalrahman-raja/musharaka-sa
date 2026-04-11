# Fix bug

## Workflow Steps

### [x] Step: Investigation and Planning

Analyze the bug report and design a solution.

1. Review the bug description, error messages, and logs
2. Clarify reproduction steps with the user if unclear
3. Check existing tests for clues about expected behavior
4. Locate relevant code sections and identify root cause
5. Propose a fix based on the investigation
6. Consider edge cases and potential side effects

Save findings to `c:\Users\ALBASHA CENTER\Desktop\waill-musharka-sa-ar\.zencoder\chats\a0eb72d2-f745-4078-bc08-cf563798c8b7/investigation.md` with:

- Bug summary
- Root cause analysis
- Affected components
- Proposed solution

**Stop here.** Present the investigation findings to the user and wait for their confirmation before proceeding.

### [x] Step: Implementation

Read `c:\Users\ALBASHA CENTER\Desktop\waill-musharka-sa-ar\.zencoder\chats\a0eb72d2-f745-4078-bc08-cf563798c8b7/investigation.md`
Implement the bug fix.

1. Add/adjust regression test(s) that fail before the fix and pass after
2. Implement the fix
3. Run relevant tests
4. Update `c:\Users\ALBASHA CENTER\Desktop\waill-musharka-sa-ar\.zencoder\chats\a0eb72d2-f745-4078-bc08-cf563798c8b7/investigation.md` with implementation notes and test results

### [x] Step: Supabase Migration

Migrate the project's data storage from SQLite to Supabase to ensure data persistence on Vercel.

1. Create Supabase SQL schema for `admins`, `account_requests`, `contact_messages`, `activity_log`, and `site_settings`.
2. Update `backend/database.js` to use `@supabase/supabase-js` instead of `sqlite3`.
3. Update `backend/package.json` to include Supabase dependencies.
4. Ensure `open-account/server.py` correctly handles its own logic or interacts with the new database if needed (primarily uses Telegram).
5. Add configuration instructions for Supabase API URL and Key.

### [x] Step: Dynamic Admin Dashboard & Site Control

Enhanced the admin dashboard to provide full control over the site settings and SEO.

1.  Implemented `api/site-settings.js` to manage website configuration (SEO, Contact, Telegram) in Supabase.
2.  Updated `admin/index.html` with UI sections for managing administrators and site settings.
3.  Created `assets/js/site-manager.js` to dynamically update the frontend (titles, meta tags, phone numbers) based on database settings.
4.  Integrated `site-manager.js` into main entry files (`index.htm`, `en/index.htm`).
5.  Added IP logging and activity tracking for administrative actions.

### [x] Step: Telegram Bot Interactive PDF Generation

Implement interactive Telegram bot responses to generate PDF contracts from form submissions.

1. Update the form submission handler to include "inline keyboard" buttons in the Telegram notification.
2. Add a "Generate PDF" button to the Telegram message.
3. Implement a webhook or callback handler to receive and process the user's response.
4. Integrate a PDF generation library (e.g., `pdf-lib`) to fill data into a pre-defined PDF template.
5. Map specific form fields to their corresponding locations in the PDF template.
6. Send the generated PDF file back to the user via the Telegram bot.

### [x] Step: Arabic Support in PDF Generation

Optimize the Telegram Bot PDF Generation for full Arabic support.

1. Embed the Tajawal font (or a suitable Arabic .ttf font) into the PDF generation process.
2. Ensure the PDF layout correctly renders Arabic text (Right-to-Left).
3. Update the PDF contract with a professional layout for both individual and corporate requests.
4. Integrate `arabic-reshaper` and `fontkit` for correct character connections and font handling.
