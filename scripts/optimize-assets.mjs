const imagemin = await import('imagemin');
const imageminMozjpeg = await import('imagemin-mozjpeg');

// Compress images
async function compressImages() {
    const fs = await import('fs');
    const path = await import('path');
    await imagemin.default(['assets/*.{jpg,png}'], {
        destination: 'assets',
        plugins: [
            imageminMozjpeg.default({quality: 75})
        ]
    });
    console.log('Images compressed');
}

// Minify JavaScript files
async function minifyJS() {
    const fs = await import('fs');
    const path = await import('path');
    const UglifyJS = await import('uglify-js');
    const jsFiles = fs.readdirSync('src').filter(file => file.endsWith('.js'));
    jsFiles.forEach(file => {
        const filePath = path.join('src', file);
        const result = UglifyJS.minify(fs.readFileSync(filePath, 'utf8'));
        if (result.error) {
            console.error(`Error minifying ${file}:`, result.error);
        } else {
            fs.writeFileSync(filePath, result.code);
            console.log(`${file} minified`);
        }
    });
}

// Run optimizations
(async () => {
    await compressImages();
    await minifyJS();
})();
