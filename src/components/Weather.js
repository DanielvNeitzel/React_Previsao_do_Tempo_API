import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);

  const apiKey = '09b270e07e6a33a98c3f5ec9c4722077';

  useEffect(() => {
    loadCityOptions();
  }, []);

  const loadCityOptions = () => {
    // Importação relativa do arquivo JSON
    import('./configs/cidades.json').then((response) => {
      const cities = response.default.map((city) => ({
        value: city.nome,
        label: city.nome,
      }));
      setCityOptions(cities);
    }).catch((error) => {
      console.error('Erro ao carregar cidades:', error);
    });
  };

  const getWeatherData = async () => {
    if (selectedCity) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity.label}&appid=${apiKey}&units=metric&lang=pt_br`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error('Erro ao obter dados do tempo:', error);
      }
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center w-100 mt-5">
      <h2 className="mb-4 text-center">Previsão do Tempo</h2>
      <Select
        className="w-50"
        options={cityOptions}
        value={selectedCity}
        onChange={(selectedOption) => setSelectedCity(selectedOption)}
        placeholder="Selecione ou digite o nome da cidade..."
        isSearchable
      />
      <div className="d-grid gap-2 my-3">
        <button
          className="btn btn-success text-uppercase font-weight-bold"
          type="button"
          onClick={getWeatherData}
        >
          Obter Previsão
        </button>
      </div>

      {weatherData && (
        <div className="weather-info card text-white bg-secondary w-50">
          <div className="card-header text-center">
            {weatherData.name}, {weatherData.sys.country}
          </div>
          <div className="card-body text-center">
            <h5 className="temperature card-title">
              {Math.round(weatherData.main.temp)}°C
            </h5>
            <p className="condition text-uppercase font-weight-bold card-text">
              {weatherData.weather[0].description}
            </p>
            <img
              src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              alt={weatherData.weather[0].description}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
