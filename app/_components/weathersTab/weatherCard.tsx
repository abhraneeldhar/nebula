import styles from "./weatherCard.module.css"
import path from "path"

import Image from "next/image"

export default function WeatherCard({weatherIconId,weatherDesc, temperature}:{weatherIconId: string, temperature:number, weatherDesc:string}){

    
    const myPath= path.join("/public/weatherIcons",`${weatherIconId}.png`)
    return(<>
    <div className={styles.weatherCard}>
        <div className={styles.weatherIcon}>
            
        </div>
    </div>
    </>)
}
