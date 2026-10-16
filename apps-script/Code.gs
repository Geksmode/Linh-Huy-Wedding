// Google Apps Script — receives RSVPs from the wedding website and appends them to this sheet,
// and saves guests' photos (type: 'photo') into a Google Drive folder.
// transport: 'self' (own way) | 'bus' (with the coach) — busTrip: 'outbound' | 'return' | 'both'
const SHEET_NAME = 'RSVP';
// Drive folder ID for guest photos (the part after /folders/ in the folder URL).
// Leave empty: a folder "Linh & Huy — Photos" is created in the owner's Drive on the first upload.
const PHOTO_FOLDER_ID = '';

// Run this once from the editor (▷ Exécuter) to grant Drive access and create the photo folder.
function autoriser() {
  Logger.log('Dossier photos : ' + photoFolder().getUrl());
}

const HEADERS = ['timestamp','name','email','phone','attending','partySize','events','transport','busTrip','note','lang'];

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.type === 'photo') return savePhoto(data);
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

function savePhoto(data) {
  try {
    const name = (data.guest ? data.guest.replace(/[\\/:*?"<>|]/g, '').slice(0, 40) + ' - ' : '') + data.name;
    const blob = Utilities.newBlob(Utilities.base64Decode(data.data), data.mime || 'application/octet-stream', name);
    const file = photoFolder().createFile(blob);
    if (data.guest) file.setDescription('Envoyé par ' + data.guest);
    return json({ ok: true, id: file.getId() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function photoFolder() {
  if (PHOTO_FOLDER_ID) return DriveApp.getFolderById(PHOTO_FOLDER_ID);
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('photoFolderId');
  if (id) return DriveApp.getFolderById(id);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const again = props.getProperty('photoFolderId');
    if (again) return DriveApp.getFolderById(again);
    const folder = DriveApp.createFolder('Linh & Huy — Photos');
    props.setProperty('photoFolderId', folder.getId());
    return folder;
  } finally {
    lock.releaseLock();
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
