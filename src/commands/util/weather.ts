import { Command } from '@knighthacks/dispatch';
import axios, { AxiosError } from 'axios';
import { ApplicationCommandOptionData, MessageEmbed } from 'discord.js';
import Colors from '../../colors';

const apiKey = process.env.WEATHER_API_KEY;

const baseURL = 'http://api.openweathermap.org/data/2.5/weather?';

const options: ApplicationCommandOptionData[] = [
  {
    name: 'city',
    description: 'The City to get weather data from.',
    type: 'STRING',
  },
];

type WeatherResponse = {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };

  weather: [
    {
      description: string;
    }
  ];
};

const normalizeTemp = (temp: number) =>
  Math.round(temp * (9 / 5) - 459.67).toString() + '°';

function getWeather(city: string): Promise<WeatherResponse | null | string> {
  const fetchURL = `${baseURL}appid=${apiKey}&q=${city}`;
  return axios
    .get<WeatherResponse>(fetchURL)
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      if (error.response?.data.cod === '404') {
        return `'${city}' is not a valid city.`;
      }

      console.error(error);

      return null;
    });
}

function createWeatherEmbed(city: string, response: WeatherResponse) {
  const { main } = response;
  const [weather] = response.weather;

  return new MessageEmbed()
    .setColor(Colors.embedColor)
    .setThumbnail('https://i.ibb.co/CMrsxdX/weather.png')
    .setTitle(`Weather for ${city}`)
    .addField('Conditions', weather.description)
    .addField('Temperature', normalizeTemp(main.temp))
    .addField('Feels Like', normalizeTemp(main.feels_like))
    .addField('Low', normalizeTemp(main.temp_min))
    .addField('High', normalizeTemp(main.temp_max))
    .addField('Humidity', `${main.humidity}%`);
}

const WeatherCommand: Command = {
  name: 'weather',
  description: 'Gets the latest weather data',
  options,
  async run({ interaction }) {
    const city: string =
      (interaction.options.get('city')?.value as string) ?? 'Orlando';
    await interaction.deferReply();

    const weather = await getWeather(city);
    if (!weather) {
      await interaction.followUp('Error fetching weather data.');
      return;
    }

    if (typeof weather === 'string') {
      await interaction.followUp({ content: weather, ephemeral: true });
      return;
    }

    const embed = createWeatherEmbed(city, weather);
    await interaction.followUp({ embeds: [embed] });
  },
};

export default WeatherCommand;
