import appLogo from "../../../public/appLogo.jpg"
import Image from "next/image"
import styles from "./laoder.module.css"

export default function LoadingPage() {
    return (<>
        <div className={styles.loaderPage}>
            <div className={styles.logoNShi}>
                <Image className={styles.appLogo} src={appLogo} alt="" />
                <h2>NEBULA</h2>
                <p>A Trex Corp. product</p>
            </div>
        </div>
    </>)
}