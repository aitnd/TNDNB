import { NextResponse } from 'next/server';

// Toạ độ mặc định (Triệu Việt Vương, phường Hoa Lư, Ninh Bình)
const DEFAULT_LAT = 20.2539;
const DEFAULT_LON = 105.9079;

// Dữ liệu mock dự phòng mặc định (Ninh Bình)
const MOCK_WEATHER = {
  temp: 28,
  condition: "Nắng nhẹ",
  icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png",
  humidity: 78,
  advice: "Thời tiết đang mát mẻ, không mưa, bạn yên tâm học và ôn tập nhé! 🌸",
  location: "Triệu Việt Vương, Ninh Bình",
  isMock: true,
  forecast: {
    hourly: [
      { time: '17:00', temp: 29, condition: 'Nắng', icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png', rain_chance: 0 },
      { time: '18:00', temp: 28, condition: 'Có mây', icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png', rain_chance: 10 },
      { time: '19:00', temp: 27, condition: 'Trời trong', icon: 'https://cdn.weatherapi.com/weather/64x64/night/113.png', rain_chance: 0 },
      { time: '20:00', temp: 26, condition: 'Trời trong', icon: 'https://cdn.weatherapi.com/weather/64x64/night/113.png', rain_chance: 0 },
      { time: '21:00', temp: 25, condition: 'Có mây', icon: 'https://cdn.weatherapi.com/weather/64x64/night/116.png', rain_chance: 5 }
    ],
    daily: [
      { date: 'Hôm nay', minTemp: 25, maxTemp: 32, condition: 'Nắng nhẹ', icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png', rain_chance: 10 },
      { date: 'Ngày mai', minTemp: 26, maxTemp: 34, condition: 'Mưa dông', icon: 'https://cdn.weatherapi.com/weather/64x64/day/386.png', rain_chance: 80 },
      { date: 'Ngày mốt', minTemp: 24, maxTemp: 30, condition: 'Nhiều mây', icon: 'https://cdn.weatherapi.com/weather/64x64/day/119.png', rain_chance: 30 }
    ]
  }
};

// Hàm kiểm tra toạ độ hợp lệ
function isValidCoordinate(lat: any, lon: any): boolean {
  if (lat === null || lat === undefined || lon === null || lon === undefined) {
    return false;
  }
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (isNaN(latitude) || isNaN(longitude)) {
    return false;
  }
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return false;
  }
  return true;
}

// Hàm phân tích thời tiết và tạo lời khuyên bằng tiếng Việt
function getWeatherAdvice(temp: number, conditionText: string): string {
  const cond = conditionText.toLowerCase();

  if (
    cond.includes('mưa') ||
    cond.includes('dông') ||
    cond.includes('bão') ||
    cond.includes('drizzle') ||
    cond.includes('rain') ||
    cond.includes('storm')
  ) {
    return "Trời đang có mưa/sắp mưa rồi, bạn ra ngoài nhớ mang theo ô hoặc áo mưa nhé! 🌧️";
  }

  if (temp > 32) {
    return "Trời hôm nay khá nắng nóng đó, bạn nhớ uống nhiều nước để tỉnh táo ôn thi nhé! ☀️";
  }

  if (temp < 18) {
    return "Thời tiết hôm nay khá lạnh, bạn nhớ giữ ấm cổ để học tập thật tốt nhé! ❄️";
  }

  return "Thời tiết đang mát mẻ, không mưa, bạn yên tâm học và ôn tập nhé! 🌸";
}

// Hàm format icon URL
function formatIcon(icon: string) {
  if (icon && icon.startsWith('//')) {
    return `https:${icon}`;
  }
  return icon;
}

function getDynamicMockWeather(lat: number, lon: number) {
  let mockLocation = MOCK_WEATHER.location;
  let mockTemp = MOCK_WEATHER.temp;
  let mockCondition = MOCK_WEATHER.condition;
  let mockHumidity = MOCK_WEATHER.humidity;

  if (Math.abs(lat - 21.0285) < 0.1 && Math.abs(lon - 105.8542) < 0.1) {
    mockLocation = "Hà Nội (Mock)";
    mockTemp = 33.0; 
    mockCondition = "Trời nắng nóng";
    mockHumidity = 60;
  }

  const advice = getWeatherAdvice(mockTemp, mockCondition);
  
  const currentHour = new Date().getHours();
  const mockHourly = Array.from({ length: 8 }).map((_, i) => {
    const hour = (currentHour + i) % 24;
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    const isDay = hour >= 6 && hour <= 18;
    return {
      time: timeStr,
      temp: mockTemp - i,
      condition: isDay ? 'Nắng' : 'Trời trong',
      icon: isDay ? 'https://cdn.weatherapi.com/weather/64x64/day/113.png' : 'https://cdn.weatherapi.com/weather/64x64/night/113.png',
      rain_chance: i % 2 === 0 ? 0 : 10
    };
  });

  return {
    temp: mockTemp,
    condition: mockCondition,
    icon: MOCK_WEATHER.icon,
    humidity: mockHumidity,
    advice,
    location: mockLocation,
    isMock: true,
    forecast: {
      ...MOCK_WEATHER.forecast,
      hourly: mockHourly
    }
  };
}

export async function POST(request: Request) {
  try {
    let lat = DEFAULT_LAT;
    let lon = DEFAULT_LON;

    // Đọc body từ request
    try {
      const body = await request.json();
      if (body) {
        if (isValidCoordinate(body.lat, body.lon)) {
          lat = Number(body.lat);
          lon = Number(body.lon);
        }
      }
    } catch (e) {
      // Body trống hoặc không có JSON hợp lệ
    }

    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_weather_api_key_here') {
      return NextResponse.json(getDynamicMockWeather(lat, lon));
    }

    try {
      const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&lang=vi`;
      const response = await fetch(apiUrl, {
        next: { revalidate: 600 } 
      });

      if (!response.ok) {
        throw new Error(`Weather API phản hồi lỗi với mã trạng thái: ${response.status}`);
      }

      const data = await response.json();

      const temp = data.current.temp_c;
      const conditionText = data.current.condition.text;
      let icon = formatIcon(data.current.condition.icon);
      const humidity = data.current.humidity;
      const location = data.location.name;

      const advice = getWeatherAdvice(temp, conditionText);

      // Parse forecast
      let hourly: any[] = [];
      let daily: any[] = [];

      if (data.forecast && data.forecast.forecastday) {
        // Daily
        daily = data.forecast.forecastday.map((dayData: any, index: number) => {
          let dateLabel = '';
          if (index === 0) dateLabel = 'Hôm nay';
          else if (index === 1) dateLabel = 'Ngày mai';
          else if (index === 2) dateLabel = 'Ngày mốt';
          else {
            const d = new Date(dayData.date);
            dateLabel = d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
          }

          return {
            date: dateLabel,
            minTemp: dayData.day.mintemp_c,
            maxTemp: dayData.day.maxtemp_c,
            condition: dayData.day.condition.text,
            icon: formatIcon(dayData.day.condition.icon),
            rain_chance: dayData.day.daily_chance_of_rain
          };
        });

        // Hourly
        const allHours = [];
        for (const day of data.forecast.forecastday) {
          if (day.hour && Array.isArray(day.hour)) {
            allHours.push(...day.hour);
          }
        }
        
        const nowEpoch = Math.floor(Date.now() / 1000);
        // Lấy 8 giờ tiếp theo
        const futureHours = allHours.filter((h) => h.time_epoch >= nowEpoch).slice(0, 8);
        
        hourly = futureHours.map((h) => {
          const tDate = new Date(h.time_epoch * 1000);
          return {
            time: `${tDate.getHours().toString().padStart(2, '0')}:00`,
            temp: h.temp_c,
            condition: h.condition.text,
            icon: formatIcon(h.condition.icon),
            rain_chance: h.chance_of_rain
          };
        });
      }

      return NextResponse.json({
        temp,
        condition: conditionText,
        icon,
        humidity,
        advice,
        location,
        isMock: false,
        forecast: {
          hourly,
          daily
        }
      });

    } catch (apiError) {
      console.error("Lỗi API Weather, sử dụng mock:", apiError);
      return NextResponse.json(getDynamicMockWeather(lat, lon));
    }

  } catch (globalError: any) {
    console.error("Lỗi hệ thống API Weather:", globalError);
    return NextResponse.json(getDynamicMockWeather(DEFAULT_LAT, DEFAULT_LON));
  }
}
