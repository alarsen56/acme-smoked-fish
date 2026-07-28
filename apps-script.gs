function doGet() {
  return HtmlService.createHtmlOutput('<p>Hot Smoked quiz endpoint is ready.</p>');
}

function doPost(e) {
  try {
    const payload = typeof e.postData.contents === 'string'
      ? JSON.parse(e.postData.getDataAsString())
      : e.parameter;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Responses');
    if (!sheet) {
      SpreadsheetApp.getActiveSpreadsheet().insertSheet('Responses');
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const normalized = normalizePayload(payload);

    if (headers.length === 0 || headers[0] !== 'Timestamp') {
      sheet.getRange(1, 1, 1, 8).setValues([[
        'Timestamp',
        'Location',
        'Flavor',
        'Teriyaki Score',
        'Mustard Dill Score',
        'Thai Chili Score',
        'Source',
        'Status'
      ]]);
    }

    const row = [
      normalized.timestamp || new Date().toISOString(),
      normalized.location || '',
      normalized.flavor || '',
      normalized.teriyaki_score || 0,
      normalized.mustarddill_score || 0,
      normalized.thaichili_score || 0,
      'Quiz',
      'New'
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, row: row.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function normalizePayload(payload) {
  return {
    timestamp: payload.timestamp || payload.ts || new Date().toISOString(),
    location: payload.location || '',
    flavor: payload.flavor || '',
    teriyaki_score: payload.teriyaki_score || 0,
    mustarddill_score: payload.mustarddill_score || 0,
    thaichili_score: payload.thaichili_score || 0
  };
}

function createArchiveTrigger() {
  ScriptApp.newTrigger('archiveDailyResponses')
    .timeBased()
    .everyDays(1)
    .atHour(2)
    .create();
}

function archiveDailyResponses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const responsesSheet = ss.getSheetByName('Responses');
  const archiveSheet = ss.getSheetByName('Daily Archive') || ss.insertSheet('Daily Archive');

  if (!responsesSheet) {
    return;
  }

  const values = responsesSheet.getDataRange().getValues();
  if (values.length <= 1) {
    return;
  }

  const today = new Date();
  const label = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const rowsToArchive = values.slice(1).filter(row => row[0] && row[0].toString().indexOf(label) !== -1);

  if (rowsToArchive.length === 0) {
    return;
  }

  const archiveRows = rowsToArchive.map(row => row);
  archiveSheet.appendRow([label, archiveRows.length]);
  archiveSheet.getRange(archiveSheet.getLastRow(), 2, archiveRows.length, 1).setValues(archiveRows.map(() => [1]));
}
