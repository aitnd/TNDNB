import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Loader2, MapPin, ChevronDown, Droplets } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface WeatherData {
  temp?: number;
  location?: string;
  advice?: string;
  condition?: string;
  icon?: string;
  forecast?: {
    hourly: Array<{ time: string, temp: number, condition: string, icon: string, rain_chance: number }>;
    daily: Array<{ date: string, minTemp: number, maxTemp: number, condition: string, icon: string, rain_chance: number }>;
  };
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchWeather = async (lat?: number, lon?: number) => {
      try {
        const body = lat && lon ? { lat, lon } : {};
        const response = await fetch('/api/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
           throw new Error('Weather API error');
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation denied or failed, using fallback.', error);
          fetchWeather();
        }
      );
    } else {
      fetchWeather();
    }
  }, []);

  if (loading) {
    return (
      <div className={`w-full max-w-7xl mx-auto py-3 px-5 rounded-2xl flex items-center justify-center space-x-3 backdrop-blur-xl border shadow-sm ${theme === 'dark' ? 'bg-gray-900/60 border-gray-700/50 text-gray-300' : 'bg-white/80 border-white/60 text-gray-600'}`}>
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Đang đồng bộ thời tiết...</span>
      </div>
    );
  }

  if (!weather) return null;

  const renderIcon = () => {
    if (weather.icon) {
      return <img src={weather.icon} alt={weather.condition} className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md" loading="lazy" />;
    }
    const condition = weather.condition?.toLowerCase() || 'sun';
    if (condition.includes('rain') || condition.includes('mưa')) return <CloudRain className="w-10 h-10 text-blue-500 drop-shadow-md" />;
    if (condition.includes('cloud') || condition.includes('mây')) return <Cloud className="w-10 h-10 text-gray-400 drop-shadow-md" />;
    return <Sun className="w-10 h-10 text-yellow-500 drop-shadow-md" />;
  };

  const bgClass = theme === 'dark' 
    ? 'bg-gray-900/70 backdrop-blur-2xl border-gray-700/50 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]' 
    : 'bg-white/80 backdrop-blur-2xl border-white/60 text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

  return (
    <div className={`w-full max-w-7xl mx-auto rounded-3xl border transition-all duration-300 overflow-hidden ${bgClass}`}>
      {/* Header Compact - Click to Expand */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 md:p-4 cursor-pointer relative flex flex-col md:flex-row md:items-center justify-between group"
      >
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3 md:space-x-4">
            {renderIcon()}
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl md:text-4xl font-black tracking-tighter">{weather.temp}°</span>
                <span className="text-xs md:text-sm font-medium opacity-80 hidden sm:inline-block">{weather.condition}</span>
              </div>
              <div className="flex items-center text-[11px] md:text-xs opacity-70 font-semibold uppercase tracking-wider mt-0.5">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate max-w-[150px] sm:max-w-xs">{weather.location}</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Chevron */}
          <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/10">
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
              <ChevronDown className="w-5 h-5 opacity-70" />
            </motion.div>
          </div>
        </div>
        
        {/* Advice Text */}
        <div className="mt-3 md:mt-0 flex-1 md:px-8 flex items-center justify-start md:justify-end">
          <div className={`text-sm font-medium italic ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'} border-l-2 md:border-l-0 md:border-r-2 ${theme === 'dark' ? 'border-blue-400/30' : 'border-blue-500/30'} pl-3 md:pl-0 md:pr-4 py-0.5 max-w-md`}>
            {weather.advice}
          </div>
        </div>

        {/* Desktop Chevron */}
        <div className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 ml-2 group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-colors">
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
            <ChevronDown className="w-5 h-5 opacity-70" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Detail View */}
      <AnimatePresence>
        {isExpanded && weather.forecast && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}
          >
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* Hourly Forecast */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider opacity-50">Dự báo 24 giờ tới</h4>
                </div>
                <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {weather.forecast.hourly.map((hour, idx) => (
                    <div key={idx} className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[76px] transition-all ${theme === 'dark' ? 'bg-gray-800/60 hover:bg-gray-700/80' : 'bg-gray-50 hover:bg-gray-100'} border ${theme === 'dark' ? 'border-gray-700/30' : 'border-gray-200/50'}`}>
                      <span className="text-xs font-semibold opacity-70 mb-2">{hour.time}</span>
                      <img src={hour.icon} className="w-8 h-8 drop-shadow-sm" alt="icon" loading="lazy" />
                      <span className="text-base font-black mt-2">{Math.round(hour.temp)}°</span>
                      {hour.rain_chance > 0 ? (
                        <span className="text-[10px] text-blue-500 font-bold mt-1.5 flex items-center bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                          <Droplets className="w-2.5 h-2.5 mr-0.5" />
                          {hour.rain_chance}%
                        </span>
                      ) : (
                        <span className="h-5 mt-1.5"></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Forecast */}
              <div className={`rounded-3xl p-5 ${theme === 'dark' ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Dự báo 3 ngày tới</h4>
                <div className="flex flex-col space-y-4">
                  {weather.forecast.daily.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="w-24 text-sm font-bold opacity-90">{day.date}</span>
                      <div className="flex items-center space-x-2 flex-1 justify-center">
                        {day.rain_chance > 0 && (
                          <span className="text-[11px] text-blue-500 font-bold flex items-center w-12 bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                            <Droplets className="w-3 h-3 mr-0.5" />
                            {day.rain_chance}%
                          </span>
                        )}
                        {!day.rain_chance && <span className="w-12"></span>}
                        <img src={day.icon} className="w-8 h-8 drop-shadow-sm" alt="icon" loading="lazy" />
                      </div>
                      <div className="flex items-center w-28 justify-end space-x-2 text-sm font-bold">
                        <span className="opacity-50 w-6 text-right">{Math.round(day.minTemp)}°</span>
                        <div className={`w-10 h-1.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden relative`}>
                          <div className={`absolute inset-y-0 left-0 w-full opacity-80 rounded-full ${theme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-yellow-500' : 'bg-gradient-to-r from-blue-400 to-orange-400'}`}></div>
                        </div>
                        <span className="w-6 text-right">{Math.round(day.maxTemp)}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherWidget;
