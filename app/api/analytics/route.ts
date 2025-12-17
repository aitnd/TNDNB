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
        const { dateRange = '7d' } = body;
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
