# Site Linh & Huy — prêt pour GitHub Pages

Ce dossier est autonome : il contient tout ce dont le site a besoin.

## Mise en ligne
1. Sur github.com → **New repository** (ex. `linh-huy-wedding`), **Public**.
2. **Add file → Upload files** → sélectionnez **tous les fichiers** de ce dossier (Ctrl+A) et glissez-les. Il n'y a aucun sous-dossier. Commit.
   - Le fichier `.nojekyll` est caché : s'il n'apparaît pas, créez-le sur GitHub via **Add file → Create new file**, nom `.nojekyll`, contenu vide.
3. **Settings → Pages** → Source : *Deploy from a branch* → Branch : `main` / `(root)` → Save.
4. Après 1–2 minutes le site est en ligne : `https://<votre-utilisateur>.github.io/linh-huy-wedding/`

## Modifier
- Textes VI / FR / EN (lien direct en anglais : `?lang=en`) : `strings.js`
- URL Google Sheet : `config.js`

## Photos des invités (page `?page=photos` + QR code)
Les invités scannent le QR code → page « Photos » → leurs photos/vidéos (30 Mo max. par fichier) arrivent dans un dossier Google Drive.
1. Ouvrez le projet Apps Script lié au Google Sheet RSVP et remplacez le code par `apps-script/Code.gs`.
   - Optionnel : mettez l'ID d'un dossier Drive existant dans `PHOTO_FOLDER_ID`. Sinon, un dossier « Linh & Huy — Photos » est créé dans votre Drive au premier envoi.
2. **Déployer → Gérer les déploiements → ✏️ → Version : Nouvelle version → Déployer**, puis acceptez l'accès à Google Drive. L'URL ne change pas, `config.js` reste identique.
   - ⚠️ Tant que ce redéploiement n'est pas fait, les envois de photos créent des lignes vides dans le Sheet RSVP.
3. QR code : `photos-qr.png` (pointe vers `https://geksmode.github.io/Linh-Huy-Wedding/?page=photos`). Cartes de table prêtes à imprimer : `photos-qr-cards.pdf` (4 par A4), ou `qr-photos.html` → Ctrl+P.
