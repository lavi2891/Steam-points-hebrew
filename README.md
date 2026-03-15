# מה הנק״ק שלך?

אפליקציית React + TypeScript קטנה בעברית ו-RTL לחישוב "נקודות קיטור".

## פיתוח מקומי

```bash
npm install
npm run dev
```

## בנייה

```bash
npm run build
```

## GitHub Pages

הפרויקט כולל workflow אוטומטי ב-[.github/workflows/deploy.yml](./.github/workflows/deploy.yml).

כדי להפעיל:

1. דוחפים את הקוד ל-branch `main`.
2. ב-GitHub נכנסים ל-`Settings -> Pages`.
3. בוחרים `Build and deployment -> Source: GitHub Actions`.
4. כל push ל-`main` יבנה ויפרסם את `dist` ל-GitHub Pages.

ה-`base` של Vite מזוהה אוטומטית בזמן GitHub Actions לפי שם ה-repository, כך שאין צורך לשנות נתיב ידנית לכל deploy.
