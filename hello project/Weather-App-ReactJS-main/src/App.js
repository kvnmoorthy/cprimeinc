import { useState } from 'react';
import './App.css';

function App() {
	const [city, setCity] = useState('');
	const [weatherInfo, setWeatherInfo] = useState(null);

	function getWeather() {
		const apiKey = 'YOUR API KEY HERE';
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
				let MT = Math.round(data.main.temp);
				let FL = Math.round(data.main.feels_like);

				const weather = {
					location: `Weather in ${data.name}`,
					temperature: `Temperature: ${MT} C`,
					feelsLike: `Feels Like: ${FL} C`,
					humidity: `Humidity: ${data.main.humidity} %`,
					wind: `Wind: ${data.wind.speed} km/h`,
					condition: `Weather Condition: ${data.weather[0].description}`,
				};

				setWeatherInfo(weather);
			})

			.catch((error) => {
				console.error(error);
			});
	}

	return (
		<div className='weather-container'>
			<input
				type='text'
				placeholder='Enter city name'
				value={city}
				onChange={(e) => setCity(e.target.value)}
			/>
			<button onClick={getWeather}>Get Weather</button>
			{weatherInfo && (
				<div className='weather-info'>
					<h3>{weatherInfo.location}</h3>
					<p>{weatherInfo.temperature}</p>
					<p>{weatherInfo.feelsLike}</p>
					<p>{weatherInfo.humidity}</p>
					<p>{weatherInfo.wind}</p>
					<p>{weatherInfo.condition}</p>
				</div>
			)}
		</div>
	);
}

export default App;
