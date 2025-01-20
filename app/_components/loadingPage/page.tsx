import appLogo from "../../../public/appLogo.jpg"
import Image from "next/image"

export default function LoadingPage() {
    return (<>
        <div className="loaderPage">
            <div className="logoNShi">
                <Image className="appLogo" src={appLogo} alt="" />
                <h2>NEBULA</h2>
                <p>A Trex Corp. product</p>
            </div>
        </div>
    </>)
}