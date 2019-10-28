/*  YOU HAVE TP CREATE A FREE ACCOUNT AT DARK SKY API IN ORDER TO USE THE API REQUEST*/
window.addEventListener("load", () => {
  let long;
  let lat;
  let checkbox = document.querySelector("input[name=degreed]");
  let temperature_description = document.querySelector(".temp_description");
  let degree = document.querySelector(".degree");
  let location_timezone = document.querySelector(".location_timezone");
  let max_temp = document.querySelector(".max_temp");
  let min_temp = document.querySelector(".min_temp");
  let wind_speed = document.querySelector(".wind_speed");
  let humid = document.querySelector(".humidity");
  let rain = document.querySelector(".rain");
  let sunrise = document.querySelector(".sunrise");
  let sunset = document.querySelector(".sunset");
  let days = document.querySelectorAll(".day");
  let icons_sub = document.querySelectorAll(".icon_sub");
  let max_week_temps = document.querySelectorAll(".max_week_temp");
  let min_week_temps = document.querySelectorAll(".min_week_temp");
  const days_of_the_week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  /*==ASK FOR USERS LOCATION. WILL ONLY RUN IF ALLOWED IN THE BROSWER===*/
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = "https://cors-anywhere.herokuapp.com/"; // used a proxy because dark sky doesnt allow you to access api infor using http://127.0.0.1/ (home)

      const api = `${proxy}https://api.darksky.net/forecast/[your_API_key]/${lat},${long}`;
      fetch(api)
        .then(res => {
          return res.json();
        })
        .then(data => {
          // const today = data.currently.time;
          //short hand method
          const {
            temperature,
            summary,
            icon,
            humidity,
            windSpeed,
            precipProbability,
            time
          } = data.currently;

          const {
            sunriseTime,
            sunsetTime,
            apparentTemperatureMax,
            apparentTemperatureMin
          } = data.daily.data[0];
          console.log(data);

          /*== SETTING SUNRISE AND SUNSET==*/
          const sun_rise = new Date(sunriseTime * 1000);
          let hour_rise = sun_rise.getUTCHours() + 2;
          let minute_rise = sun_rise.getUTCMinutes() + 2;

          const sun_set = new Date(sunsetTime * 1000);
          let hour_set = sun_set.getUTCHours() + 2;
          let minute_set = sun_set.getUTCMinutes() + 2;

          /*=== SWITCHING FROM CELSIUS TO FAHRENHEIT====*/
          checkbox.addEventListener("change", function() {
            if (this.checked) {
              degree.textContent = Math.floor(temperature);
              min_temp.textContent = Math.floor(apparentTemperatureMin);
              max_temp.textContent = Math.floor(apparentTemperatureMax);
              for (let i = 0; i < days.length; i++) {
                /*== YOU CAN CREATE A FUNCTION FOR THIS CODE BECAUSE IT IS REPETITIVE===*/
                const {
                  apparentTemperatureMax,
                  apparentTemperatureMin
                } = data.daily.data[i];
                max_week_temps[i].textContent = Math.floor(
                  apparentTemperatureMax
                );
                min_week_temps[i].textContent = Math.floor(
                  apparentTemperatureMin
                );
              }
            } else {
              degree.textContent = Math.floor(((temperature - 32) * 5) / 9);
              max_temp.textContent = Math.floor(
                ((apparentTemperatureMax - 32) * 5) / 9
              );
              min_temp.textContent = Math.floor(
                ((apparentTemperatureMin - 32) * 5) / 9
              );
              max_week_temps[i].textContent = Math.floor(
                ((apparentTemperatureMax - 32) * 5) / 9
              );
              min_week_temps[i].textContent = Math.floor(
                ((apparentTemperatureMin - 32) * 5) / 9
              );
              for (let i = 0; i < days.length; i++) {
                //get following days temps
                const {
                  apparentTemperatureMax,
                  apparentTemperatureMin
                } = data.daily.data[i];
                max_week_temps[i].textContent = Math.floor(
                  ((apparentTemperatureMax - 32) * 5) / 9
                );
                min_week_temps[i].textContent = Math.floor(
                  ((apparentTemperatureMin - 32) * 5) / 9
                );
              }
            }
          });

          /*==== GIVING DOM ELEMENTS THEIR VALUES===*/
          //CONVERT THE CURRENT DAY TEMPERATURE TO CELSIUS
          degree.textContent = Math.floor(((temperature - 32) * 5) / 9);
          max_temp.textContent = Math.floor(
            ((apparentTemperatureMax - 32) * 5) / 9
          );
          min_temp.textContent = Math.floor(
            ((apparentTemperatureMin - 32) * 5) / 9
          );
          temperature_description.textContent = summary;
          location_timezone.textContent = data.timezone;
          wind_speed.textContent = Math.floor((windSpeed * 1.6) / 3.6);
          humid.textContent = Math.floor(humidity * 100);
          rain.textContent = precipProbability * 100;
          sunrise.textContent = `${hour_rise}:${minute_rise}`;
          sunset.textContent = `${hour_set}:${minute_set}`;

          //setting days of the week
          for (let i = 0; i < days.length; i++) {
            const {
              apparentTemperatureMax,
              apparentTemperatureMin
            } = data.daily.data[i];

            /*====LOOPING THROUGH THE DAYS OF THE WEEK====*/
            let d = new Date();
            let day_counter = (d.getUTCDay() + 1 + i) % 7;
            days[i].textContent = days_of_the_week[day_counter];

            /*=============UP COMING DAYS TEMPERATURES=====================*/
            // CONVERTED THEM TO CELSIUS BY DEFAULT
            max_week_temps[i].textContent = Math.floor(
              ((apparentTemperatureMax - 32) * 5) / 9
            );
            min_week_temps[i].textContent = Math.floor(
              ((apparentTemperatureMin - 32) * 5) / 9
            );
          }

          /*=========================================================================
                        SET THE DARK SKY ICONS
          =========================================================================*/
          // This icon keeper is for the up coming days
          let iconKeeper = [];
          for (let i = 1; i < icons_sub.length + 1; i++) {
            const { icon } = data.daily.data[i];
            iconKeeper.push(icon);
          }

          setIcons(icon, document.querySelector(".icon"));
          setSubIcons(iconKeeper, icons_sub);
        });
    });
  }

  /*=========================================================
  FUNCTIONS FOR THE ICONS
  ========================================================*/

  function setIcons(icon, id) {
    const skycons = new Skycons({ color: "white" });
    const current_icon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(id, Skycons[current_icon]);
  }
  function setSubIcons(icons, ids) {
    let arr = [];
    for (let i = 0; i < ids.length; i++) {
      const skycons = new Skycons({ color: "white" });
      const current_icon = icons[i].replace(/-/g, "_").toUpperCase();
      skycons.play();
      arr.push(skycons.set(ids[i], Skycons[current_icon]));
    }
    return arr;
  }
});
