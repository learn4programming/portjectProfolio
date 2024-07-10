import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUmbrella,
  faGreaterThan,
  faLessThan,
} from "@fortawesome/free-solid-svg-icons";
import AllCity from "./Allcity";
import AllImages from "./Allimages";

const Weather = () => {
  const [weatherData, setWeatherData] = useState("");
  const [nowCity, setNowCity] = useState("臺北市");
  const [page, setPage] = useState(0);
  const [src, setSrc] = useState("");
  const cityRef = useRef();

  const search = async (city, page) => {
    try {
      const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${
        import.meta.env.VITE_APP_ID
      }&locationName=${city}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setWeatherData({
        location: data.records.location[0].locationName,
        date: data.records.location[0].weatherElement[0].time[
          page
        ].startTime.slice(5, 10),
        description:
          data.records.location[0].weatherElement[0].time[page].parameter
            .parameterName,
        startTime: data.records.location[0].weatherElement[0].time[
          page
        ].startTime.slice(11, 16),
        endTime: data.records.location[0].weatherElement[0].time[
          page
        ].endTime.slice(11, 16),
        rainPop:
          data.records.location[0].weatherElement[1].time[page].parameter
            .parameterName,
        minTem:
          data.records.location[0].weatherElement[2].time[page].parameter
            .parameterName,
        maxTem:
          data.records.location[0].weatherElement[4].time[page].parameter
            .parameterName,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    search(nowCity, page);
  }, [page]);

  const handleCityChange = () => {
    search(cityRef.current.value, page);
    setNowCity(cityRef.current.value);
    setPage(0);
  };

  const handlePageMinus = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  const handlePageAdd = () => {
    if (page < 2) {
      setPage(page + 1);
    }
  };

  return (
    <div className="Weather">
      <div className="top">
        <div className="search-bar">
          <h2>
            今明36小時
            <br />
            天氣預報
          </h2>
          <select
            ref={cityRef}
            className="city"
            name="city"
            id="city"
            onChange={handleCityChange}
          >
            <option disabled selected vlaue="">
              選擇縣市
            </option>
            {Object.keys(AllCity).map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}{" "}
          </select>

          {/* <select className="town" name="town" id="town">
            <option disabled selected vlaue="">
              選擇鄉鎮
            </option>

            {AllCity[nowCity].map((town, index) => (
              <option key={index} value={town}>
                {town}
              </option>
            ))}
          </select> */}
          <ul>
            <li>{weatherData.date}</li>
            <li>
              {weatherData.startTime}~{weatherData.endTime}
            </li>
          </ul>
          <div className="turnPage">
            <FontAwesomeIcon
              icon={faLessThan}
              className={`${page > 0 ? "pageIcon" : "pageGray"}`}
              onClick={handlePageMinus}
            />
            <p>時段{page + 1}</p>
            <FontAwesomeIcon
              icon={faGreaterThan}
              className={`${page < 2 ? "pageIcon" : "pageGray"}`}
              onClick={handlePageAdd}
            />
          </div>
        </div>
        <div className="container">
          <p className="description">{weatherData.description}</p>

          {weatherData.startTime == "06:00" ? (
            <img
              src={`https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/${
                AllImages[weatherData.description]
              }`}
              alt=""
              className="weather-icon"
            />
          ) : (
            <img
              src={`https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/night/${
                AllImages[weatherData.description]
              }`}
              alt=""
              className="weather-icon"
            />
          )}

          <div className="tempRange">
            <p>{weatherData.minTem}°</p>
            <p style={{ padding: "0 0.3rem" }}>-</p>
            <p>{weatherData.maxTem}°</p>
          </div>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <FontAwesomeIcon icon={faUmbrella} className="umbrellaIcon" />
            <p>{weatherData.rainPop}%</p>
          </div>
        </div>

        <div className="footer"></div>
      </div>
    </div>
  );
};

export default Weather;
