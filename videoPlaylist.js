// All video links extracted from links.txt

function loadPlaylist() {
    const savedPlaylist = localStorage.getItem('videoPlaylist');
    if (savedPlaylist) {
        videoLinks = JSON.parse(savedPlaylist);
    }
}

// Call this function on page load to retrieve the saved playlist
loadPlaylist();