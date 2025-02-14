"use server"
import style from "./root.module.css"
import Image from "next/image"
import nebulaLogo from "../public/landingpage/nebulaLogo.png"
import vortexLogo from "../public/landingpage/vortex logo.jpeg"
import { ArrowRight, Github, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

import documentEditingImage from "../public/landingpage/documentEditing.png"
import lappypython from "../public/landingpage/lappypython.png"
import friendsImage from "../public/landingpage/friendsImage.jpg"
import profileImage from "../public/landingpage/profilePic.jpg"
import TweetCard, { tweetType } from "@/components/ui/tweetCard"
import SignupBtn, { GetStarted, LilNebulaLogo, LoginBtn, NexusBtn } from "@/components/ui/authButtons"
import { useSession } from "next-auth/react"
import LoadingPage from "./_components/loadingPage/page"

export default async function Main() {

  const tweets: tweetType[] = [
    {
      name: "Shreya Sinha",
      username: "SSinha3105",
      tweetContent: "Nebula makes editing documents and chatting easy without any sign-in hassle. I love how fast and seamless it feels on my desktop!",
      link: "https://x.com/ssinha3105/status/1889662106078728458?s=12"
    },
    {
      name: "Satyam",
      username: "satyamrudranand",
      tweetContent: "Learn, share, and connect! Nebula is the perfect platform to store your notes, collaborate with peers, and make new friends #CloudNotes https://nebula-trexcorp.vercel.app/home ",
      link: "https://x.com/satyamrudranand/status/1889523186351398999?t=LISSsAOw3i0BqzwPStN5gw&s=08"
    },
    {
      name: "aditiaaniya",
      username: "aditiaaniya",
      tweetContent: "Imagine editing a document while seamlessly chatting from the desktop to the phone- no extra apps needed! My friend @abhraneeldhar just built Nebula, an online document editor with a built-in chatroom, making teamwork smoother than ever. Game-changer? Absolutely!",
      link: "https://x.com/aditiaaniya/status/1889521223102812186?t=xpOyC3lMnguU393r4hMXzw&s=19"
    },
    {
      name: "Abhraneel Dhar",
      username: "abhraneeldhar",
      tweetContent: "Just finished working on Nebula.Nebula is live right now ensuring a smooth and seamless experience to work on your documents on the go",
      link: "https://x.com/abhraneeldhar/status/1889685014025040190"
    }

  ]



  return (
    <div className={style.darkBg}>
      <div className={style.main}>
        <div className={style.heroDiv}>
          <Image className={style.cloudGif} src="/landingpage/cloudgif-1.gif" alt="" width={100} height={100} />
          <div className={style.tab}>
            <div className={style.tabLogos}>
              <Image src={nebulaLogo} alt="N" />
              <Image src={vortexLogo} alt="N" />
            </div>

            <div className={style.authBtn}>
              <LoginBtn />
              <SignupBtn />
            </div>
          </div>
          <div className={style.bigAghLogo}>
            <h1>N{" "}E{" "}B{" "}U{" "}L{" "}A</h1>
            <div className={style.upfrontButtons}>
              {/* <Button className={style.nexusBtn}><span>New</span><Image src={vortexLogo} alt="" /></Button> */}
              <NexusBtn />
              <GetStarted />
            </div>
          </div>

        </div>

        <div className={style.documentEditing}>
          <h1 className={style.sectionHeading}>Forge documents Anywhere, Anytime</h1>
          <p>The Power to Perfect Every Document</p>
          <p>Streamline Your Workflow</p>
          {/* <Image className={style.lilLogo} src={nebulaLogo} alt="N" /> */}
          <LilNebulaLogo />
          <Image src={documentEditingImage} alt="" />
        </div>

        <div className={style.nexusSection}>
          <h1 className={style.sectionHeading}>Portal to desktop</h1>
          <p>Use <span className={style.paraNexus}>Nexus</span> to open a portal from your phone to desktop </p>
          <p><span>No</span> signin needed</p>
          <Image className={style.lilLogo} src={vortexLogo} alt="N" />
          <Image src={lappypython} alt="" />
        </div>

        <div className={style.friendsSection}>
          <h1 className={style.sectionHeading}>Create Connect Share</h1>
          <p>Add friends to share documents with</p>
          <Image className={style.friendsImage} src={friendsImage} alt="" />
        </div>

        <div className={style.testimony}>
          <h1 className={style.sectionHeading}>The Nebula family</h1>
          <div className={style.carouselContainer}>
            <div className={style.carousel}>
              {tweets.map((tweet) => (
                <TweetCard key={tweet.username} tweet={tweet} />
              ))}
              {tweets.map((tweet) => (
                <TweetCard key={tweet.username} tweet={tweet} />
              ))}
              {tweets.map((tweet) => (
                <TweetCard key={tweet.username} tweet={tweet} />
              ))}
            </div>
          </div>


        </div>


        <div className={style.aboutMe}>
          <a href="https://www.linkedin.com/in/abhraneeldhar/" target="_blank">
            <h1 className={style.sectionHeading}>Meet the chef</h1>
            <div className={style.profileCard}>
              <Image src={profileImage} alt="" />
              <h1>Abhraneel Dhar</h1>
              <p>CTO @ Trex Corp</p>
            </div>
          </a>
        </div>

        <div className={style.contactUs}>
          <h1 className={style.sectionHeading}>Contact Us</h1>
          <div className={style.socialLinks}>

            <a href="https://linkedin.com/in/abhraneeldhar/" target="_blank">
              <div className={style.oneLink}><Linkedin />abhraneeldhar</div>
            </a>
            <a href="https://github.com/abhraneeldhar" target="_blank">
              <div className={style.oneLink}><Github />abhraneeldhar</div>
            </a>
            <a href="https://www.instagram.com/abhraneeldhar" target="_blank">
              <div className={style.oneLink}><Instagram />abhraneeldhar</div>
            </a>
            <a href="https://x.com/abhraneeldhar" target="_blank">
              <div className={style.oneLink}><Twitter />abhraneeldhar</div>
            </a>
            <a href="https://www.youtube.com/@bonk.sensei" target="_blank">
              <div className={style.oneLink}><Youtube />bonk.sensei</div>
            </a>

          </div>
        </div>



      </div>
    </div>
  )
}