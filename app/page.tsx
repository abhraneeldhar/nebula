import style from "./root.module.css"
import Image from "next/image"
import nebulaLogo from "../public/landingpage/nebulaLogo.png"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
export default async function Main() {

  return (
    <div className={style.main}>
      <Image className={style.cloudGif} src="/landingpage/cloudgif-1.gif" alt="" width={100} height={100} />
      <div className={style.tab}>
        <Image src={nebulaLogo} alt="N" />
        <div className={style.sectionTags}>
          <a>Edit</a>
          <a>Connect</a>
          <a>Nebula</a>
          <a>Personalize</a>
          <a>About</a>
        </div>
      </div>
      <div className={style.bigAghLogo}>
        <h1>NEBULA</h1>
        <Button className={style.getStarted}>Get Started <ArrowRight className={style.arrowRight} /></Button>
      </div>
      <div className={style.documentEditing}>
        huzz
        
      </div>

    </div>
  )
}