const apiKey = "618804182f8443878f680157250207"; // Replace with your actual key

let isCelsius = true;
let currentC = 0;
let currentF = 0;
let uvIndex = 0;
let pmValue = 0;

const locationEl = document.getElementById("location");
const tempEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const uvEl = document.getElementById("uv");
const adviceEl = document.getElementById("advice");
const toggleBtn = document.getElementById("toggle");
const infoBox = document.getElementById("infoBox");

document.getElementById("showTime").addEventListener("click", () => {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toDateString();
  infoBox.innerHTML = `<strong>🕒 Current Time:</strong><br>${time}<br>${date}`;
});

document.getElementById("showUV").addEventListener("click", () => {
  infoBox.innerHTML = `
    <strong>🔆 UV Index Levels:</strong><br>
    0–2: Low • 3–5: Moderate • 6–7: High • 8–10: Very High • 11+: Extreme<br><br>
    Current UV: <strong>${uvIndex}</strong><br>
    ${uvIndex > 7 ? "☀️ High UV — wear sunscreen and limit sun exposure." : "✅ UV levels are safe today."}
  `;
});

document.getElementById("showPM").addEventListener("click", () => {
  infoBox.innerHTML = `
    <strong>🌫️ Air Quality (PM2.5):</strong><br>
    PM2.5 are tiny particles in polluted air.<br><br>
    Level: <strong>${pmValue.toFixed(1)}</strong><br>
    ${pmValue > 50 ? "🚨 Air quality is poor. Consider staying indoors." : "✅ Air quality is good."}
  `;
});

function fetchWeather(lat, lon) {
  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`)
    .then(res => res.json())
    .then(data => {
      const { name } = data.location;
      const { temp_c, temp_f, condition, is_day, uv } = data.current;
      const { pm2_5 } = data.current.air_quality;

      currentC = temp_c;
      currentF = temp_f;
      uvIndex = uv;
      pmValue = pm2_5;

      locationEl.textContent = `📍 ${name}`;
      tempEl.textContent = `🌡️ ${currentC.toFixed(1)} °C`;
      conditionEl.textContent = `🌥️ ${condition.text}`;
      uvEl.textContent = `🔆 UV Index: ${uv}`;

      document.body.style.background = is_day
        ? "linear-gradient(to right, #dff3fc, #bae6f9)"
        : "linear-gradient(to right, #0f172a, #1f2937)";

      // Animate UV advice
      adviceEl.classList.remove("animate");
      void adviceEl.offsetWidth;
      adviceEl.classList.add("animate");

      adviceEl.innerHTML =
        uv > 7
          ? "☀️ UV levels are high — wear sunscreen and stay hydrated."
          : "✅ UV levels are moderate. Outdoor conditions are comfortable.";
    });
}

function toggleTemp() {
  if (isCelsius) {
    tempEl.textContent = `🌡️ ${currentF.toFixed(1)} °F`;
    toggleBtn.textContent = "Switch to °C";
  } else {
    tempEl.textContent = `🌡️ ${currentC.toFixed(1)} °C`;
    toggleBtn.textContent = "Switch to °F";
  }
  isCelsius = !isCelsius;
}

navigator.geolocation.getCurrentPosition(
  pos => {
    const { latitude, longitude } = pos.coords;
    fetchWeather(latitude, longitude);
  },
  () => {
    locationEl.textContent = "Using fallback: Gaya";
    fetchWeather(24.7961, 84.9994);
  }
);

toggleBtn.addEventListener("click", toggleTemp);
