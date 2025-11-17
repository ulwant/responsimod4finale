import { useEffect, useState } from "react";

export default function useWeather(city) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function buildHourEntries(startDate, count) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        const dt = new Date(startDate.getTime() + i * 60 * 60 * 1000);
        const datePart = dt.toISOString().slice(0, 10);
        const timePart = `${pad(dt.getHours())}:00`;
        // simple temp variation around 28
        const temp = 28 + Math.round(2 * Math.sin((dt.getHours() / 24) * Math.PI * 2));
        arr.push({
          time: `${datePart} ${timePart}`,
          temp_c: temp,
          condition: {
            icon: "https://img.icons8.com/ios-filled/50/000000/partly-cloudy-day.png",
            text: "Partly Cloudy",
          },
        });
      }
      return arr;
    }

    async function loadStatic() {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10);
        const localtime = `${dateStr} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

        const hoursToday = buildHourEntries(now, 24);
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const hoursTomorrow = buildHourEntries(tomorrow, 24);

        const forecastday = [
          {
            date: dateStr,
            day: {
              maxtemp_c: 31,
              mintemp_c: 25,
              condition: {
                icon: "https://img.icons8.com/ios-filled/50/000000/partly-cloudy-day.png",
                text: "Partly Cloudy",
              },
            },
            astro: {
              sunrise: "05:45 AM",
              sunset: "05:50 PM",
              moon_phase: "Waxing Crescent",
            },
            hour: hoursToday,
          },
          {
            date: tomorrow.toISOString().slice(0, 10),
            day: {
              maxtemp_c: 30,
              mintemp_c: 24,
              condition: {
                icon: "https://img.icons8.com/ios-filled/50/000000/partly-cloudy-day.png",
                text: "Partly Cloudy",
              },
            },
            astro: {
              sunrise: "05:45 AM",
              sunset: "05:50 PM",
              moon_phase: "First Quarter",
            },
            hour: hoursTomorrow,
          },
        ];

        const data = {
          location: {
            name: "Jakarta", // always Jakarta
            localtime,
          },
          current: {
            temp_c: 28, // requested temperature
            condition: {
              text: "Partly Cloudy", // requested condition
              icon: "https://img.icons8.com/ios-filled/50/000000/partly-cloudy-day.png",
            },
            uv: 6.0,
            humidity: 65, // requested humidity
            wind_kph: 10,
            wind_dir: "E",
            pressure_mb: 1010,
            vis_km: 10,
            feelslike_c: 28,
            cloud: 40,
            air_quality: {
              pm2_5: 15.0,
              pm10: 25.0,
            },
          },
          forecast: {
            forecastday,
          },
        };

        // small simulated delay
        await new Promise((res) => setTimeout(res, 300));

        if (mounted) setWeather(data);
      } catch (err) {
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStatic();

    return () => {
      mounted = false;
    };
  }, [city]);

  return { weather, loading, error };
}