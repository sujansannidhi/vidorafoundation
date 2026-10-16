# Open Paths backend (Phase 1)

Google Forms, Sheets and Apps Script that run Open Paths behind the website.
Everything here runs in the **sujan@vidorafoundation.org** Google Workspace
account. Nothing in this folder is deployed by the website build.

`src/content/volunteer.ts` is the source of truth for event IDs, credits, caps,
statuses, ID formats and the verify contract. `EventsData.gs` is generated
from it; never edit that file by hand.

## What each file does

| File | Does |
|---|---|
| `EventsData.gs` | Generated: every event, credit, cap, status and ID format |
| `Store.gs` | Tab definitions (exact column names), Script Properties, the Config tab |
| `Ids.gs` | IDs in the site's formats, issued under a lock so they never collide |
| `Rules.gs` | Hour credits, caps, auto-flags and the verify response (no Google services) |
| `Setup.gs` | `setupOpenPaths()`, the forms, the letter template, `installTriggers()` |
| `Handlers.gs` | What happens on each form submission, reviewer edits, partner reminders |
| `WebApp.gs` | Parent consent links and the `/verify` endpoint |
| `Letters.gs` | `issueLetters()`: PDFs, emails and certificate records |
| `Digest.gs` | Weekly signatory digest and monthly team summary |
| `Tests.gs` | `selfTest()` |
| `test/local.test.mjs` | Runs the same pure tests in Node: `npm run test:open-paths` |

## Setup, step by step

You do not need to be a developer. Allow about 30 minutes.

1. **Create the project.** Sign in to Google as sujan@vidorafoundation.org, go
   to [script.google.com](https://script.google.com) and click **New project**.
   Name it `Open Paths`.
2. **Add the code.** Either:
   - **Paste:** for each `.gs` file in this folder, click **+ > Script**, give
     it the same name (without `.gs`) and paste the contents. Then open
     **Project Settings**, tick **Show "appsscript.json"**, and replace that
     file's contents with `appsscript.json` from this folder. Or
   - **clasp:** `npm i -g @google/clasp`, `clasp login`, `clasp create --type
     standalone --title "Open Paths" --rootDir ops/open-paths`, then
     `clasp push`. (Do not push the `test` folder; it is for Node only.)
3. **Run setup.** In the editor, choose `setupOpenPaths` from the function
   list and click **Run**. Google asks you to authorize the project: review
   the permissions and allow them. Setup creates the spreadsheet, the
   restricted folder, the letter template and Forms F1 to F5, and installs
   every trigger. Open **Executions** to read the log.
4. **Deploy the web app.** Click **Deploy > New deployment > Web app**.
   Set **Execute as: Me** and **Who has access: Anyone**. Copy the URL.
5. **Store the URL.** Run `setWebAppUrl` once. (It reads the deployed URL; if
   it logs the wrong one, edit the call to `setWebAppUrl('<the URL>')` and run
   it again.)
6. **Fill in the Config tab** in the new spreadsheet: `signatory_name`,
   `signatory_title`, `signatory_email` and `signatory_phone` for the adult who
   signs letters (never a parent of a volunteer they sign for). Email wording
   lives in the same tab and can be edited there.
7. **Add the first Drop** to the `Drops` tab, for example
   `DROP-2611 | 2026-11 | 2026-11-16 | 2026-11-30 | 75 | 0`.
8. **Run `selfTest`.** The log should end with `All tests passed`. It uses a
   throwaway copy of the spreadsheet and deletes it afterwards.
9. **Run `logFormLinks`** and copy the values into the site (next section).

Triggers installed by setup (rerun `installTriggers` if you ever need to reset
them): one per form submission, the spreadsheet's Open Paths menu and edit
handler, partner reminders daily at 8, letters every Monday at 7, the
signatory digest every Friday at 7, and the team summary on the 1st.

## Paste these into `src/content/volunteer.ts`

`logFormLinks()` prints every value. In `src/content/volunteer.ts`:

| Log line | Goes in |
|---|---|
| `forms.register` | `forms.register` (F1) |
| `forms.signup` | `forms.signup` (F2) |
| `forms.signupEventField` | `forms.signupEventField` (F2's `entry.NNNN` key) |
| `forms.partnerConfirm` | `forms.partnerConfirm` (F3) |
| `forms.submit` | `forms.submit` (F4) |
| `forms.partnerComplete` | `forms.partnerComplete` (F5) |
| `verifyEndpoint` | `verifyEndpoint` (the web app URL) |

Also set `signatory`, and `openPaths.currentDrop` once the first Drop is
confirmed. Each value replaces a "Coming soon" note on the site. Strip any
`usp` or `ouid` parameter from a form URL (`logFormLinks` already does).

## Running Open Paths week to week

- **Reviewers** work in the `Submissions` tab. Set `status` to `IN_REVIEW`,
  then `APPROVED`, `NEEDS_INFO` (fill `reason_code` first) or `REJECTED`.
  Each change emails the volunteer; approvals and rejections copy the parent.
  Use the **Reviewer view** tab for volunteer details: it leaves out parent
  names and emails.
- **The signatory** gets a Friday email listing approved rows. Signing a row
  means filling `adult_signed_by` and `signed_at`; it then moves to `SIGNED`.
- **Letters** go out every Monday for signed rows, 25 at a time, or now from
  the spreadsheet's **Open Paths > Issue letters now** menu.
- **Revoking** a certificate: run `revokeCertificate('OP-...')`. The verify
  page shows it as revoked at once.
- **Sign-ups** close automatically when a Drop is full. Use **Open Paths >
  Open or close the sign-up form** after changing the `Drops` tab.

## After any event change

1. Edit the event in `src/content/volunteer.ts`.
2. Run `npm run export:events` to regenerate `EventsData.gs`.
3. Run `npm run test:open-paths` and `npm run rules`.
4. Paste or `clasp push` the new `EventsData.gs`, and update the `Events` tab
   if an event was added.

## Privacy

Forms ask for organisation addresses only, never a volunteer's home address,
date of birth or phone number. Evidence and letters are kept in the restricted
folder. Nothing personal is written to logs. Reviewers use the reviewer view,
without parent contact details.
