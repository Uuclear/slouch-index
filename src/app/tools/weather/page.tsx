'use client';

import { useState } from 'react';

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (searchCity: string) => {
    setLoading(true);
    setError('');
    setWeatherData('');

    try {
      // Using wttr.in free API
      const response = await fetch(`https://wttr.in/${encodeURIComponent(searchCity)}?format=j1`);
      if (!response.ok) {
        throw new Error('无法获取天气信息');
      }
      const data = await response.json();

      const current = data.current_condition?.[0];
      const weather = {
        temp: current?.temp_C,
        feelsLike: current?.FeelsLikeC,
        humidity: current?.humidity,
        weatherDesc: current?.weatherDesc?.[0]?.value,
        windSpeed: current?.windspeedKmph,
        windDir: current?.winddir16Point,
        pressure: current?.pressure,
        visibility: current?.visibility,
      };

      setWeatherData(JSON.stringify(weather, null, 2));
    } catch {
      setError('获取天气失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-accent text-center">🌤️ 天气查询</h1>

      {/* 搜索表单 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="输入城市名称..."
            className="flex-1 bg-surface border border-surfaceHighlight rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? '查询中...' : '查询'}
          </button>
        </div>
      </form>

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400 text-center">
          {error}
        </div>
      )}

      {/* 天气信息 */}
      {weatherData && (
        <div className="bg-surface border border-surfaceHighlight rounded-xl p-6 glow">
          {(() => {
            const weather = JSON.parse(weatherData);
            return (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">
                    {weather.weatherDesc?.toLowerCase().includes('sun') ? '☀️' :
                     weather.weatherDesc?.toLowerCase().includes('cloud') ? '☁️' :
                     weather.weatherDesc?.toLowerCase().includes('rain') ? '🌧️' :
                     weather.weatherDesc?.toLowerCase().includes('snow') ? '❄️' : '🌤️'}
                  </div>
                  <div className="text-4xl font-bold text-accent">{weather.temp}°C</div>
                  <div className="text-textSecondary">{weather.weatherDesc}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surfaceHighlight">
                  <div>
                    <span className="text-textSecondary text-sm">体感温度</span>
                    <div className="text-lg">{weather.feelsLike}°C</div>
                  </div>
                  <div>
                    <span className="text-textSecondary text-sm">湿度</span>
                    <div className="text-lg">{weather.humidity}%</div>
                  </div>
                  <div>
                    <span className="text-textSecondary text-sm">风向</span>
                    <div className="text-lg">{weather.windDir}</div>
                  </div>
                  <div>
                    <span className="text-textSecondary text-sm">风速</span>
                    <div className="text-lg">{weather.windSpeed} km/h</div>
                  </div>
                  <div>
                    <span className="text-textSecondary text-sm">气压</span>
                    <div className="text-lg">{weather.pressure} hPa</div>
                  </div>
                  <div>
                    <span className="text-textSecondary text-sm">能见度</span>
                    <div className="text-lg">{weather.visibility} km</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 默认提示 */}
      {!weatherData && !error && !loading && (
        <div className="text-center text-textSecondary py-12">
          <p>输入城市名称，获取实时天气信息</p>
          <p className="text-sm mt-2">支持中文和英文城市名</p>
        </div>
      )}
    </div>
  );
}
