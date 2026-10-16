// Google Apps Script — receives RSVPs from the wedding website and appends them to this sheet,
// and saves guests' photos (type: 'photo') into a Google Drive folder.
// transport: 'self' (own way) | 'bus' (with the coach) — busTrip: 'outbound' | 'return' | 'both'
const SHEET_NAME = 'RSVP';
// Drive folder ID for guest photos (the part after /folders/ in the folder URL).
// Leave empty: a folder "Linh & Huy — Photos" is created in the owner's Drive on the first upload.
const PHOTO_FOLDER_ID = '';
// Photos page history: built from the Drive folder itself (deleting a photo in Drive removes it from the album),
// RECENT_GROUPS groups, cached RECENT_CACHE_S seconds.
const RECENT_GROUPS = 6;
const RECENT_CACHE_S = 30;
// Files added by hand (no batch in their description) are grouped when added less than this apart.
const LOOSE_GAP_MS = 10 * 60 * 1000;

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
    // The description keeps who sent it and the upload group, read back by doGet.
    const batch = String(data.batch || file.getId()).replace(/[^\w-]/g, '').slice(0, 40);
    file.setDescription((data.guest ? 'Envoyé par ' + data.guest + ' · envoi ' : 'Envoi ') + batch);
    // Viewable by link so the photos page can show thumbnails; an upload still succeeds if the domain forbids it.
    shareByLink(file);
    CacheService.getScriptCache().remove('recent');
    return json({ ok: true, id: file.getId() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function shareByLink(file) {
  try {
    if (file.getSharingAccess() !== DriveApp.Access.ANYONE_WITH_LINK) file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {}
}

// GET ?action=recent → latest upload groups (one group = one selection by a guest), newest first.
function doGet(e) {
  if (!e || !e.parameter || e.parameter.action !== 'recent') return json({ ok: true });
  const cache = CacheService.getScriptCache();
  const hit = cache.get('recent');
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);
  const out = JSON.stringify({ ok: true, groups: recentGroups() });
  try { cache.put('recent', out, RECENT_CACHE_S); } catch (err) {}
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

// "Envoyé par Mai · envoi k3f9" | "Envoi k3f9" | "Envoyé par Mai" (older uploads) | anything else (added by hand).
function parseDescription(d) {
  let m = d.match(/^Envoyé par (.*) · envoi ([\w-]+)$/);
  if (m) return { guest: m[1], batch: m[2] };
  m = d.match(/^Envoi ([\w-]+)$/);
  if (m) return { guest: '', batch: m[1] };
  m = d.match(/^Envoyé par (.*)$/);
  return { guest: m ? m[1] : '', batch: '' };
}

function recentGroups() {
  const files = [];
  const it = photoFolder().searchFiles('trashed = false');
  while (it.hasNext()) {
    const f = it.next();
    const mime = f.getMimeType();
    if (!/^(image|video)\//.test(mime)) continue;
    const d = parseDescription(f.getDescription() || '');
    files.push({ file: f, id: f.getId(), t: f.getDateCreated().getTime(), v: /^video\//.test(mime) ? 1 : 0, guest: d.guest, batch: d.batch });
  }
  files.sort((a, b) => b.t - a.t);
  const groups = [], byKey = {}, loose = {};
  files.forEach(f => {
    let key = f.batch && 'b:' + f.batch;
    if (!key) {
      // Newest first: join the group of the same sender if the previous file is close enough in time.
      const last = loose[f.guest];
      key = last && last.t - f.t < LOOSE_GAP_MS ? last.key : 'l:' + f.id;
      loose[f.guest] = { key, t: f.t };
    }
    let g = byKey[key];
    if (!g) {
      if (groups.length >= RECENT_GROUPS) return;
      g = byKey[key] = { guest: f.guest, t: f.t, files: [] };
      groups.push(g);
    }
    g.files.push({ id: f.id, v: f.v });
    shareByLink(f.file);
  });
  groups.forEach(g => g.files.reverse());
  return groups;
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
