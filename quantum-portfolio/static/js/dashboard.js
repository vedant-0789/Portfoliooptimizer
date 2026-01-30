// Dashboard Logic

// Initialize Charts
let portfolioChart;

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    startLiveUpdates();
});

function initChart() {
    const ctx = document.getElementById('portfolioChart').getContext('2d');

    portfolioChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Bluechip', 'MidCap', 'Gold', 'Liquid'],
            datasets: [{
                data: [40, 30, 20, 10],
                data: [40, 30, 20, 10],
                backgroundColor: [
                    '#0ea5e9', // Sky Primary
                    '#10B981', // Green
                    '#F59E0B', // Gold
                    '#64748B'  // Grey
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        font: { family: "'Outfit', sans-serif", size: 10 }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function startLiveUpdates() {
    const tickers = ['NIFTY', 'SENSEX', 'RELIANCE', 'TCS'];

    // Initial fetch
    tickers.forEach(fetchPrice);

    // Poll every 5s
    setInterval(() => {
        tickers.forEach(fetchPrice);
    }, 5000);
}

async function fetchPrice(symbol) {
    try {
        const res = await fetch(`/api/live/${symbol}`);
        const data = await res.json();

        const el = document.getElementById(`${symbol.toLowerCase()}-price`);
        if (el) {
            el.innerText = `₹${data.price.toLocaleString()}`;
            // Color based on change
            if (data.change >= 0) {
                el.classList.remove('text-red-400');
                el.classList.add('text-green-400');
            } else {
                el.classList.remove('text-green-400');
                el.classList.add('text-red-400');
            }
        }
    } catch (e) {
        console.error("Ticker fetch error", e);
    }
}

async function optimizePortfolio() {
    const btn = document.getElementById('optimize-btn');
    const originalText = btn.innerHTML;

    // Loading State
    btn.innerHTML = `<span class="animate-pulse">🤖 Analyzing with RL...</span>`;
    btn.disabled = true;

    try {
        // Simulate delay for "AI Thinking"
        await new Promise(r => setTimeout(r, 1500));

        const res = await fetch('/api/optimize');
        const data = await res.json();

        // Update Reason
        document.getElementById('ai-reasoning').innerText = `"${data.reasoning}"`;
        document.getElementById('ai-reasoning').classList.add('text-green-300', 'font-medium');

        // Update Chart
        portfolioChart.data.datasets[0].data = data.weights.map(w => w * 100);
        portfolioChart.data.labels = ['Allocation A', 'Allocation B', 'Allocation C', 'Allocation D']; // Simplified
        portfolioChart.update();

        // Show Results
        const resultDiv = document.getElementById('optimization-results');
        const list = document.getElementById('strategy-list');
        list.innerHTML = `
            <li>Strategy: <span class="text-white font-bold">${data.strategy_name}</span></li>
            <li>Predicted Alpha: <span class="text-green-400">+${data.alpha}%</span></li>
        `;
        resultDiv.classList.remove('hidden');

        // Log to Ledger
        addLedgerEntry(data.strategy_name);

    } catch (e) {
        console.error("Optimization error", e);
        alert("Optimization failed. Backend might be down.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function addLedgerEntry(action) {
    const tbody = document.getElementById('ledger-body');
    const hash = '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4);

    const row = `
        <tr class="border-b animate-fade-in bg-green-50">
            <td class="px-4 py-3 font-mono text-xs text-gray-500">${hash}</td>
            <td class="px-4 py-3">Rebalance</td>
            <td class="px-4 py-3">${action}</td>
            <td class="px-4 py-3 text-green-600 font-bold">Confirmed</td>
        </tr>
    `;

    tbody.insertAdjacentHTML('afterbegin', row);
}

function loadChart(symbol) {
    // Re-render TradingView Widget
    if (document.getElementById('tradingview_b2474')) {
        document.getElementById('tradingview_b2474').innerHTML = ""; // Clear existing
        new TradingView.widget(
            {
                "autosize": true,
                "symbol": symbol,
                "interval": "D",
                "timezone": "Asia/Kolkata",
                "theme": "light",
                "style": "1",
                "locale": "in",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_b2474"
            }
        );

        // Update Header Title

        const header = document.querySelector('h2');
        if (header) {
            header.innerHTML = `<span class="mr-2">🇮🇳</span> ${symbol.replace('NSE:', '').replace('BSE:', '')} Live Chart`;
        }
    }
}

function connectWallet() {
    const btn = document.getElementById('wallet-btn');
    const originalText = btn.innerText;

    // 1. Loading State
    btn.innerHTML = `<span class="animate-pulse">Connecting...</span>`;
    btn.disabled = true;

    // 2. Simulate Delay
    setTimeout(() => {
        // 3. Success State
        const mockAddress = '0x71C...9A2';
        btn.innerHTML = `<span class="flex items-center text-green-400 bg-gray-900 px-2 py-1 rounded border border-green-500">● ${mockAddress}</span>`;
        btn.classList.remove('bg-secondary', 'hover:bg-gray-800');
        btn.classList.add('bg-black');
        btn.disabled = false;

        // Optional: Alert
        alert("Wallet Connected Successfully! \nNetwork: Ethereum Mainnet (Simulated)");
    }, 1500);
}
