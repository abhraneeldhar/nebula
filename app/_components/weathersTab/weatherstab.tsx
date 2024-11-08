import styles from "./weathersTab.module.css"

import WeatherCard from "./weatherCard"

export default function WeathersTab(){
    return(<>
    <div className={styles.weatherContainer}>
        <h1>Weather</h1>
        <div className={styles.weatherCardContainer}>
            <WeatherCard weatherIconId="10d" temperature={30} weatherDesc="Cloudy"/>
        </div>

    </div>
    </>)
}