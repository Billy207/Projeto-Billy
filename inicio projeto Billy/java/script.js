// URL da API
const API_URL = "http://localhost:8080/weather";

// Função para buscar os dados climáticos de uma cidade
async function fetchWeather(city) {
  try {
    const response = await fetch(`${API_URL}?city=${encodeURIComponent(city)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados climáticos");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível carregar os dados climáticos." };
  }
}

// Função para atualizar os dados climáticos na página
function updateWeather(data) {
  const currentTempElement = document.getElementById("current-temp");
  const forecastElement = document.getElementById("forecast");

  if (data.error) {
    currentTempElement.textContent = data.error;
    forecastElement.innerHTML = "";
    return;
  }

  currentTempElement.textContent = `Temperatura atual: ${data.currentTemperature}`;
  forecastElement.innerHTML = ""; // Limpa previsões anteriores
  data.forecast.forEach(day => {
    const div = document.createElement("div");
    div.className = "forecast-day";
    div.innerHTML = `<span>${day.day}</span><span>${day.temperature}</span>`;
    forecastElement.appendChild(div);
  });
}

// Evento para capturar a alteração de cidade
document.getElementById("city").addEventListener("change", async function () {
  const city = this.value;
  const weatherData = await fetchWeather(city);
  updateWeather(weatherData);
});

// Carrega os dados iniciais para a primeira cidade da lista
(async function init() {
  const city = document.getElementById("city").value;
  const weatherData = await fetchWeather(city);
  updateWeather(weatherData);
})();
