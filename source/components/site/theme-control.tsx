"use client"
import { useEffect, useState } from "react"
type Theme = "system" | "light" | "dark"
export function ThemeControl() {
  const [theme,setTheme]=useState<Theme>("system")
  useEffect(()=>{try { const saved=localStorage.getItem("flute-atlas-theme"); if(saved==="light"||saved==="dark")setTheme(saved) } catch {}},[])
  function change(value:Theme){setTheme(value); if(value==="system")delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=value;try{localStorage.setItem("flute-atlas-theme",value)}catch{}}
  return <label className="theme-control">閱讀顯示<select aria-label="閱讀顯示模式" value={theme} onChange={event=>change(event.target.value as Theme)}><option value="system">跟隨系統</option><option value="light">淺色</option><option value="dark">深色</option></select></label>
}

