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
