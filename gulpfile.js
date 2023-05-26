const gulp = require('gulp');

// Critical CSS
const penthouse = require('penthouse');
const fs = require('fs');
const urlList = require('./criticalcss-pagelist.json');
const concat = require('gulp-concat-css');
const cssmin = require('gulp-cssmin');
const {src, dest} = gulp;
const urlExists = require('url-exists');

const stage = 'live'
const domain = urlList.domains.find(domain => domain.name === stage);

gulp.task('critical-css', function () {
    console.log(domain);
    urlList.urls.forEach(function (item, i) {
        // first check if url from urlList exits
        urlExists(domain.link + item.link, function (err, exists) {
            if (!exists) {
                console.log(domain.link + item.link + " doesn't exits");
            }
        });

        // look to scss/inline/criticalcss-pagelist.json for list of input pages and output files
        penthouse({
            url: domain.link + item.link,  // can also use file:/// protocol for local files
            css: '../../../public/theme/50efd88eeaf7015d87475f14162d8fb3/css/all.css',  // path to original css file on disk
            width: 1920,  // viewport width. Adjust for your needs
            height: 1784,  // viewport height. Adjust for your needs
            keepLargerMediaQueries: true,  // when true, will not filter out larger media queries
            propertiesToRemove: [
                'background-image',
                /url\(/
            ],
            forceExclude: [
                '.my-class'
            ],
            userAgent: 'Penthouse Critical Path CSS Generator', // specify which user agent string when loading the page
            puppeteer: {
                getBrowser: undefined, // A function that resolves with a puppeteer browser to use instead of launching a new browser session
            }
        })
            .then(criticalCss => {
                // write critical CSS to a named file
                fs.writeFileSync('_critical/' + item.name + '.css', criticalCss);
            })
            .catch(err => {
                // handle the error
                console.log(err);
            })
    })

    src('_critical/*.css')
        .pipe(concat('critical.css'))
        .pipe(cssmin({
            minifyFontValues: false,
            discardUnused: {fontFace: true}
        }))
        .pipe(dest('src/Resources/views/storefront/critical_css/'));

    return new Promise(function (resolve, reject) {
        resolve();
    });
})
