require('dotenv').config({ path: '.env.local' });
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');
const path = require('path');

async function testConnection() {

    const keyFilePath = path.join(__dirname, 'google-credentials.json');
    let clientConfig = {};

    if (fs.existsSync(keyFilePath)) {
        clientConfig = { keyFilename: keyFilePath };

        // Read property ID from file if possible, or fallback to env
        try {
            const keyContent = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
        } catch (e) {
            console.error("Error reading JSON key file:", e.message);
        }

    } else {
        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null;

        if (!email || !privateKey) {
            console.error("ERROR: Missing environment variables (GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY).");
            return;
        }
        clientConfig = {
            credentials: {
                client_email: email,
                private_key: privateKey,
            },
        };
    }

    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '512039111';

    try {
        const analyticsDataClient = new BetaAnalyticsDataClient(clientConfig);

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
        });


    } catch (error) {
        console.error("\nCONNECTION FAILED:");
        console.error(error.message);
    }
}

testConnection();
