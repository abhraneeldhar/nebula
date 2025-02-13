"use client"
import { ArrowBigLeft, ArrowLeft } from "lucide-react"
import styles from "./display.module.css"
import { useRouter } from "next/navigation"
import { Button } from "@radix-ui/themes";
import { useTheme } from "next-themes";
export default function Displaysettings() {

    const router = useRouter();
    const { setTheme, resolvedTheme } = useTheme();

    const colorPalettes = [
        {
            name: "coolBlue",
            color1: "#000957",
            color2: "#344CB7",
            color3: "#577BC1",
            color4: "#FFEB00"
        },
        {
            name: "mclaren",
            color1: "#08D9D6",
            color2: "#252A34",
            color3: "#FF2E63",
            color4: "#EAEAEA"
        },
        {
            name: "premiumShi",
            color1: "#222831",
            color2: "#393E46",
            color3: "#00ADB5",
            color4: "#EEEEEE"
        },
        {
            name: "lightSeaGreen",
            color1: "#E3FDFD",
            color2: "#CBF1F5",
            color3: "#A6E3E9",
            color4: "#71C9CE"
        }
    ];


    const PreviewCard = ({ theme }: {
        theme: {
            name: string,
            color1: string,
            color2: string,
            color3: string,
            color4: string,
        }
    }) => {
        let cardClassname: string;
        if (resolvedTheme == theme.name) {
            cardClassname = `${styles.previewCardMain} ${styles.selectedCard}`
        }
        else {
            cardClassname = `${styles.previewCardMain}`
        }
        return (
            <div className={cardClassname}>
                <div onClick={() => {
                    setTheme(theme.name);
                    window.location.reload();
                 }} style={{ backgroundColor: theme.color1 }} className={styles.previewCard}>
                    <div className={styles.sidebar}>
                        <div style={{ backgroundColor: theme.color3 }} className={styles.sidebarDivs}></div>
                        <div style={{ backgroundColor: theme.color3 }} className={styles.sidebarDivs}></div>
                        <div style={{ backgroundColor: theme.color3 }} className={styles.sidebarDivs}></div>
                        <div style={{ backgroundColor: theme.color3 }} className={styles.sidebarDivs}></div>
                    </div>
                    <div className={styles.mainPreview}>
                        <div style={{ backgroundColor: theme.color2 }} className={styles.thinDiv}></div>
                        <div style={{ backgroundColor: theme.color4 }} className={styles.thiccDiv}></div>
                    </div>
                </div>
                <h1>{theme.name}</h1>
            </div>

        )
    }


    return (<>
        <div className={styles.main}>
            <div><ArrowLeft className={styles.backBtn} onClick={()=>{router.push("/settings")}}/></div>
            <h1 className={styles.pageHeader}>Display Settings</h1>
            <p className={styles.pagePara}>Choose your preffered interface apperance.</p>

            <div className={styles.previewCardHolder}>

                {colorPalettes.map((theme) => (
                    <PreviewCard key={theme.name} theme={theme} />
                ))}
            </div>

        </div>
    </>)
}