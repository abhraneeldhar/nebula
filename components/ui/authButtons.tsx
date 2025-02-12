"use client"
import { signIn } from "next-auth/react"
import style from "../../app/root.module.css"
import { Button } from "@radix-ui/themes"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import nebulaLogo from "../../public/landingpage/nebulaLogo.png"
export default function SignupBtn() {
    return (
        <button onClick={async ()=>{
            await signIn("google", { callbackUrl:"/home" })
        }} className={style.signUpBtn}>SignUp</button>
    )
}

export function LoginBtn() {
    return (
        <button onClick={async ()=>{
            await signIn("google", { callbackUrl:"/home" })
        }} className={style.loginBtn}>Login</button>
    )
}

export function GetStarted(){
    return(
        <Button onClick={async ()=>{
            await signIn("google", { callbackUrl:"/home" })
        }} className={style.getStarted}>Get Started <ArrowRight className={style.arrowRight} /></Button>
    )
}

export function LilNebulaLogo(){
    return(
        <Image onClick={async ()=>{
            await signIn("google", { callbackUrl:"/home" })
        }} className={style.lilLogo} src={nebulaLogo} alt="N" />
    )
}
