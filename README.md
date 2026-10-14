# acme-smoked-fish
A repository for Acme projects

## Publish the quiz
- The page is a static site, so it can be published directly from the repository root.
- If you use GitHub Pages, open the repository settings, choose Pages, and publish from the main branch/root directory.
- Once the page is live, share the GitHub Pages URL.

## Connect responses without Google Sheets
If you do not want to use Google Sheets, you can send responses to any HTTP endpoint that accepts a POST request.

A simple option is Formspree:
1. Create a free Formspree form.
2. Copy the form endpoint URL, such as https://formspree.io/f/your-form-id.
3. Open the quiz with your actual endpoint, for example `?webhook=https://formspree.io/f/your-form-id` (replace `your-form-id`).
4. The quiz sends an AJAX JSON request to Formspree. Check the form's Submissions page and confirm the form's email address if Formspree requests it.

If you prefer to keep the Google Apps Script option, you can still use the script in this repository.

## What the integration does
- Each quiz submission is posted to a configurable submission endpoint.
- If no endpoint is configured, or a submission fails, the browser attempts to queue the response locally. This queue is only on that browser and is not automatically sent to the endpoint later.
- The payload includes the location, selected flavor, and score breakdown for each quiz response.
