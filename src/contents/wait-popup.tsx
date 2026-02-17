import type { PlasmoCSConfig } from "plasmo"
import cssText from "data-text:@/src/globals.css"
import WaitPopup from "@/components/WaitPopup"

export const config: PlasmoCSConfig = {
  matches: ["https://x.com/*", "https://www.instagram.com/*", "https://www.tiktok.com/*"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const WaitPopUp = () => {
  return (
    <WaitPopup />        
  )
}

export default WaitPopUp
