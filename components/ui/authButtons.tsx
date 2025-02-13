"use client"
import { signIn, useSession } from "next-auth/react"
import style from "../../app/root.module.css"
import { Button } from "@radix-ui/themes"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import nebulaLogo from "../../public/landingpage/nebulaLogo.png"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { appStore } from "@/app/store"

import vortexLogo from "../../public/landingpage/vortex logo.jpeg"



export default function SignupBtn() {
    const session = useSession();
    const router=useRouter();
    
    useEffect(() => {
        if (session.status==="authenticated") {
            console.log("user is logged in")
            router.push("/home")
        }
    }, [session])
    return (
        <button onClick={async () => {
            await signIn("google", { callbackUrl: "/home" });
        }} className={style.signUpBtn}>SignUp</button>
    )
}

export function LoginBtn() {
    return (
        <button onClick={async () => {
            await signIn("google", { callbackUrl: "/home" })
        }} className={style.loginBtn}>Login</button>
    )
}

export function GetStarted() {
    return (
        <Button onClick={async () => {
            await signIn("google", { callbackUrl: "/home" })
        }} className={style.getStarted}>Get Started <ArrowRight className={style.arrowRight} /></Button>
    )
}

export function LilNebulaLogo() {
    return (
        <Image onClick={async () => {
            await signIn("google", { callbackUrl: "/home" })
        }} className={style.lilLogo} src={nebulaLogo} alt="N" />
    )
}

export function NexusBtn(){
    const router=useRouter();
    return(
        <Button onClick={()=>router.push("/nexus")} className={style.nexusBtn}><span>New</span><Image src={vortexLogo} alt="" /></Button>
    )
}