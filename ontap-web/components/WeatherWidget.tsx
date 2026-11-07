import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Loader2, MapPin, ChevronDown, Droplets, Sparkles, Signal, SignalLow, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeatherData {
  temp?: number;
  location?: string;
  advice?: string;
  condition?: string;
  icon?: string;
  isMock?: boolean;
  forecast?: {
    hourly: Array<{ time: string, temp: number, condition: string, icon: string, rain_chance: number }>;
    daily: Array<{ date: string, minTemp: number, maxTemp: number, condition: string, icon: string, rain_chance: number }>;
  };
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dataSource, setDataSource] = useState<'live' | 'server-mock' | 'offline'>('live');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchWeather = async (lat?: number, lon?: number) => {
      try {
        const body = lat && lon ? { lat, lon } : {};
        const apiBase = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.protocol === 'file:'))
          ? 'https://daotaothuyenvien.com' 
          : '';
        const response = await fetch(`${apiBase}/api/weather`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
           throw new Error('Weather API error');
        }
        const data = await response.json();
        setWeather(data);
        setDataSource(data.isMock ? 'server-mock' : 'live');
      } catch (error) {
        console.warn('Failed to fetch weather, using mock fallback:', error);
        
        const currentHour = new Date().getHours();
        const mockHourly = Array.from({ length: 8 }).map((_, i) => {
          const hour = (currentHour + i) % 24;
          const timeStr = `${hour.toString().padStart(2, '0')}:00`;
          const isDay = hour >= 6 && hour <= 18;
          return {
            time: timeStr,
            temp: 29 - i,
            condition: isDay ? 'Nắng' : 'Trời trong',
            icon: isDay ? 'https://cdn.weatherapi.com/weather/64x64/day/113.png' : 'https://cdn.weatherapi.com/weather/64x64/night/113.png',
            rain_chance: i % 2 === 0 ? 0 : 10
          };
        });

        setWeather({
          temp: 28,
          condition: "Nắng nhẹ",
          icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png",
          advice: "Thời tiết đang mát mẻ, không mưa, bạn yên tâm học và ôn tập nhé! 🌸",
          location: "Triệu Việt Vương, Ninh Bình",
          isMock: true,
          forecast: {
            hourly: mockHourly,
            daily: [
              { date: 'Hôm nay', minTemp: 25, maxTemp: 32, condition: 'Nắng nhẹ', icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png', rain_chance: 10 },
              { date: 'Ngày mai', minTemp: 26, maxTemp: 34, condition: 'Mưa dông', icon: 'https://cdn.weatherapi.com/weather/64x64/day/386.png', rain_chance: 80 },
              { date: 'Ngày mốt', minTemp: 24, maxTemp: 30, condition: 'Nhiều mây', icon: 'https://cdn.weatherapi.com/weather/64x64/day/119.png', rain_chance: 30 }
            ]
          }
        });
        setDataSource('offline');
      } finally {
        setLoading(false);
      }
    };

    // Tắt tự động gọi navigator.geolocation khi mount trang để tránh popup xin quyền phiền toái
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-3 px-5 rounded-2xl flex items-center justify-center space-x-3 bg-card/90 backdrop-blur-md border border-border text-muted-foreground shadow-sm">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-sm font-medium">Đang đồng bộ thời tiết...</span>
      </div>
    );
  }

  if (!weather) return null;

  const getAdviceIcon = () => {
    const text = weather.advice?.toLowerCase() || '';
    if (text.includes('mưa') || text.includes('rain')) return <CloudRain className="w-5 h-5 flex-shrink-0 text-blue-500" />;
    if (text.includes('nắng') || text.includes('sun')) return <Sun className="w-5 h-5 flex-shrink-0 text-amber-500" />;
    return <Sparkles className="w-5 h-5 flex-shrink-0 text-sky-500" />;
  };

  const getAdviceStyle = () => {
    const text = weather.advice?.toLowerCase() || '';
    if (text.includes('mưa') || text.includes('rain')) {
      return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400';
    }
    if (text.includes('nắng') || text.includes('sun')) {
      return 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400';
    }
    return 'bg-muted/50 border-border text-foreground';
  };

  const renderIcon = () => {
    if (weather.icon) {
      return <img src={weather.icon} alt={weather.condition} className="w-8 h-8 md:w-9 md:h-9 drop-shadow-md" loading="lazy" />;
    }
    const condition = weather.condition?.toLowerCase() || 'sun';
    if (condition.includes('rain') || condition.includes('mưa')) return <CloudRain className="w-8 h-8 text-blue-500 drop-shadow-md" />;
    if (condition.includes('cloud') || condition.includes('mây')) return <Cloud className="w-8 h-8 text-muted-foreground drop-shadow-md" />;
    return <Sun className="w-8 h-8 text-amber-500 drop-shadow-md" />;
  };

  const renderStatusIndicator = () => {
    const config = {
      'live': {
        icon: <Signal className="w-3 h-3" />,
        color: 'text-emerald-500',
        pulse: true,
        label: 'Dữ liệu trực tiếp',
        detail: 'từ WeatherAPI'
      },
      'server-mock': {
        icon: <SignalLow className="w-3 h-3" />,
        color: 'text-amber-500',
        pulse: false,
        label: 'Dữ liệu ước tính',
        detail: 'Hệ thống AI dự báo'
      },
      'offline': {
        icon: <WifiOff className="w-3 h-3" />,
        color: 'text-destructive',
        pulse: false,
        label: 'Không kết nối',
        detail: 'Dữ liệu tạm thời'
      }
    }[dataSource];

    return (
      <div className="relative" onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
           onMouseEnter={() => setShowTooltip(true)}
           onMouseLeave={() => setShowTooltip(false)}>
        <div className={`flex items-center justify-center bg-card rounded-full p-[3px] shadow-sm border border-border ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}>
          {config.icon}
        </div>
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[60] w-[130px] bg-card border border-border shadow-xl rounded-lg p-2 flex flex-col items-center pointer-events-none"
            >
              <div className="text-[10px] font-bold text-foreground whitespace-nowrap">{config.label}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight text-center">{config.detail}</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-card"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const bgClass = 'bg-card/95 backdrop-blur-md border border-border text-card-foreground shadow-sm';

  return (
    <div className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden ${bgClass}`}>
      {/* Header Compact - Click to Expand */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3 py-2 md:px-4 md:py-2 cursor-pointer relative flex flex-row items-center justify-between group gap-2"
      >
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative">
              {renderIcon()}
              <div className="absolute -bottom-1 -right-1">
                {renderStatusIndicator()}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl md:text-3xl font-black tracking-tighter tabular-nums">{weather.temp}°</span>
                <span className="text-xs font-semibold opacity-80 hidden sm:inline-block">{weather.condition}</span>
              </div>
              <div className="flex items-center text-[10px] md:text-xs opacity-70 font-medium uppercase tracking-wider">
                <MapPin className="w-3 h-3 mr-0.5" />
                <span className="truncate max-w-[130px] sm:max-w-xs">{weather.location}</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Chevron */}
          <div className="md:hidden flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground">
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
              <ChevronDown className="w-4 h-4 opacity-70" />
            </motion.div>
          </div>
        </div>
        
        {/* Advice Text - Truncated on desktop */}
        <div className="hidden lg:flex flex-1 px-4 items-center justify-end">
          <div className="text-xs font-medium text-primary/80 border-r-2 border-primary/20 pr-3 py-0.5 truncate max-w-sm">
            {weather.advice}
          </div>
        </div>

        {/* Desktop Chevron */}
        <div className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground ml-1 group-hover:bg-muted/80 transition-colors">
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
            <ChevronDown className="w-4 h-4 opacity-70" />
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
            className="border-t border-border"
          >
            <div className="p-4 md:p-6">
              {/* Lời khuyên thiết kế chuyên nghiệp không dùng emoji */}
              {weather.advice && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 border ${getAdviceStyle()}`}>
                  {getAdviceIcon()}
                  <span className="text-xs md:text-sm font-medium leading-relaxed">
                    {weather.advice.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim()}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Hourly Forecast */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider opacity-50">Dự báo 24 giờ tới</h4>
                  </div>
                  <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {weather.forecast.hourly.map((hour, idx) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl min-w-[78px] transition-colors bg-muted/40 hover:bg-muted/70 border border-border text-foreground"
                      >
                        <span className="text-xs font-semibold opacity-60 mb-2 font-mono tabular-nums">{hour.time}</span>
                        <img src={hour.icon} className="w-8 h-8 drop-shadow-sm" alt="icon" loading="lazy" />
                        <span className="text-base font-black mt-2 tracking-tighter tabular-nums">{Math.round(hour.temp)}°</span>
                        {hour.rain_chance > 0 ? (
                          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold mt-1.5 flex items-center bg-sky-500/10 px-1.5 py-0.5 rounded-md tabular-nums">
                            <Droplets className="w-2.5 h-2.5 mr-0.5" />
                            {hour.rain_chance}%
                          </span>
                        ) : (
                          <span className="h-5 mt-1.5"></span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

              {/* Daily Forecast */}
              <div className="rounded-3xl p-5 bg-muted/40 border border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">Dự báo 3 ngày tới</h4>
                <div className="flex flex-col space-y-4">
                  {weather.forecast.daily.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="w-24 text-sm font-bold opacity-90">{day.date}</span>
                      <div className="flex items-center space-x-2 flex-1 justify-center">
                        {day.rain_chance > 0 && (
                          <span className="text-[11px] text-blue-500 font-bold flex items-center w-12 bg-blue-500/10 px-1.5 py-0.5 rounded-md tabular-nums">
                            <Droplets className="w-3 h-3 mr-0.5" />
                            {day.rain_chance}%
                          </span>
                        )}
                        {!day.rain_chance && <span className="w-12"></span>}
                        <img src={day.icon} className="w-8 h-8 drop-shadow-sm" alt="icon" loading="lazy" />
                      </div>
                      <div className="flex items-center w-28 justify-end space-x-2 text-sm font-bold">
                        <span className="opacity-70 w-6 text-right tabular-nums">{Math.round(day.minTemp)}°</span>
                        <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden relative">
                          <div className="absolute inset-y-0 left-0 w-full opacity-80 rounded-full bg-gradient-to-r from-blue-500 to-amber-500"></div>
                        </div>
                        <span className="w-6 text-right tabular-nums">{Math.round(day.maxTemp)}°</span>
                      </div>
                    </div>
                  ))}
                </div>
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
