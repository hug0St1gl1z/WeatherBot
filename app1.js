import { Telegraf, Markup } from 'telegraf'
import fetch from 'node-fetch'

const bot = new Telegraf('5882776495:AAHHSvcixFN5NtT2sPvNSjtotsmaRNAX1yk') // замените на свой токен
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'
const weatherApiKey = '3df8a5d919ce77e18c77dd64b5afbb2b' // замените на свой API-ключ

bot.start((ctx) => {
	ctx.reply('Привет! Я бот, который сообщит вам погоду.')
	// запрашиваем у пользователя геолокацию с помощью кнопки
	ctx.reply(
		'Пожалуйста, отправьте мне свою геолокацию:')

	Markup.keyboard([Markup.button.locationRequest('Отправить геолокацию')])
		.oneTime()
		.resize()
	
})

bot.on('location', async (ctx) => {
    const latitude = ctx.update.message.location.latitude;
    const longitude = ctx.update.message.location.longitude;
    const apiUrl = `${weatherApiUrl}?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      const cityName = data.name;
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;
      const feelsLike = data.main.feels_like;
      const windSpeed = data.wind.speed;
      const windDeg = data.wind.deg;
      const windDirection = getWindDirection(windDeg);
      const message = `Погода в ${cityName}: ${weatherDescription}. \n\nТемпература: ${temperature}°C (ощущается как ${feelsLike}°C). \n\nСкорость ветра: ${windSpeed} м/с. Направление ветра: ${windDirection}.`;
      ctx.reply(message);
    } catch (error) {
      console.error(error);
      ctx.reply('Упс, что-то пошло не так. Попробуйте еще раз позже.');
    }
  });
  
  function getWindDirection(deg) {
    const directions = ['С', 'ССВ', 'СВ', 'ВСВ', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ'];
    const index = Math.round((deg % 360) / 22.5);
    return directions[index];
  }
  
  bot.launch();