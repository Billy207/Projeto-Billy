const API_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = "2dc8ab4bf9aed9a43e8bf2b05f4df85e";

// Função para buscar os dados climáticos da cidade
async function fetchWeather(city) {
  try {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_BR`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Cidade não encontrada.");
    }

    const data = await response.json();

    // Processar os dados para agrupar por dia
    const groupedForecast = groupForecastByDay(data.list);

    return {
      city: data.city.name,
      currentTemperature: `${data.list[0].main.temp}°C`,
      forecast: groupedForecast,
    };
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível carregar os dados climáticos." };
  }
}

// Função para agrupar previsões por dia
function groupForecastByDay(forecastList) {
  const grouped = {};

  forecastList.forEach((entry) => {
    const date = new Date(entry.dt * 1000).toISOString().split("T")[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    if (grouped[date].length < 3) {
      grouped[date].push({
        time: new Date(entry.dt * 1000).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: `${entry.main.temp.toFixed(1)}°C`,
        description: entry.weather[0].description,
      });
    }
  });

  return Object.entries(grouped).map(([date, entries]) => ({
    date: new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "short",
    }),
    details: entries,
  }));
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
    const card = document.createElement("div");
    card.className = "forecast-card";

    // Resumo do card
    const summary = document.createElement("div");
    summary.className = "forecast-summary";
    summary.innerHTML = `
      <span>${day.date}</span>
      <span class="arrow">&#9660;</span>
    `;

    // Detalhes escondidos inicialmente
    const details = document.createElement("div");
    details.className = "forecast-details";

    day.details.forEach((detail) => {
      const detailItem = document.createElement("div");
      detailItem.innerHTML = `
        <span>Hora: ${detail.time}</span>
        <span>Temperatura: ${detail.temp}</span>
        <span>Descrição: ${detail.description}</span>
      `;
      details.appendChild(detailItem);
    });

    // Evento para expandir/colapsar os detalhes
    summary.addEventListener("click", () => {
      const arrow = summary.querySelector(".arrow");
      details.classList.toggle("open");
      arrow.classList.toggle("open");
    });

    card.appendChild(summary);
    card.appendChild(details);
    forecastElement.appendChild(card);
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

