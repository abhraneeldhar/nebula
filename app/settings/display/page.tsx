"use client"
import { ArrowBigLeft } from "lucide-react"
import styles from "./display.module.css"
import { useRouter } from "next/navigation"
import { Button } from "@radix-ui/themes";
import { useTheme } from "next-themes";
export default function Displaysettings() {

    const router = useRouter();
    const { setTheme, resolvedTheme } = useTheme();
    return (<>
        displa
        <div className={styles.testdiv}>{resolvedTheme}</div>
        <div className={styles.testBtn}>
            <Button onClick={() => { setTheme("batmanRed") }}>Change to batman</Button>
            <Button onClick={() => { setTheme("summerChill") }}>Change to summer</Button>
            <Button onClick={() => { setTheme("purple") }}>Purple</Button>
            <Button onClick={() => { setTheme("summerChill") }}>Change to summer</Button>
        </div>
    </>)
}