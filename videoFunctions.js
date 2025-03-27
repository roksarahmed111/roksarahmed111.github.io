// Global variable for video index
let currentVideoIndex = 0;

// API configuration - obfuscated for security
const API_CONFIG = {
    get url() {
        // Encode the API URL to make it harder to scrape
        const encodedParts = [
            'aHR0cHM6Ly', // https://
            'xMjkuMTU0LjI0MC4xMzc', // IP (encoded)
            '6NDQz' // port
        ];
        return atob(encodedParts.join('')) + '/api';
    }
};

// Video playback functions
function showMainPage() {
    document.getElementById('main').classList.remove('hidden');
    loadVideo(currentVideoIndex);
}

function loadVideo(index) {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.style.opacity = 0;
    setTimeout(() => {
        videoContainer.innerHTML = `<iframe src="${videoLinks[index]}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen></iframe>`;
        videoContainer.style.opacity = 1;
    }, 300);
}

function nextVideo() {
    if (currentVideoIndex < videoLinks.length - 1) {
        currentVideoIndex++;
        loadVideo(currentVideoIndex);
    }
}

function prevVideo() {
    if (currentVideoIndex > 0) {
        currentVideoIndex--;
        loadVideo(currentVideoIndex);
    }
}

function playRandomVideo() {
    const randomIndex = Math.floor(Math.random() * videoLinks.length);
    currentVideoIndex = randomIndex;
    loadVideo(currentVideoIndex);
}

function toggleMenu() {
    const menuContent = document.getElementById('menuContent');
    if (menuContent.style.display === 'block') {
        menuContent.style.display = 'none';
    } else {
        menuContent.style.display = 'block';
    }
}

function redirectToTelegram() {
    window.location.href = "https://t.me/polanamaiia";
}

// Example function to securely connect to your VPS API
async function connectToAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                // Add any authentication headers needed
            },
            // Include credentials for cookies if needed
            credentials: 'include'
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_CONFIG.url}/${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API connection error:', error);
        // Handle error appropriately
        return { error: true, message: 'Connection failed' };
    }
}

// Example: Login function (you can customize this)
async function loginUser(username, password) {
    const result = await connectToAPI('login', 'POST', { username, password });
    if (!result.error && result.token) {
        // Store token securely
        sessionStorage.setItem('auth_token', result.token);
        return true;
    }
    return false;
}

function headerScroll() {
    const header = document.querySelector('.header');
    header.style.boxShadow = window.pageYOffset > 50 
        ? '0 4px 15px rgba(0,0,0,0.2)' 
        : 'none';
} 