// Wheater div height deciding code
let windBar = document.querySelectorAll('.wind-bar')
windBar.forEach(function(e){
  setInterval(() => {
      let rn = 11 + Math.floor(Math.random() * 90)
       e.style.height = rn + '%'
  }, 1000);     

})


// main js 

let cityInput = document.querySelector('#cityInput')
cityInput.addEventListener('keydown',(e)=>{
        if(e.key === 'Enter'){
                console.log(cityInput.value);    
                    let city = cityInput.value.trim();

    if (city === "") return;

    localStorage.setItem("lastCity", city);  
    getWeather(city);
        }
})

window.addEventListener('load', () => {
  let savedCity = localStorage.getItem("lastCity");

  if (savedCity) {
    cityInput.value = savedCity;
    getWeather(savedCity);
  }
});



function getCityCurrentTime(dt, timezoneOffset) {
  let date = new Date((dt + timezoneOffset) * 1000);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}



function convertUnixToTime(unixTime) {
  // Step 1: seconds → milliseconds
  let date = new Date(unixTime * 1000);

  // Step 2: readable time (India / local format)
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
}


function convertUnixToFullDate(unixTime) {
  let date = new Date(unixTime * 1000);

  return {
    day: date.toLocaleDateString("en-IN", { weekday: "long" }),
    date: date.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: date.toLocaleDateString("en-IN", { month: "long" }),
    year: date.toLocaleDateString("en-IN", { year: "numeric" }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    })
  };
}



// update weather condition
let weatherImg = document.querySelector('#weatherImg') 

function updateWeatherImg(condition){
  if(condition === 'Clear'){
    weatherImg.src = './images/cloud.png';
  }
  else if(condition === 'Clouds'){
    weatherImg.src = './images/clouds.png';
  }
  else if(condition === 'Rain'){
    weatherImg.src = './images/rain.png';
  }
  else if(condition === 'Smoke'){
    weatherImg.src = './images/smoke.png';
  }
  else{
    weatherImg.src = './images/cloud.png';
  }
}



async function getWeather(city){
    try{ let apiKey = `1b46e4ce8de1ef107a73b1b3c65c92b2`;
      let rawData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      if(!rawData.ok){
        throw new  Error("Wrong City Entered")
      }
      let realData = await rawData.json();
      setWeather(realData);
      console.log(realData);
      
      console.log(realData.main.temp);
      console.log(realData.dt, realData.timezone);
      console.log(realData.weather[0].main);
      console.log(realData.main.humidity + '' + '%');

      let dewPoint = realData.main.temp - ((100 - realData.main.humidity) / 5)
      console.log(Math.round(dewPoint)+ '°C');
      

      let sunrise = convertUnixToFullDate(realData.sys.sunrise);
      console.log(sunrise.day);
      console.log(sunrise.date, sunrise.month, sunrise.year);
       console.log(sunrise.time);
      console.log((realData.wind.speed)* 3.6);
      console.log((realData.visibility)/1000 +'km');
      console.log(realData.main.feels_like + '°C');
      console.log(convertUnixToTime(realData.sys.sunrise));
      console.log(convertUnixToTime(realData.sys.sunset));
      console.log(city + ' '+realData.sys.country);

       }
      catch (err){
        console.warn(err.message);
      }
}




let temp = document.querySelector('#temp')
let loca = document.querySelector('#location')
let day = document.querySelector('#day')
let windd = document.querySelector('#windd')
let suns = document.querySelector('#suns')
let sunss = document.querySelector('#sunss')
let humadity = document.querySelector('#humidity')
let dew = document.querySelector('#dew')
let visible = document.querySelector('#visible')
let feels = document.querySelector('#feels')
let atmosphere = document.querySelector('#atmosphere')

function setWeather(data){
      let sunrise = convertUnixToFullDate(data.sys.sunrise);
      let dewPoint = data.main.temp - ((100 - data.main.humidity) / 5)

     
      let currentTime = getCityCurrentTime(data.dt, data.timezone);

      updateWeatherImg(data.weather[0].main)


     atmosphere.innerHTML = data.weather[0].main
     temp.innerHTML = Math.round(data.main.temp) + '°C'
      loca.innerHTML = data.name + ' '+ data.sys.country
      day.innerHTML = sunrise.day + ',  ' + sunrise.month +' '+ sunrise.date + ', '+ sunrise.year + ' At ' + sunrise.time;
      windd.innerHTML = Math.round(data.wind.speed * 3.6) +' '+ 'km/h'
      suns.innerHTML = convertUnixToTime(data.sys.sunrise)
      sunss.innerHTML = convertUnixToTime(data.sys.sunset)
      humadity.innerHTML = data.main.humidity + '' + '%'
      dew.innerHTML = "Dew Point is " + Math.round(dewPoint)+ '°C'
      visible.innerHTML = (data.visibility)/1000 +'KM'
      feels.innerHTML = data.main.feels_like + '°C'
}
