// Import necessary modules
const fs = require('fs');
const path = require('path');

// Define file paths
const linksFilePath = path.join(__dirname, 'links.txt');
const videoLinksFilePath = path.join(__dirname, 'videoLinks.js');

// Read links from links.txt
fs.readFile(linksFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading links.txt:', err);
        return;
    }

    // Clean up the links (remove newline characters)
    const links = data.split('\n').map(link => link.trim()).filter(link => link);
    console.log('Links read from links.txt:', links); // Debugging line

    // Read the current content of videoLinks.js
    fs.readFile(videoLinksFilePath, 'utf8', (err, videoLinksContent) => {
        if (err) {
            console.error('Error reading videoLinks.js:', err);
            return;
        }

        console.log('Current content of videoLinks.js:', videoLinksContent); // Debugging line

        // Use regex to replace the existing videoLinks array with the new links
        const newVideoLinksContent = videoLinksContent.replace(
            /const videoLinks = \[.*?\];/s,
            `const videoLinks = [\n    ${links.map(link => `"${link}"`).join(',\n    ')}\n];`
        );

        // Check if the content has changed
        if (newVideoLinksContent === videoLinksContent) {
            console.log("No changes made to videoLinks.js.");
            return;
        }

        // Write the updated content back to videoLinks.js
        fs.writeFile(videoLinksFilePath, newVideoLinksContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to videoLinks.js:', err);
                return;
            }
            console.log("videoLinks.js has been updated with links from links.txt.");
        });
    });
});