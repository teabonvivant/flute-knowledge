import Link from "next/link"
import { ThemeControl } from "./theme-control"
export function SiteFooter() {
 return <footer className="site-footer"><div className="content-wrap">
  <div className="footer-main"><div><strong className="footer-wordmark">長笛知識館</strong><p className="footer-english">Flute Atlas</p><p>寫給正在學、正在教，也喜歡聽長笛的人。<br/>從一個聲音問題出發，走向人物、作品與文獻。</p></div>
  <nav className="footer-nav" aria-label="頁尾連結">{[["長笛誌・100 篇閱讀","/blog"],["30 個知識主題","/topics"],["100 位長笛人物","/masters"],["研究資料與下載","/research"],["長笛詞彙","/glossary"],["關於知識館","/about"],["網站導覽","/sitemap"],["全站搜尋","/search"]].map(([label,href])=><Link key={href} href={href!}>{label}</Link>)}</nav></div>
  <div className="footer-bottom"><p>長笛知識館 · 香港繁體中文</p><ThemeControl/></div>
 </div></footer>
}

