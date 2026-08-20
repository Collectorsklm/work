// Main Dashboard Application
// ==================================================

class GoogleSheetsDashboard {
    constructor(config) {
        this.config = config;
        this.data = [];
        this.headers = [];
        this.chart = null;
        this.filteredData = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
        this.setupAutoRefresh();
    }

    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadData());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterTable(e.target.value));
    }

    setupAutoRefresh() {
        // Uncomment to enable auto-refresh
        // setInterval(() => this.loadData(), this.config.REFRESH_INTERVAL);
    }

    async loadData() {
        try {
            this.showLoading(true);
            const data = await this.fetchFromGoogleSheets();
            this.data = data;
            this.filteredData = data;
            this.renderTable();
            this.updateStats();
            this.updateChart();
            this.updateLastUpdated();
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError(error.message);
            this.showLoading(false);
        }
    }

    async fetchFromGoogleSheets() {
        if (!this.config.API_KEY || this.config.API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('⚠️ Please configure your API key in config.js first!');
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SHEET_ID}/values/${this.config.SHEET_RANGE}?key=${this.config.API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('❌ API key is invalid or missing. Check your configuration.');
            } else if (response.status === 404) {
                throw new Error('❌ Sheet not found. Check your Sheet ID.');
            }
            throw new Error(`API Error: ${response.status}`);
        }

        const jsonData = await response.json();
        
        if (!jsonData.values || jsonData.values.length === 0) {
            throw new Error('No data found in the sheet');
        }

        this.headers = jsonData.values[0];
        return jsonData.values.slice(1);
    }

    renderTable() {
        const table = document.getElementById('dataTable');
        
        // Create header
        const thead = table.querySelector('thead');
        thead.innerHTML = `
            <tr>
                ${this.headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
        `;

        // Create body
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = this.filteredData.map((row, idx) => `
            <tr>
                ${row.map((cell, idx) => `<td>${cell || '-'}</td>`).join('')}
            </tr>
        `).join('');

        if (this.filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="' + this.headers.length + '" class="no-data">No data to display</td></tr>';
        }
    }

    filterTable(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.filteredData = this.data.filter(row =>
            row.some(cell => String(cell).toLowerCase().includes(term))
        );
        this.renderTable();
    }

    updateStats() {
        document.getElementById('totalRecords').textContent = this.data.length;
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

    updateChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        
        // Simple chart: Count of records
        // Customize this based on your data structure
        const chartLabels = this.data.length > 0 ? 
            this.data.slice(0, 10).map((row, idx) => `Record ${idx + 1}`) : 
            ['No data'];
        
        const chartData = this.data.length > 0 ? 
            this.data.slice(0, 10).map(() => Math.floor(Math.random() * 100)) : 
            [0];

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
