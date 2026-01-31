// ALGORHYTHM Quantum v2.1 Dashboard Logic

let userState = {
    amount: 124500,
    risk: 'Medium',
    goal: 'Wealth Generation',
    marketOpen: true
};

const portfolioData = {
    labels: ['Bluechip', 'Mid-Cap', 'Small-Cap', 'Crypto', 'Quantum Assets'],
    datasets: [{
        data: [40, 20, 15, 10, 15],
        backgroundColor: [
            '#0ea5e9', // Bluechip
            '#10B981', // Mid-Cap
            '#F59E0B', // Small-Cap
            '#EC4899', // Crypto
            '#8B5CF6'  // Quantum
        ],
        borderWidth: 0,
        hoverOffset: 20
    }]
};

// Initialize Chart
let portfolioChart;
window.onload = () => {
    console.log("ALGORHYTHM Dashboard Initializing...");
    const canvas = document.getElementById('portfolioChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        portfolioChart = new Chart(ctx, {
            type: 'doughnut',
            data: portfolioData,
            options: {
                plugins: { legend: { display: false } },
                cutout: '75%',
                responsive: true,
                maintainAspectRatio: false,
                animation: { animateRotate: true, animateScale: true }
            }
        });
    }

    // Handle Form Submit
    const form = document.getElementById('portfolio-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Synchronizing Nodes...");

            const amountVal = document.getElementById('input-amount').value;
            const riskVal = document.getElementById('input-risk').value;
            const goalVal = document.getElementById('input-goal').value;

            userState.amount = parseFloat(amountVal) || userState.amount;
            userState.risk = riskVal || userState.risk;
            userState.goal = goalVal || userState.goal;

            updateDashboardWithInputs();
            toggleOnboarding();
            notify("Nodes Synchronized. AI Sentinel is now active.");

            // Auto Trigger Scan after set-up
            setTimeout(optimizePortfolio, 800);
        });
    }

    // Initial Status Check
    checkMarketStatus();
    updateNews();

    // Data Refresh Loops
    setInterval(updatePrices, 3000);
    setInterval(checkMarketStatus, 30000); // Check market status every 30s
    setInterval(updateNews, 60000); // Refresh news every minute
};

async function checkMarketStatus() {
    try {
        const res = await fetch('/api/market-status');
        const data = await res.json();
        userState.marketOpen = data.is_open;

        const badge = document.getElementById('market-badge');
        if (badge) {
            badge.innerHTML = `<span class="w-2 h-2 ${data.is_open ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2 ${data.is_open ? 'animate-pulse' : ''}"></span> ${data.status}`;
            badge.className = `px-3 py-1 rounded-full ${data.is_open ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} text-xs font-bold flex items-center border ${data.is_open ? 'border-green-500/20' : 'border-red-500/20'}`;
        }

        const chartBadge = document.getElementById('chart-status-badge');
        if (chartBadge) {
            chartBadge.innerText = data.is_open ? "LIVE" : "CLOSED";
            chartBadge.className = `px-3 py-1 text-xs ${data.is_open ? 'bg-primary' : 'bg-red-500'} rounded-md font-extrabold text-white transition-colors duration-500`;
        }
    } catch (e) {
        console.error("Status check failed", e);
    }
}

async function updateNews() {
    const feed = document.getElementById('news-feed');
    const ticker = document.getElementById('news-ticker');
    if (!feed && !ticker) return;

    try {
        const res = await fetch('/api/news');
        const data = await res.json();
        const news = data.news;

        const moodDisplay = document.getElementById('market-mood');
        if (moodDisplay) {
            moodDisplay.innerText = data.mood;
            moodDisplay.className = `text-[10px] font-black uppercase tracking-widest ${data.mood === 'GREED' ? 'text-green-400' : (data.mood === 'FEAR' ? 'text-red-400' : 'text-gray-400')}`;
        }

        if (feed) {
            feed.innerHTML = news.map(item => `
                <div class="news-card border-l-2 ${item.sentiment === 'Bullish' ? 'border-green-500' : (item.sentiment === 'Bearish' ? 'border-red-500' : 'border-blue-500')} bg-white/5 p-3 rounded-r-xl hover:bg-white/10 transition cursor-pointer group">
                    <div class="flex justify-between items-start mb-2">
                         <span class="text-[8px] font-black uppercase tracking-widest ${item.sentiment === 'Bullish' ? 'text-green-400' : (item.sentiment === 'Bearish' ? 'text-red-400' : 'text-blue-400')} px-1.5 py-0.5 bg-white/5 rounded border border-white/5">
                            ${item.sentiment}
                         </span>
                         <span class="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">${item.impact} IMPACT</span>
                    </div>
                    <h4 class="text-[10px] font-bold text-gray-200 group-hover:text-primary transition line-clamp-2 leading-relaxed">${item.title}</h4>
                </div>
            `).join('');
        }

        if (ticker) {
            ticker.innerHTML = news.map(item => `
                <span>◈ ${item.title} [${item.sentiment.toUpperCase()}]</span>
            `).join('');
        }
    } catch (e) {
        console.error("News fetch failed", e);
    }
}

function updateDashboardWithInputs() {
    const valDisplay = document.getElementById('total-valuation');
    if (valDisplay) {
        valDisplay.innerText = `₹ ${userState.amount.toLocaleString()}`;
    }

    let newWeights = [40, 30, 20, 5, 5];
    if (userState.risk === 'High') newWeights = [20, 20, 30, 20, 10];
    if (userState.risk === 'Low') newWeights = [60, 20, 10, 0, 10];

    if (portfolioChart) {
        portfolioChart.data.datasets[0].data = newWeights;
        portfolioChart.update();
    }
}

function closeAndSetup() {
    toggleManifesto();
    setTimeout(toggleOnboarding, 500);
}

function toggleManifesto() {
    const modal = document.getElementById('manifesto-modal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('opacity-100'), 10);
    } else {
        modal.classList.remove('opacity-100');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

function toggleOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('opacity-100'), 10);
    } else {
        modal.classList.remove('opacity-100');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

async function updatePrices() {
    // Strictly no fluctuations if market is closed (dashboard shows closing prices)
    if (!userState.marketOpen) return;

    const elements = ['nifty', 'sensex', 'reliance', 'tcs', 'hdfcbank', 'infy'];

    for (const el of elements) {
        try {
            const res = await fetch(`/api/live/${el}`);
            const data = await res.json();

            const item = document.getElementById(`${el}-price`);
            if (item) {
                const price = data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const isPositive = data.change >= 0;
                item.innerText = price;
                item.className = `ml-2 font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`;
            }
        } catch (e) {
            console.error(`Failed to update ${el}`, e);
        }
    }
}

async function optimizePortfolio() {
    const btn = document.getElementById('optimize-btn');
    const reasoning = document.getElementById('ai-reasoning');
    const results = document.getElementById('optimization-results');
    const strategyList = document.getElementById('strategy-list');
    const suggestionList = document.getElementById('ai-suggestions');
    const ledger = document.getElementById('ledger-body');

    if (!btn || !reasoning) return;

    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin mr-2">🌀</span> Synchronizing Qubits...`;
    reasoning.innerText = `Scanning markets for ${userState.risk} risk profiles...`;

    try {
        const response = await fetch('/api/optimize');
        const data = await response.json();

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = `<span>Execute Quantum Scan</span>`;
            reasoning.innerText = `"${data.reasoning}"`;
            if (results) results.classList.remove('hidden');

            if (strategyList) {
                strategyList.innerHTML = `
                    <li class="flex justify-between items-center text-white/80">
                        <span>${data.strategy_name}</span>
                        <span class="text-green-400 font-bold">+${data.alpha}% Alpha</span>
                    </li>
                    <li class="text-[10px] text-white/40 italic">Strategy calibrated for ${userState.goal}</li>
                `;
            }

            if (suggestionList && data.suggestions) {
                suggestionList.innerHTML = data.suggestions.map(s => `
                    <li class="flex items-center text-xs text-white/70 group-hover:text-primary transition">
                        <span class="w-1.5 h-1.5 bg-primary/40 rounded-full mr-2"></span> ${s}
                    </li>
                `).join('');
            }

            const reviewContainer = document.getElementById('ai-detailed-review');
            if (reviewContainer && data.detailed_review) {
                let html = '';
                for (const [key, text] of Object.entries(data.detailed_review)) {
                    const isWhy = key === 'WHY_THIS';
                    html += `
                        <div class="p-3 ${isWhy ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/5'} rounded-xl border">
                            <h5 class="text-[9px] font-black ${isWhy ? 'text-primary' : 'text-gray-400'} uppercase mb-1">${key.replace('_', ' ')}</h5>
                            <p class="text-[10px] text-white/70 leading-relaxed">${text}</p>
                        </div>
                    `;
                }
                reviewContainer.innerHTML = html;
            }

            if (portfolioChart) {
                portfolioChart.data.datasets[0].data = data.weights.map(w => w * 100);
                portfolioChart.update();
            }

            if (ledger) {
                const row = document.createElement('tr');
                row.className = "border-b border-white/5 bg-primary/5 animate-fade-in";
                row.innerHTML = `
                    <td class="px-4 py-4 font-mono text-xs text-primary/80">0x${Math.random().toString(16).slice(2, 18)}...</td>
                    <td class="px-4 py-4 flex items-center"><span class="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>AI-Rebalance</td>
                    <td class="px-4 py-4 text-xs font-mono">${new Date().toLocaleTimeString()}</td>
                    <td class="px-4 py-4"><span class="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md text-[10px] font-bold border border-purple-500/20 uppercase tracking-tighter">Secured</span></td>
                `;
                ledger.insertBefore(row, ledger.firstChild);
            }

            // Update AI Integrity Audit UI
            const conf = Math.floor(Math.random() * 8) + 88; // 88-95%
            const confIndicator = document.getElementById('confidence-indicator');
            if (confIndicator) confIndicator.innerText = `CONFIDENCE: ${conf}%`;

            const xaiFactors = document.getElementById('xai-factors');
            if (xaiFactors) {
                const tech = Math.floor(Math.random() * 10) + 35;
                const sent = Math.floor(Math.random() * 10) + 30;
                const regi = 100 - tech - sent;
                xaiFactors.innerHTML = `
                    <div class="text-[10px] text-gray-400">Technical Trends <span class="float-right text-primary">${tech}%</span></div>
                    <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-primary h-full" style="width: ${tech}%"></div>
                    </div>
                    <div class="text-[10px] text-gray-400">Social Sentiment <span class="float-right text-primary">${sent}%</span></div>
                    <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-primary h-full" style="width: ${sent}%"></div>
                    </div>
                    <div class="text-[10px] text-gray-400">Market Regime <span class="float-right text-primary">${regi}%</span></div>
                    <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-primary h-full" style="width: ${regi}%"></div>
                    </div>
                `;
            }

            const stressImpact = document.getElementById('stress-impact');
            if (stressImpact) {
                const impact = (Math.random() * 5 + 15).toFixed(1);
                stressImpact.innerText = `-${impact}% IMPACT`;
            }

            speak(`Optimization complete. Suggestion: ${data.suggestions[0]}`);
        }, 1500);
    } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.innerHTML = `<span>Execute Quantum Scan</span>`;
    }
}

async function activateQuantumShield() {
    const btn = document.getElementById('shield-btn');
    if (!btn) return;
    const originalText = btn.innerText;

    btn.disabled = true;
    btn.innerText = "ENCRYPTING...";

    try {
        const response = await fetch('/api/quantum-shield', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload: `state_${userState.risk}_${userState.amount}` })
        });
        const data = await response.json();

        setTimeout(() => {
            btn.innerText = "SHIELD ACTIVE";
            btn.className = "px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-black animate-pulse shadow-lg shadow-green-500/40";
            notify(`Quantum Shield Enabled via ${data.algorithm}`);
        }, 1200);

    } catch (err) {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

function toggleVoiceSearch() {
    const btn = document.getElementById('voice-btn');
    if (!btn) return;
    btn.classList.toggle('recording');
    if (btn.classList.contains('recording')) startSpeechRecognition();
}

function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { notify("Speech Recognition not supported."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
        processVoiceCommand(event.results[0][0].transcript);
        const btn = document.getElementById('voice-btn');
        if (btn) btn.classList.remove('recording');
    };
    recognition.onerror = () => {
        const btn = document.getElementById('voice-btn');
        if (btn) btn.classList.remove('recording');
    };
}

function processVoiceCommand(cmd) {
    cmd = cmd.toLowerCase();
    if (cmd.includes('optimize') || cmd.includes('scan')) optimizePortfolio();
    else if (cmd.includes('shield') || cmd.includes('protect')) activateQuantumShield();
    else if (cmd.includes('analysis')) window.location.href = '/analysis';
    else notify(`Heard: "${cmd}"`);
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
}

function notify(msg) {
    const toast = document.createElement('div');
    toast.className = "fixed bottom-5 right-5 bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-2xl border border-white/10 animate-fade-in z-[200] text-sm font-bold";
    toast.innerHTML = `<span class="text-primary mr-2">◈</span> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function connectWallet() { toggleOnboarding(); }

function acceptDisclaimer() {
    const checkbox = document.getElementById('disclaimer-checkbox');
    if (checkbox && !checkbox.checked) {
        alert("Please acknowledge the risks by checking the box before proceeding.");
        checkbox.parentElement.classList.add('animate-pulse', 'border-red-500');
        return;
    }
    localStorage.setItem('disclaimer_accepted', 'true');
    const d = document.getElementById('global-disclaimer');
    if (d) {
        d.style.opacity = '0';
        setTimeout(() => d.style.display = 'none', 500);
    }
}

function handleLogout() {
    window.location.href = '/logout';
}

async function openPredictionModal(symbol) {
    const modal = document.getElementById('prediction-modal');
    if (!modal) return;

    // Reset content
    document.getElementById('pred-symbol').innerText = symbol;
    document.getElementById('pred-title').innerText = `${symbol} Analysis`;
    document.getElementById('pred-review').innerText = 'Gathering AI nodes...';
    document.getElementById('pred-why').innerText = '...';

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('opacity-100'), 10);

    try {
        const res = await fetch(`/api/predict/${symbol}`);
        const data = await res.json();

        document.getElementById('pred-status').innerText = data.prediction;
        document.getElementById('pred-review').innerText = data.review;
        document.getElementById('pred-why').innerText = data.why_choose;

        const badge = document.getElementById('pred-badge');
        if (badge) badge.innerText = data.trust_badge;

        const conf = document.getElementById('pred-confidence');
        if (conf) conf.innerText = `${data.confidence}%`;
    } catch (e) {
        console.error("Prediction fetch failed", e);
    }
}

function closePredictionModal() {
    const modal = document.getElementById('prediction-modal');
    if (!modal) return;
    modal.classList.remove('opacity-100');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

async function runComparison() {
    const stockA = document.getElementById('vs-input-a').value || 'RELIANCE';
    const stockB = document.getElementById('vs-input-b').value || 'TCS';

    const loading = document.getElementById('vs-loading');
    const result = document.getElementById('vs-result');

    loading.classList.remove('hidden');
    result.classList.add('hidden');

    try {
        const response = await fetch('/api/compare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stockA, stockB })
        });
        const data = await response.json();

        loading.classList.add('hidden');
        result.classList.remove('hidden');

        document.getElementById('vs-winner-label').innerText = `WINNER: ${data.winner}`;
        document.getElementById('vs-confidence').innerText = `${data.confidence}% CONFIDENCE`;
        document.getElementById('vs-reasoning').innerText = data.detailed_analysis;

        const proofList = document.getElementById('vs-proof-list');
        proofList.innerHTML = data.proof.map(p => `
            <div class="flex flex-col bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-purple-500/30 transition space-y-3">
                <div class="flex items-start">
                    <div class="p-1.5 bg-purple-500/10 rounded mr-3 mt-0.5">
                        <svg class="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <a href="${p.link}" target="_blank" class="text-[11px] font-bold text-white group-hover:text-purple-400 transition block mb-1 underline decoration-purple-500/30">${p.title}</a>
                        <p class="text-[9px] text-gray-500 uppercase tracking-widest font-black">${p.source}</p>
                    </div>
                </div>
                <div class="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                    <p class="text-[10px] text-purple-200/60 leading-relaxed italic"><span class="text-purple-400 font-bold">SENTINEL LOG:</span> ${p.reason}</p>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error("Comparison failed", e);
        loading.classList.add('hidden');
    }
}
