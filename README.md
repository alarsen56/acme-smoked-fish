# acme-smoked-fish
A repository for Acme projects

## Publish the quiz
- The page is a static site, so it can be published directly from the repository root.
- If you use GitHub Pages, open the repository settings, choose Pages, and publish from the main branch/root directory.
- Once the page is live, share the GitHub Pages URL.

## Connect responses to Google Sheets
1. Create a new Google Apps Script project.
2. Paste the contents of the Apps Script file in this repository into the script editor.
3. Deploy it as a web app with "Anyone" access.
4. Copy the web app URL and replace the placeholder in the quiz page.
5. In Apps Script, add a time-based trigger for the archive job so it runs on a schedule.

## What the integration does
- Each quiz submission is posted to the Apps Script endpoint.
- The script appends the response to a Google Sheet named "Responses".
- A scheduled trigger can archive new rows into a second sheet named "Daily Archive".
