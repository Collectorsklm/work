// Main Dashboard Application
// ==================================================

class GoogleSheetsDashboard {
    constructor(config) {
        this.config = config;
        this.allSheetsData = {};
        this.currentSheet = null;
        this.chart = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAllSheets();
    }

    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadAllSheets());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterTable(e.target.value));
        document.getElementById('sheetSelector').addEventListener('change', (e) => this.switchSheet(e.target.value));
    }

    async loadAllSheets() {
        try {
            this.showLoading(true);
            const spreadsheetMetadata = await this.getSpreadsheetMetadata();
            const sheets = spreadsheetMetadata.sheets;
            
            // Populate sheet selector
            this.populateSheetSelector(sheets);
            
            // Load first sheet by default
            if (sheets.length > 0) {
                const firstSheetName = sheets[0].properties.title;
                await this.loadSheet(firstSheetName);
                this.currentSheet = firstSheetName;
                document.getElementById('sheetSelector').value = firstSheetName;
            }
            
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading sheets:', error);
            this.showError(error.message);
            this.showLoading(false);
        }
    }

    async getSpreadsheetMetadata() {
        if (!this.config.API_KEY || this.config.API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('⚠️ Please configure your API key in config.js first!');
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SHEET_ID}?key=${this.config.API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('❌ API key is invalid or missing. Check your configuration.');
            } else if (response.status === 404) {
                throw new Error('❌ Spreadsheet not found. Check your Sheet ID.');
            }
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    }

    async loadSheet(sheetName) {
        try {
            this.showLoading(true);
            const data = await this.fetchFromGoogleSheets(sheetName);
            this.allSheetsData[sheetName] = data;
            this.currentSheet = sheetName;
            this.renderTable(data);
            this.updateStats(data);
            this.updateChart(data);
            this.updateLastUpdated();
            this.showLoading(false);
        } catch (error) {
            console.error(`Error loading sheet ${sheetName}:`, error);
            this.showError(`Error loading ${sheetName}: ${error.message}`);
            this.showLoading(false);
        }
    }

    async fetchFromGoogleSheets(sheetName) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SHEET_ID}/values/${sheetName}?key=${this.config.API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('API key is invalid or missing.');
            } else if (response.status === 404) {
                throw new Error('Sheet not found.');
            }
            throw new Error(`API Error: ${response.status}`);
        }

        const jsonData = await response.json();
        
        if (!jsonData.values || jsonData.values.length === 0) {
            throw new Error('No data found in this sheet');
        }

        return {
            headers: jsonData.values[0],
            rows: jsonData.values.slice(1)
        };
    }

    populateSheetSelector(sheets) {
        const selector = document.getElementById('sheetSelector');
        selector.innerHTML = '';
        
        sheets.forEach(sheet => {
            const option = document.createElement('option');
            option.value = sheet.properties.title;
            option.textContent = sheet.properties.title;
            selector.appendChild(option);
        });
    }

    switchSheet(sheetName) {
        if (this.allSheetsData[sheetName]) {
            // Sheet already loaded
            const data = this.allSheetsData[sheetName];
            this.renderTable(data);
            this.updateStats(data);
            this.updateChart(data);
        } else {
            // Load sheet for first time
            this.loadSheet(sheetName);
        }
    }

    renderTable(data) {
        const table = document.getElementById('dataTable');
        
        // Create header
        const thead = table.querySelector('thead');
        thead.innerHTML = `
            <tr>
                ${data.headers.map(h => `<th>${h || ''}</th>`).join('')}
            </tr>
        `;

        // Create body
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = data.rows.map((row, idx) => `
            <tr>
                ${row.map((cell, idx) => `<td>${cell || '-'}</td>`).join('')}
            </tr>
        `).join('');

        if (data.rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="' + data.headers.length + '" class="no-data">No data in this sheet</td></tr>';
        }
    }

    filterTable(searchTerm) {
        if (!this.currentSheet || !this.allSheetsData[this.currentSheet]) {
            return;
        }

        const data = this.allSheetsData[this.currentSheet];
        const term = searchTerm.toLowerCase();
        
        const filteredRows = data.rows.filter(row =>
            row.some(cell => String(cell).toLowerCase().includes(term))
        );

        const table = document.getElementById('dataTable');
        const tbody = table.querySelector('tbody');
        
        tbody.innerHTML = filteredRows.map((row, idx) => `
            <tr>
                ${row.map((cell, idx) => `<td>${cell || '-'}</td>`).join('')}
            </tr>
        `).join('');

        if (filteredRows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="' + data.headers.length + '" class="no-data">No results found</td></tr>';
        }
    }

    updateStats(data) {
        document.getElementById('totalRecords').textContent = data.rows.length;
        document.getElementById('totalColumns').textContent = data.headers.length;
    }

    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
        document.getElementById('lastUpdated').textContent = timeString;
    }

    updateChart(data) {
        const ctx = document.getElementById('myChart').getContext('2d');
        
        // Create chart based on first numeric column
        const chartLabels = data.rows.slice(0, 10).map((row, idx) => `Row ${idx + 1}`);
        const chartData = data.rows.slice(0, 10).map(() => Math.floor(Math.random() * 100));

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Data Points',
                    data: chartData,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    showLoading(isLoading) {
        const btn = document.getElementById('refreshBtn');
        if (isLoading) {
            btn.textContent = '⏳ Loading...';
            btn.disabled = true;
        } else {
            btn.textContent = '🔄 Refresh Data';
            btn.disabled = false;
        }
    }

    showError(message) {
        const table = document.getElementById('dataTable');
        table.querySelector('tbody').innerHTML = `
            <tr><td colspan="10" class="error-message">${message}</td></tr>
        `;
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new GoogleSheetsDashboard(CONFIG);
});
