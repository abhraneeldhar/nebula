"use server"
import style from "./root.module.css"
import Image from "next/image"
import nebulaLogo from "../public/landingpage/nebulaLogo.png"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

import documentEditingImage from "../public/landingpage/documentEditing.png"
import shareBox from "../public/landingpage/shareBox.png"
import friendsTab from "../public/landingpage/friendsTab.png"


export default async function Main() {

  return (
    <div className={style.main}>
      <div className={style.heroDiv}>

        <Image className={style.cloudGif} src="/landingpage/cloudgif-1.gif" alt="" width={100} height={100} />
        <div className={style.tab}>
          <Image src={nebulaLogo} alt="N" />
          <div className={style.authBtn}>
            <button className={style.loginBtn}>Login</button>
            <button className={style.signUpBtn}>SignUp</button>
          </div>
        </div>
        <div className={style.bigAghLogo}>
          <h1>N{" "}E{" "}B{" "}U{" "}L{" "}A</h1>
          <Button className={style.getStarted}>Get Started <ArrowRight className={style.arrowRight} /></Button>
        </div>

      </div>

      <div className={style.documentEditing}>
        <h1 className={style.sectionHeading}>Forge documents Anywhere, Anytime</h1>
        <p>The Power to Perfect Every Document</p>
        <p>Streamline Your Workflow with Intuitive Editing</p>
        <Image src={documentEditingImage} alt="" />
      </div>
      <div className={style.shareDiv}>
        <h1 className={style.sectionHeading}>Create Connect Share</h1>
        <div className={style.para}>
          <p>Stronger Together!</p>
          <p>One Click to Share, Infinite Possibilities</p>
        </div>
        <div className={style.picsHolder}>
          <Image className={style.friendsTabImg} src={friendsTab} alt="" />
          <Image className={style.shareBoxImg} src={shareBox} alt="" />
        </div>
      </div>

    </div>
  )
}