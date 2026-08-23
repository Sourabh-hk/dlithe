// Data State
let playersQueue = [];
let matchesHistory = [];
let matchCount = 0;

// Level mapping for matchmaking logic
const levelsMap = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3,
    "Expert": 4
};

// DOM Elements
const DOM = {
    // Stats
    statWaiting: document.getElementById('stat-waiting'),
    statMatches: document.getElementById('stat-matches'),
    statQueue: document.getElementById('stat-queue'),
    headerStatusText: document.getElementById('header-status-text'),
    headerStatusDot: document.querySelector('.status-dot'),
    
    // Form
    joinForm: document.getElementById('join-form'),
    playerNameInput: document.getElementById('player-name'),
    gameLevelSelect: document.getElementById('game-level'),
    gameModeSelect: document.getElementById('game-mode'),
    nameError: document.getElementById('name-error'),
    levelError: document.getElementById('level-error'),
    modeError: document.getElementById('mode-error'),
    
    // Queue Section
    searchInput: document.getElementById('search-input'),
    findMatchBtn: document.getElementById('find-match-btn'),
    loadingState: document.getElementById('loading-state'),
    errorState: document.getElementById('error-state'),
    retryBtn: document.getElementById('retry-btn'),
    playersList: document.getElementById('players-list'),
    emptyPlayers: document.getElementById('empty-players'),
    
    // Matches Section
    matchesList: document.getElementById('matches-list'),
    emptyMatches: document.getElementById('empty-matches'),
    clearSessionBtn: document.getElementById('clear-session-btn'),
    
    // Modal
    confirmModal: document.getElementById('confirm-modal'),
    confirmClearBtn: document.getElementById('confirm-clear-btn'),
    cancelClearBtn: document.getElementById('cancel-clear-btn'),
    
    // Notifications
    notificationsContainer: document.getElementById('notifications-container')
};

// --- Initialization ---

function init() {
    setupEventListeners();
    loadSession();
    
    // If no players in queue, fetch default fake players
    if (playersQueue.length === 0 && matchesHistory.length === 0) {
        loadInitialPlayers();
    } else {
        renderAll();
    }
    
    // Periodically update timestamps for matches
    setInterval(() => {
        renderMatches();
    }, 60000); // every minute
}

function setupEventListeners() {
    DOM.joinForm.addEventListener('submit', handleAddPlayer);
    DOM.findMatchBtn.addEventListener('click', findMatch);
    DOM.retryBtn.addEventListener('click', loadInitialPlayers);
    
    // Search with debouncing
    const handleSearch = debounce(() => {
        renderPlayers(DOM.searchInput.value.trim());
    }, 300);
    DOM.searchInput.addEventListener('input', handleSearch);
    
    // Clear Session Modal
    DOM.clearSessionBtn.addEventListener('click', () => {
        DOM.confirmModal.classList.remove('hidden');
    });
    DOM.cancelClearBtn.addEventListener('click', () => {
        DOM.confirmModal.classList.add('hidden');
    });
    DOM.confirmClearBtn.addEventListener('click', () => {
        clearSession();
        DOM.confirmModal.classList.add('hidden');
    });
}

// --- Server Simulation ---

function fetchPlayers() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // ~15% chance of simulated failure
            if (Math.random() < 0.15) {
                reject(new Error("Simulated server failure"));
            } else {
                resolve([
                    { id: generateId(), name: "ShadowFox", level: "Advanced", mode: "Ranked" },
                    { id: generateId(), name: "PixelHunter", level: "Intermediate", mode: "Ranked" },
                    { id: generateId(), name: "Nova", level: "Expert", mode: "Battle Royale" },
                    { id: generateId(), name: "GlitchKing", level: "Beginner", mode: "Casual" },
                    { id: generateId(), name: "NeonSniper", level: "Intermediate", mode: "Capture the Flag" },
                    { id: generateId(), name: "CyberNinja", level: "Beginner", mode: "Battle Royale" },
                    { id: generateId(), name: "VoidWalker", level: "Advanced", mode: "Team Deathmatch" },
                    { id: generateId(), name: "Echo", level: "Expert", mode: "Ranked" }
                ]);
            }
        }, 1200);
    });
}

async function loadInitialPlayers() {
    // UI Loading state
    DOM.playersList.classList.add('hidden');
    DOM.emptyPlayers.classList.add('hidden');
    DOM.errorState.classList.add('hidden');
    DOM.loadingState.classList.remove('hidden');
    updateQueueStatus('Searching');
    
    try {
        const data = await fetchPlayers();
        playersQueue = data;
        saveSession();
        
        DOM.loadingState.classList.add('hidden');
        renderAll();
        showNotification('success', "Players loaded successfully.");
        updateQueueStatus('Online');
    } catch (error) {
        DOM.loadingState.classList.add('hidden');
        DOM.errorState.classList.remove('hidden');
        showNotification('error', "Unable to load players. Please try again.");
        updateQueueStatus('Offline');
    }
}

// --- Player Management ---

function handleAddPlayer(e) {
    e.preventDefault();
    
    const name = DOM.playerNameInput.value.trim();
    const level = DOM.gameLevelSelect.value;
    const mode = DOM.gameModeSelect.value;
    
    if (validatePlayerForm(name, level, mode)) {
        const newPlayer = {
            id: generateId(),
            name: name,
            level: level,
            mode: mode
        };
        
        playersQueue.unshift(newPlayer); // Add to top of the queue
        saveSession();
        renderAll();
        
        showNotification('success', "Player added to the queue.");
        
        DOM.joinForm.reset();
        clearFormErrors();
    }
}

function validatePlayerForm(name, level, mode) {
    let isValid = true;
    clearFormErrors();
    
    if (!name) {
        showError(DOM.playerNameInput, DOM.nameError, "Please enter a player name.");
        isValid = false;
    } else if (name.length < 2) {
        showError(DOM.playerNameInput, DOM.nameError, "Player name must contain at least 2 characters.");
        isValid = false;
    } else if (name.length > 20) {
        showError(DOM.playerNameInput, DOM.nameError, "Player name cannot exceed 20 characters.");
        isValid = false;
    } else {
        // Check for duplicates
        const isDuplicate = playersQueue.some(p => p.name.toLowerCase() === name.toLowerCase());
        if (isDuplicate) {
            showError(DOM.playerNameInput, DOM.nameError, "This player is already in the matchmaking queue.");
            isValid = false;
        }
    }
    
    if (!level) {
        showError(DOM.gameLevelSelect, DOM.levelError, "Please select a game level.");
        isValid = false;
    }
    
    if (!mode) {
        showError(DOM.gameModeSelect, DOM.modeError, "Please select a game mode.");
        isValid = false;
    }
    
    return isValid;
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearFormErrors() {
    [DOM.playerNameInput, DOM.gameLevelSelect, DOM.gameModeSelect].forEach(el => el.classList.remove('error'));
    [DOM.nameError, DOM.levelError, DOM.modeError].forEach(el => el.textContent = '');
}

// --- Matchmaking Logic ---

function findMatch() {
    if (playersQueue.length < 2) {
        showNotification('warning', "Not enough players to form a match.");
        return;
    }
    
    showNotification('info', "Searching for an opponent...");
    DOM.findMatchBtn.disabled = true;
    updateQueueStatus('Searching');
    
    // Simulate slight processing time
    setTimeout(() => {
        let matchFound = false;
        
        // Find first compatible pair
        for (let i = 0; i < playersQueue.length; i++) {
            for (let j = i + 1; j < playersQueue.length; j++) {
                const p1 = playersQueue[i];
                const p2 = playersQueue[j];
                
                if (isCompatible(p1, p2)) {
                    createMatch(p1, p2, i, j);
                    matchFound = true;
                    break;
                }
            }
            if (matchFound) break;
        }
        
        if (!matchFound) {
            showNotification('warning', "No suitable match found yet. Keep waiting or invite another player.");
        }
        
        DOM.findMatchBtn.disabled = false;
        updateQueueStatus('Online');
    }, 600);
}

function isCompatible(p1, p2) {
    // Mode must be identical
    if (p1.mode !== p2.mode) return false;
    
    // Level must be same or one apart
    const l1 = levelsMap[p1.level];
    const l2 = levelsMap[p2.level];
    return Math.abs(l1 - l2) <= 1;
}

function createMatch(p1, p2, index1, index2) {
    const match = {
        id: generateId(),
        player1: p1,
        player2: p2,
        mode: p1.mode,
        timestamp: new Date().toISOString()
    };
    
    // Remove matched players (splice highest index first)
    const indices = [index1, index2].sort((a, b) => b - a);
    playersQueue.splice(indices[0], 1);
    playersQueue.splice(indices[1], 1);
    
    matchesHistory.unshift(match);
    matchCount++;
    
    saveSession();
    
    // Maintain current search state while re-rendering
    const query = DOM.searchInput.value.trim();
    renderPlayers(query);
    renderMatches();
    updateStats();
    
    showNotification('success', `Match found! ${p1.name} and ${p2.name} are ready to play.`);
}

// --- Rendering ---

function renderAll() {
    renderPlayers(DOM.searchInput.value.trim());
    renderMatches();
    updateStats();
}

function renderPlayers(searchQuery = '') {
    DOM.loadingState.classList.add('hidden');
    DOM.errorState.classList.add('hidden');
    
    let filteredPlayers = playersQueue;
    
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filteredPlayers = playersQueue.filter(p => 
            p.name.toLowerCase().includes(q) ||
            p.level.toLowerCase().includes(q) ||
            p.mode.toLowerCase().includes(q)
        );
    }
    
    if (filteredPlayers.length === 0) {
        DOM.playersList.classList.add('hidden');
        DOM.emptyPlayers.classList.remove('hidden');
        
        if (searchQuery) {
            DOM.emptyPlayers.innerHTML = '<p>No players match your search.</p><span>Try adjusting your filters.</span>';
        } else {
            DOM.emptyPlayers.innerHTML = '<p>No players are currently waiting.</p><span>Join the queue to start matchmaking.</span>';
        }
    } else {
        DOM.emptyPlayers.classList.add('hidden');
        DOM.playersList.classList.remove('hidden');
        
        DOM.playersList.innerHTML = filteredPlayers.map(p => `
            <div class="player-card">
                <div class="player-info">
                    <h4>${escapeHTML(p.name)}</h4>
                    <div class="badges">
                        <span class="badge">${p.level}</span>
                        <span class="badge">${p.mode}</span>
                    </div>
                </div>
                <div class="player-status">Waiting</div>
            </div>
        `).join('');
    }
}

function renderMatches() {
    if (matchesHistory.length === 0) {
        DOM.matchesList.classList.add('hidden');
        DOM.emptyMatches.classList.remove('hidden');
    } else {
        DOM.emptyMatches.classList.add('hidden');
        DOM.matchesList.classList.remove('hidden');
        
        DOM.matchesList.innerHTML = matchesHistory.map((m, index) => `
            <div class="match-card">
                <div class="match-header">
                    <h4>Match #${matchCount - index}</h4>
                    <span class="match-time">${timeAgo(m.timestamp)}</span>
                </div>
                
                <div class="match-vs">
                    <span class="player-name">${escapeHTML(m.player1.name)}</span>
                    <span class="vs">VS</span>
                    <span class="player-name">${escapeHTML(m.player2.name)}</span>
                </div>
                
                <div class="match-details">
                    <div class="match-detail-row">
                        <span class="detail-label">Mode</span>
                        <span>${m.mode}</span>
                    </div>
                    <div class="match-detail-row">
                        <span class="detail-label">Levels</span>
                        <span>${m.player1.level} vs ${m.player2.level}</span>
                    </div>
                </div>
                <div class="match-status">Match Found</div>
            </div>
        `).join('');
    }
}

function updateStats() {
    DOM.statWaiting.textContent = playersQueue.length;
    DOM.statMatches.textContent = matchCount;
}

function updateQueueStatus(status) {
    DOM.statQueue.textContent = status;
    DOM.headerStatusText.textContent = `Matchmaking ${status}`;
    
    DOM.statQueue.className = '';
    DOM.headerStatusDot.className = 'status-dot';
    
    if (status === 'Online' || status === 'Ready') {
        DOM.statQueue.classList.add('status-ready');
        DOM.headerStatusDot.classList.add('online');
    } else if (status === 'Searching') {
        DOM.statQueue.classList.add('status-searching');
        DOM.headerStatusDot.classList.add('searching');
    }
}

// --- Utils & Helpers ---

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function debounce(callback, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// --- Notifications System ---

function showNotification(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    DOM.notificationsContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

// --- Persistence ---

function saveSession() {
    localStorage.setItem('matchpoint_queue', JSON.stringify(playersQueue));
    localStorage.setItem('matchpoint_matches', JSON.stringify(matchesHistory));
    localStorage.setItem('matchpoint_count', matchCount.toString());
}

function loadSession() {
    const savedQueue = localStorage.getItem('matchpoint_queue');
    const savedMatches = localStorage.getItem('matchpoint_matches');
    const savedCount = localStorage.getItem('matchpoint_count');
    
    if (savedQueue) playersQueue = JSON.parse(savedQueue);
    if (savedMatches) matchesHistory = JSON.parse(savedMatches);
    if (savedCount) matchCount = parseInt(savedCount, 10);
    
    if (playersQueue.length > 0) {
        updateQueueStatus('Online');
    }
}

function clearSession() {
    localStorage.removeItem('matchpoint_queue');
    localStorage.removeItem('matchpoint_matches');
    localStorage.removeItem('matchpoint_count');
    
    playersQueue = [];
    matchesHistory = [];
    matchCount = 0;
    
    DOM.searchInput.value = '';
    
    showNotification('info', "Session cleared. Reloading defaults...");
    loadInitialPlayers();
}

// Start App
document.addEventListener('DOMContentLoaded', init);
