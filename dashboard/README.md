# 📊 Web Dashboard - Google Sheets Integration

A modern, responsive web-based dashboard that displays data from your Google Sheets in real-time.

## Features

✨ **Real-time Data**: Fetches data directly from Google Sheets API
📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
🔍 **Search & Filter**: Built-in search functionality to filter table data
📈 **Analytics**: Charts and statistics visualization
🎨 **Modern UI**: Clean, intuitive interface with smooth animations
⚡ **Fast Loading**: Optimized performance with minimal dependencies

## Setup Instructions

### Step 1: Get Your Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** (or select an existing one)
3. Go to **APIs & Services** → **Library**
4. Search for **"Google Sheets API"** and click **Enable**
5. Go to **APIs & Services** → **Credentials**
6. Click **"+ Create Credentials"** → **API Key**
7. Copy your API Key

### Step 2: Make Your Google Sheet Public (if needed)

1. Open your Google Sheet
2. Click **Share** (top right)
3. Change to **"Anyone with the link"** or set specific permissions
4. Get your **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

### Step 3: Configure the Dashboard

1. Open `dashboard/config.js`
2. Replace the following values:
   ```javascript
   const CONFIG = {
       SHEET_ID: '1Q3HeIT5FJr5IdiJWjMoMzr9AIqzc2RzdFDN8-40yJgk',  // ✓ Already set
       API_KEY: 'YOUR_API_KEY_HERE',  // ← Paste your API key here
       SHEET_RANGE: 'Sheet1',  // Optional: adjust sheet name/range
       REFRESH_INTERVAL: 15000  // Optional: auto-refresh interval (ms)
   };
   ```

### Step 4: Deploy

#### Option A: GitHub Pages (Recommended)
1. Push to your repository's `main` or `gh-pages` branch
2. Go to **Settings** → **Pages**
3. Select the source branch
4. Your dashboard will be available at: `https://username.github.io/repo-name/dashboard/`

#### Option B: Local Testing
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then open: http://localhost:8000/dashboard/
```

#### Option C: Web Hosting
Upload the `dashboard/` folder to any web hosting service (Vercel, Netlify, etc.)

## File Structure

```
dashboard/
├── index.html      # Main HTML structure
├── styles.css      # Dashboard styling
├── app.js          # Main application logic
├── config.js       # Configuration file (API key, sheet ID)
└── README.md       # This file
```

## Customization

### Change Chart Type
In `app.js`, modify the `updateChart()` method:
```javascript
this.chart = new Chart(ctx, {
    type: 'bar',  // 'bar', 'line', 'pie', 'doughnut', etc.
    // ...
});
```

### Adjust Table Display
Modify `SHEET_RANGE` in `config.js`:
```javascript
SHEET_RANGE: 'Sheet1!A1:F100',  // Specific range
SHEET_RANGE: 'Data!A:Z',         // Entire columns A-Z
```

### Enable Auto-Refresh
Uncomment in `app.js`:
```javascript
setupAutoRefresh() {
    setInterval(() => this.loadData(), this.config.REFRESH_INTERVAL);
}
```

## Troubleshooting

### "API key is invalid or missing"
- Make sure you've set `API_KEY` in `config.js`
- Check that Google Sheets API is enabled in Cloud Console

### "Sheet not found"
- Verify your `SHEET_ID` is correct
- Make sure the sheet is publicly accessible (or OAuth is configured)

### No data appearing
- Check that your `SHEET_RANGE` matches your actual data
- Ensure there's data in the specified cells
- Check browser console (F12) for errors

### CORS errors
- This is expected when using a public Google Sheets API key
- The API key should still work for fetching public sheet data
- For private sheets, implement OAuth 2.0

## API Limits

- **Free tier**: 500 requests per 100 seconds per user
- For production use, set up billing in Google Cloud Console

## Privacy & Security

⚠️ **Warning**: Never commit your API key to version control
- Add `config.js` to `.gitignore` if it contains real API keys
- For production, use environment variables or server-side proxies
- Consider using OAuth 2.0 for private/sensitive data

## Support & Resources

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Chart.js Documentation](https://www.chartjs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Happy dashboarding! 🚀**
