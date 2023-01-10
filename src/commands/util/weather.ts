import { Command } from '@knighthacks/scythe';
import { fetch } from 'undici';
import {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  EmbedBuilder,
} from 'discord.js';
import Colors from '../../colors';

const apiKey = process.env.WEATHER_API_KEY;

const baseURL = 'http://api.openweathermap.org/data/2.5/weather?';

const options: ApplicationCommandOptionData[] = [
  {
    name: 'city',
    description: 'The City to get weather data from.',
    type: ApplicationCommandOptionType.String,
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

async function getWeather(
  city: string
): Promise<WeatherResponse | null | string> {
  const fetchURL = `${baseURL}appid=${apiKey}&q=${city}`;

  const res = await fetch(fetchURL);

  if (!res.ok) {
    if (res.status === 404) {
      return `'${city}' is not a valid city.`;
    }

    return null;
  }

  return res.json() as Promise<WeatherResponse>;
}

function createWeatherEmbed(city: string, response: WeatherResponse) {
  const { main } = response;
  const [weather] = response.weather;

  return new EmbedBuilder()
    .setColor(Colors.embedColor)
    .setThumbnail('https://i.ibb.co/CMrsxdX/weather.png')
    .setTitle(`Weather for ${city}`)
    .addFields([
      { name: 'Conditions', value: weather.description },
      { name: 'Temperature', value: normalizeTemp(main.temp) },
      { name: 'Feels Like', value: normalizeTemp(main.feels_like) },
      { name: 'Low', value: normalizeTemp(main.temp_min) },
      { name: 'High', value: normalizeTemp(main.temp_max) },
      { name: 'Humidity', value: `${main.humidity}%` },
    ]);
}

const WeatherCommand: Command = {
  name: 'weather',
  description: 'Gets the latest weather data',
  options,
  async run({ interaction }) {
    const city: string = interaction.options.getString('city') ?? 'Orlando';
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
