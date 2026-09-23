# 長笛知識館 · Flute Atlas

以繁體中文整理長笛學習、聆聽、人物及文化的公開知識網站。

**網站：[https://teabonvivant.github.io/flute-knowledge/](https://teabonvivant.github.io/flute-knowledge/)**

收錄 100 篇長笛誌、100 位人物、30 個知識主題，以及研究資料與下載檔案。
網站採用紙色、明體與留白的閱讀設計，提供文章分類、全站搜尋、人物及主題篩選、手機選單和明暗閱讀模式。

## 發佈方式

GitHub Pages 從 `main` 分支根目錄直接發佈；`.nojekyll` 保留靜態資源路徑。
根目錄為可直接瀏覽的 HTML、CSS、圖片、字型與 JavaScript；`source/` 保留可重建的原始應用程式。
搜尋及篩選在瀏覽器內完成，毋須登入或另設伺服器。

## 重建

需要 Node.js 22.13 或以上，以及 Python 3.10 或以上。

```sh
cd source
npm ci
python -m pip install -r requirements-pages.txt
npm run build
npm run preview:built
```

保留預覽伺服器，在另一個終端執行：

```sh
cd source
python scripts/export-github-pages.py --output ../../pages-export
```

匯出目錄必須為空。檢查匯出結果後，以其內容更新儲存庫根目錄並提交，保留 `.git`。
可用 `--base` 與 `--origin` 指定其他 GitHub Pages 專案路徑；匯出器會同步更新頁面、圖片、字型、樣式、搜尋連結與網站地圖。

## 版本與資料

改版前的網站保留在 Git 歷史，以及 `archive/before-flute-atlas-20260923` 分支。
原有文章、研究資料、圖像和下載內容保留於此版本；圖像來源紀錄隨原始檔案保存。
各項研究連結及資料來源可在網站相應頁面查閱。
