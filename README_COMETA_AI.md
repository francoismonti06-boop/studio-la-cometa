# COMETA AI tools

Copier le dossier `tools` dans `G:\LA COMETA\studio-la-cometa`.

Test :

```powershell
node tools\cometa-ai.js help
```

Dry-run :

```powershell
node tools\cometa-ai.js translate --types contactPage --limit 1
```

Write :

```powershell
node tools\cometa-ai.js translate --types contactPage --limit 1 --write
```

Si Node signale une erreur ES modules, ajouter `"type": "module"` au `package.json`.
