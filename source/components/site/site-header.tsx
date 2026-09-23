"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
const nav = [
  ["開始學", "/learn"], ["練習", "/practice"], ["聆聽", "/listen"], ["名家", "/masters"],
  ["選笛", "/instrument"], ["文化", "/culture"], ["知識主題", "/topics"], ["長笛誌", "/blog"], ["研究", "/research"]
] as const
function current(pathname: string, href: string) { return pathname === href || pathname.startsWith(href + "/") }
export function SiteHeader() {
  const pathname = usePathname() || "/"
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus() } }
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener("keydown", close)
    document.addEventListener("pointerdown", outside)
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside) }
  }, [open])
  return <header ref={header} className="site-header">
    <div className="content-wrap header-inner">
      <Link href="/" className="site-brand" aria-label="Flute Atlas 首頁">
        <span><strong>長笛知識館</strong><small>Flute Atlas</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="主要導覽">{nav.map(([label,href])=><Link key={href} href={href} aria-current={current(pathname,href)?"page":undefined}>{label}</Link>)}</nav>
      <div className="header-actions">
        <Link href="/search" className="header-search" aria-label="搜尋全站">搜尋</Link>
        <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="flute-mobile-nav" onClick={()=>setOpen(!open)}>{open?"關閉":"選單"}</button>
      </div>
    </div>
    {open&&<nav id="flute-mobile-nav" className="mobile-nav" aria-label="行動版主要導覽">{nav.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={current(pathname,href)?"page":undefined}>{label}</Link>)}<Link href="/search" onClick={()=>setOpen(false)}>搜尋全站</Link></nav>}
  </header>
}

