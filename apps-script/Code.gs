// Google Apps Script — receives RSVPs from the wedding website and appends them to this sheet.
// transport: 'self' (own way) | 'bus' (with the coach) — busTrip: 'outbound' | 'return' | 'both'
const SHEET_NAME = 'RSVP';
const HEADERS = ['timestamp','name','email','phone','attending','partySize','events','transport','busTrip','note','lang'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
    // Existing sheet: add any missing column at the end so old rows keep their layout.
    const lastCol = Math.max(sh.getLastColumn(), 1);
    const current = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
    HEADERS.filter(h => !current.includes(h)).forEach(h => {
      current.push(h);
      sh.getRange(1, current.length).setValue(h);
    });
    const data = JSON.parse(e.postData.contents);
    // Phone stored as text so leading 0 / + are kept.
    if (data.phone) data.phone = "'" + data.phone;
    sh.appendRow(current.map(h => data[h] ?? ''));
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
