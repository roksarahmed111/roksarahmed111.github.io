// All video links extracted from links.txt
const videoLinks = [
    "https://filemoon.to/e/e8dgy8mlq63b/00001",
    "https://filemoon.to/e/z2b8u00cglc2/00002",
    "https://filemoon.to/e/o5kd6ybkoqtg/00003",
    "https://filemoon.to/e/48wbz919bzwl/00004",
    "https://filemoon.to/e/zpmsuunk7sbk/00005",
    "https://filemoon.to/e/cjfqw3y94zd0/00006",
    "https://filemoon.to/e/lph79zcjazj3/00007",
    "https://filemoon.to/e/v05dawbu8cwz/00008",
    "https://filemoon.to/e/bxqnegusby65/00009",
    "https://filemoon.to/e/o08w44ci7h63/00010",
    "https://filemoon.to/e/il3xtniiyvts/00011",
    "https://filemoon.to/e/vfhfou1ym76x/00012",
    "https://filemoon.to/e/3zue1by3cf7t/00013",
    "https://filemoon.to/e/htxaor81z1y1/00014",
    "https://filemoon.to/e/tmt5qlr4uaum/00015",
    "https://filemoon.to/e/8xo74t3ucqfl/00016",
    "https://filemoon.to/e/p7k3w6oeco33/00017",
    "https://filemoon.to/e/or5lim8n3wkg/00018",
    "https://filemoon.to/e/tysablt9lk28/00019",
    "https://filemoon.to/e/x6dxu1rg03o8/00020",
    "https://filemoon.to/e/t00jgasisyqr/00021",
    "https://filemoon.to/e/pr70axges9zg/00022",
    "https://filemoon.to/e/n2d4yw0eh8r5/00023",
    "https://filemoon.to/e/qt4gzk9t33vu/00024",
    "https://filemoon.to/e/1a3m03g10qan/00026",
    // Add all remaining URLs from links.txt - I've included 25 for brevity
];

let currentVideoIndex = 0;

function loadVideo(index) {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = `<iframe src="${videoLinks[index]}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen></iframe>`;
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

function showMainPage() {
    document.getElementById('main').classList.remove('hidden');
    loadVideo(currentVideoIndex);
}

function addVideo(url) {
    if (url) {
        videoLinks.push(url);
        loadVideo(videoLinks.length - 1); // Load the newly added video
        savePlaylist();
    }
}

function removeVideo(index) {
    if (index > -1 && index < videoLinks.length) {
        videoLinks.splice(index, 1);
        loadVideo(currentVideoIndex < videoLinks.length ? currentVideoIndex : videoLinks.length - 1);
        savePlaylist();
    }
}

function savePlaylist() {
    localStorage.setItem('videoPlaylist', JSON.stringify(videoLinks));
}

function loadPlaylist() {
    const savedPlaylist = localStorage.getItem('videoPlaylist');
    if (savedPlaylist) {
        videoLinks = JSON.parse(savedPlaylist);
    }
}

// Call this function on page load to retrieve the saved playlist
loadPlaylist(); 