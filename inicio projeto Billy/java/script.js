const API_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = "2dc8ab4bf9aed9a43e8bf2b05f4df85e";

// Função para buscar os dados climáticos da cidade
async function fetchWeather(city) {
  try {
    // Monta a URL com os parâmetros da cidade, unidade (métrico) e idioma (português)
    const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_BR`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Cidade não encontrada.");
    }

    const data = await response.json();

    // Retorna os dados transformados para uso
    return {
      city: data.city.name,
      currentTemperature: `${data.list[0].main.temp}°C`,
      forecast: data.list.slice(0, 5).map((entry) => ({
        day: new Date(entry.dt * 1000).toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "short",
        }),
        description: entry.weather[0].description,
        temperature: `${entry.main.temp}°C`,
      })),
    };
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível carregar os dados climáticos." };
  }
}

// Função para atualizar os resultados na página
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
  data.forecast.forEach((day) => {
    const div = document.createElement("div");
    div.className = "forecast-day";
    div.innerHTML = `
      <span>${day.day}</span>
      <span>${day.description} - ${day.temperature}</span>
    `;
    forecastElement.appendChild(div);
  });
}

// Evento ao clicar no botão de busca
document.getElementById("search").addEventListener("click", async function () {
  const city = document.getElementById("city").value.trim();
  if (!city) {
    alert("Por favor, digite o nome de uma cidade.");
    return;
  }
  const weatherData = await fetchWeather(city);
  updateWeather(weatherData);
});
