// Configuration for Google Sheets Dashboard
// ==================================================

// Replace with your actual values
const CONFIG = {
    // Your Google Sheet ID (from the URL)
    // Format: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
    SHEET_ID: '1Q3HeIT5FJr5IdiJWjMoMzr9AIqzc2RzdFDN8-40yJgk',
    
    // Your Google API Key
    // Get one from: https://console.cloud.google.com/
    // 1. Create a project
    // 2. Enable Google Sheets API
    // 3. Create an API key in Credentials
    API_KEY: 'YOUR_API_KEY_HERE',
    
    // Sheet name and range to fetch
    // Examples: 'Sheet1', 'Sheet1!A1:Z100', 'Data!A:F'
    SHEET_RANGE: 'Sheet1',
    
    // Refresh interval in milliseconds (15 seconds by default)
    REFRESH_INTERVAL: 15000
};

// Note: For public sheets, you only need the SHEET_ID and API_KEY
// For private sheets, you'll need to implement OAuth 2.0 authentication
