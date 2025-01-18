import style from "./root.module.css"
import Image from "next/image"
import nebulaLogo from "../public/landingpage/nebulaLogo.png"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import documentEditingImage from "../public/landingpage/documentEditing.png"
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
      {/* <div className={style.sectionGap}></div> */}
      <div className={style.documentEditing}>
        <h1 className={style.sectionHeading}>Forge documents Anywhere, Anytime</h1>
        <p>The Power to Perfect Every Document</p>
        <p>Streamline Your Workflow with Intuitive Editing</p>
        <Image src={documentEditingImage} alt="" />
      </div>
      <div className={style.sectionDiv}>
        <h1 className={style.sectionHeading}>Create Connect Share</h1>
      </div>

    </div>
  )
}