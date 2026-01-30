// ALGORHYTHM Quantum v2.1 Dashboard Logic

let userState = {
    amount: 124500,
    risk: 'Medium',
    goal: 'Wealth Generation'
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

    // Simulated price updates
    setInterval(updatePrices, 3000);
};

function updateDashboardWithInputs() {
    // Update Valuation Display
    const valDisplay = document.getElementById('total-valuation');
    if (valDisplay) {
        valDisplay.innerText = `₹ ${userState.amount.toLocaleString()}`;
    }

    // Dynamic logic for weights based on risk
    let newWeights = [40, 30, 20, 5, 5];
    if (userState.risk === 'High') newWeights = [20, 20, 30, 20, 10];
    if (userState.risk === 'Low') newWeights = [60, 20, 10, 0, 10];

    if (portfolioChart) {
        portfolioChart.data.datasets[0].data = newWeights;
        portfolioChart.update();
    }
}

function closeAndSetup() {
    console.log("Closing Manifesto and Setting up...");
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

function updatePrices() {
    const elements = ['nifty', 'sensex', 'reliance', 'tcs'];
    elements.forEach(el => {
        const item = document.getElementById(`${el}-price`);
        if (!item) return;
        const currentText = item.innerText.replace(/,/g, '');
        const current = parseFloat(currentText);
        if (isNaN(current)) return;

        const change = (Math.random() - 0.5) * 10;
        const newVal = (current + change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        item.innerText = newVal;
        item.className = `ml-2 font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`;
    });
}

async function optimizePortfolio() {
    const btn = document.getElementById('optimize-btn');
    const reasoning = document.getElementById('ai-reasoning');
    const results = document.getElementById('optimization-results');
    const strategyList = document.getElementById('strategy-list');
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

            speak(`Optimization complete for your ${userState.risk} portfolio. Strategy: ${data.strategy_name}.`);
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
