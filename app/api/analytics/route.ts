import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Initialize Client
import fs from 'fs';
import path from 'path';

const keyFilePath = path.join(process.cwd(), 'google-credentials.json');
let clientConfig = {};

if (fs.existsSync(keyFilePath)) {
    clientConfig = { keyFilename: keyFilePath };
} else {
    clientConfig = {
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        },
    };
}

const analyticsDataClient = new BetaAnalyticsDataClient(clientConfig);

const PROPERTY_ID = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '512039111';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { dateRange = '7d', realtime = false } = body;

        const hasCredentials = fs.existsSync(keyFilePath) || (!!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && !!process.env.GOOGLE_PRIVATE_KEY);
        
        if (!hasCredentials) {
            if (realtime) {
                return NextResponse.json({ activeUsers: Math.floor(Math.random() * 15) + 3, isMock: true });
            }

            const mockChartData = [];
            const days = dateRange === 'today' ? 24 : (dateRange === '30d' ? 30 : 7);
            const now = new Date();
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(now);
                if (dateRange === 'today') {
                    mockChartData.push({
                        name: `${i}h`,
                        visits: Math.floor(Math.random() * 50) + 10,
                        users: Math.floor(Math.random() * 40) + 5
                    });
                } else {
                    d.setDate(now.getDate() - i);
                    const dayStr = String(d.getDate()).padStart(2, '0');
                    const monthStr = String(d.getMonth() + 1).padStart(2, '0');
                    mockChartData.push({
                        name: `${dayStr}/${monthStr}`,
                        visits: Math.floor(Math.random() * 200) + 50,
                        users: Math.floor(Math.random() * 150) + 30
                    });
                }
            }

            const metrics = {
                newUsers: dateRange === 'today' ? 45 : (dateRange === '30d' ? 850 : 210),
                avgSessionDuration: 184, // 3m 4s
                totalSessions: dateRange === 'today' ? 120 : (dateRange === '30d' ? 2400 : 640),
                bounceRate: 42.5
            };

            const topPages = [
                { name: "Trang chủ - Ôn thi đường thủy", value: dateRange === 'today' ? 150 : (dateRange === '30d' ? 3200 : 780) },
                { name: "Thi thử lý thuyết máy trưởng", value: dateRange === 'today' ? 95 : (dateRange === '30d' ? 2100 : 540) },
                { name: "Câu hỏi trắc nghiệm luật giao thông", value: dateRange === 'today' ? 70 : (dateRange === '30d' ? 1500 : 380) },
                { name: "Quản lý lớp học ôn thi", value: dateRange === 'today' ? 40 : (dateRange === '30d' ? 800 : 210) },
                { name: "Học phí và đăng ký khóa học", value: dateRange === 'today' ? 25 : (dateRange === '30d' ? 450 : 120) }
            ];

            const devices = [
                { name: "Mobile", value: dateRange === 'today' ? 80 : (dateRange === '30d' ? 1680 : 420) },
                { name: "Desktop", value: dateRange === 'today' ? 35 : (dateRange === '30d' ? 620 : 190) },
                { name: "Tablet", value: dateRange === 'today' ? 5 : (dateRange === '30d' ? 100 : 30) }
            ];

            const cities = [
                { name: "Hồ Chí Minh", value: dateRange === 'today' ? 45 : (dateRange === '30d' ? 920 : 240) },
                { name: "Hà Nội", value: dateRange === 'today' ? 38 : (dateRange === '30d' ? 810 : 210) },
                { name: "Hải Phòng", value: dateRange === 'today' ? 15 : (dateRange === '30d' ? 320 : 85) },
                { name: "Cần Thơ", value: dateRange === 'today' ? 12 : (dateRange === '30d' ? 220 : 60) },
                { name: "Đà Nẵng", value: dateRange === 'today' ? 10 : (dateRange === '30d' ? 130 : 45) }
            ];

            return NextResponse.json({ chart: mockChartData, metrics, topPages, devices, cities, isMock: true });
        }

        // 0. Realtime Report (Active Users Right Now)
        if (realtime) {
            const [response] = await analyticsDataClient.runRealtimeReport({
                property: `properties/${PROPERTY_ID}`,
                metrics: [{ name: 'activeUsers' }]
            });
            const activeUsers = response.rows && response.rows.length > 0
                ? parseInt(response.rows[0].metricValues?.[0]?.value ?? '0')
                : 0;
            return NextResponse.json({ activeUsers });
        }

        let startDate = '7daysAgo';

        if (dateRange === '30d') startDate = '30daysAgo';
        if (dateRange === 'today') startDate = 'today';

        // 1. Run Report for Chart (Sessions by Date)
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: startDate,
                    endDate: 'today',
                },
            ],
            dimensions: [
                {
                    name: dateRange === 'today' ? 'hour' : 'date',
                },
            ],
            metrics: [
                {
                    name: 'sessions',
                },
                {
                    name: 'activeUsers',
                },
            ],
            orderBys: [
                {
                    dimension: {
                        orderType: 'ALPHANUMERIC',
                        dimensionName: dateRange === 'today' ? 'hour' : 'date',
                    },
                },
            ],
        });

        // 2. Run Report for Key Metrics (Totals)
        const [metricsResponse] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: startDate,
                    endDate: 'today',
                },
            ],
            metrics: [
                { name: 'newUsers' },
                { name: 'averageSessionDuration' },
                { name: 'sessions' },
                { name: 'bounceRate' }
            ]
        });

        // Process Chart Data
        const chartData = response.rows ? response.rows.map((row: any) => {
            let name = row.dimensionValues[0].value;
            // Format date if needed (YYYYMMDD -> DD/MM)
            if (dateRange !== 'today' && name.length === 8) {
                const day = name.substring(6, 8);
                const month = name.substring(4, 6);
                name = `${day}/${month}`;
            } else if (dateRange === 'today') {
                name = `${name}h`;
            }
            return {
                name,
                visits: parseInt(row.metricValues[0].value ?? '0'),
                users: parseInt(row.metricValues[1].value ?? '0')
            };
        }) : [];

        // Process Metrics Data
        const mValues = metricsResponse.rows && metricsResponse.rows[0] ? metricsResponse.rows[0].metricValues : null;

        let metrics = {
            newUsers: 0,
            avgSessionDuration: 0,
            totalSessions: 0,
            bounceRate: 0
        };

        if (mValues) {
            metrics = {
                newUsers: parseInt(mValues[0].value ?? '0'),
                avgSessionDuration: parseFloat(mValues[1].value ?? '0'),
                totalSessions: parseInt(mValues[2].value ?? '0'),
                bounceRate: parseFloat(mValues[3].value ?? '0') * 100 // rate is 0-1
            };
        }

        // 3. Top Pages
        const [pagesResponse] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'pageTitle' }],
            metrics: [{ name: 'screenPageViews' }],
            limit: 10,
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
        });

        // 4. Devices
        const [devicesResponse] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'activeUsers' }]
        });

        // 5. Cities
        const [citiesResponse] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'city' }],
            metrics: [{ name: 'activeUsers' }],
            limit: 10,
            orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
        });

        const topPages = pagesResponse.rows ? pagesResponse.rows.map((row: any) => ({
            name: row.dimensionValues[0].value,
            value: parseInt(row.metricValues[0].value ?? '0')
        })) : [];

        const devices = devicesResponse.rows ? devicesResponse.rows.map((row: any) => ({
            name: row.dimensionValues[0].value,
            value: parseInt(row.metricValues[0].value ?? '0')
        })) : [];

        const cities = citiesResponse.rows ? citiesResponse.rows.map((row: any) => ({
            name: row.dimensionValues[0].value,
            value: parseInt(row.metricValues[0].value ?? '0')
        })) : [];

        return NextResponse.json({ chart: chartData, metrics, topPages, devices, cities });

    } catch (error: any) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
