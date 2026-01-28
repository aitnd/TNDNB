require('dotenv').config({ path: '.env.local' });
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');
const path = require('path');

async function testConnection() {
    console.log("Testing Google Analytics Connection...");

    const keyFilePath = path.join(__dirname, 'google-credentials.json');
    let clientConfig = {};

    if (fs.existsSync(keyFilePath)) {
        console.log("Found 'google-credentials.json'. Using it for authentication.");
        clientConfig = { keyFilename: keyFilePath };

        // Read property ID from file if possible, or fallback to env
        try {
            const keyContent = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
            console.log("Service Account Email in file:", keyContent.client_email);
        } catch (e) {
            console.error("Error reading JSON key file:", e.message);
        }

    } else {
        console.log("No JSON key file found. Using .env.local variables.");
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
    console.log("Target Property ID:", propertyId);

    try {
        const analyticsDataClient = new BetaAnalyticsDataClient(clientConfig);

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
        });

        console.log("\nSUCCESS! Connection established.");
        console.log("Active Users (7 days):", response.rows && response.rows[0] ? response.rows[0].metricValues[0].value : 0);

    } catch (error) {
        console.error("\nCONNECTION FAILED:");
        console.error(error.message);
        console.log("\nTROUBLESHOOTING:");
        console.log("1. If using JSON file, ensure it is the correct file downloaded from Google Cloud Console.");
        console.log("2. If using .env, check if Private Key is copied correctly.");
        console.log("3. Ensure Service Account has 'Viewer' role on Property ID:", propertyId);
    }
}

testConnection();
