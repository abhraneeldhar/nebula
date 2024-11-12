import { useEffect, useState } from "react"
import styles from "./weathersTab.module.css"
import Image from "next/image"
import { fetchWeather } from "@/app/utils/fetchWeather";
import { useRef } from "react";


import arrowLeft from "../../../public/arrowleft.png"
import arrowRight from "../../../public/arrowright.png"
import loadingIcon from "../../../public/loader.gif"

interface oneHourWeather {
    dt: number,
    main: {
        temp: number,
    }
    weather:
    {
        main: string,
        icon: string,
    }[]
}
interface weatherDataResponse {
    cod: string,
    message: number,
    cnt: number,
    list: oneHourWeather[]
}



function WeatherCard({ weatherIconId, weatherDesc, temperature, time }: { weatherIconId: string, temperature: number, weatherDesc: string, time: number }) {


    function formatTimestampToTime(unixTimestamp: number): string {
        const date = new Date(unixTimestamp * 1000);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    }


    return (<>
        <div className={styles.weatherCard}>
            <p className={styles.weatherTime} >{formatTimestampToTime(time)}</p>
            <div className={styles.weatherIcon}>
                <Image src={`/weatherIcons/${weatherIconId}.png`} width={60} height={60} alt="" unoptimized={true} />
            </div>
            <p className={styles.weatherDesc} >{weatherDesc}</p>
            <p className={styles.temperature}>{Math.round(temperature)}</p>
        </div>
    </>)
}


export default function WeathersTab() {
    const [weatherData, setWeatherData] = useState<weatherDataResponse | null | "not allowed">(null);
    useEffect(() => {
        if (weatherData == null) {
            console.log("fetching data from weathersTab");

            type position = {
                coords: {
                    longitude: number,
                    latitude: number
                }
            }

            let longitude: number;
            let latitude: number;

            const success = async (pos: position) => {
                longitude = pos.coords.longitude;
                latitude = pos.coords.latitude;
                // console.log(pos.coords.latitude, pos.coords.longitude);

                setWeatherData(await fetchWeather(latitude, longitude));
            }
            const error = (): void => {
                console.log("not allowed")
                setWeatherData("not allowed");
            }
            navigator.geolocation.getCurrentPosition(success, error);

        }
    }
        , [weatherData]);

    // useEffect(() => {
    //     console.log("bedrock data>>>>", weatherData)
    // }, [weatherData])

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollButton = (dir: "left" | "right"): void => {
        if (scrollContainerRef) {
            scrollContainerRef?.current?.scrollBy({
                left: dir === 'left' ? -600 : 600,
                behavior: 'smooth',
            });
        }

    }

    return (<>
        <div className={styles.weatherContainer}>
            <h1>Weather</h1>
            <div className={styles.weatherCardContainer} ref={scrollContainerRef}>
                {weatherData == null &&
                    <div className={styles.loadingData}>
                        <Image src={loadingIcon} alt="" height={100} unoptimized={true} />
                        <h3>Loading current weather data</h3>
                    </div>
                }
                {weatherData=="not allowed" && <h3>Location not allowed</h3>}

                {weatherData &&
                    <div className={styles.scrollButtonLeft} onClick={() => { scrollButton("left") }}>
                        <Image src={arrowLeft} alt="<" />
                    </div>
                }

                {(weatherData && weatherData!="not allowed") && weatherData.list && weatherData.list.map((item: oneHourWeather, index: number) => (<li key={index}>
                    <WeatherCard weatherIconId={item.weather[0].icon} temperature={item.main.temp} weatherDesc={item.weather[0].main} time={item.dt} />
                </li>
                ))}

                {weatherData &&
                    <div className={styles.scrollButtonRight} onClick={() => { scrollButton("right") }}>
                        <Image src={arrowRight} alt=">" />
                    </div>
                }

            </div>
        </div>
    </>)
}