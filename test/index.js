var puppeteer = require('puppeteer');

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    var page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate the page to a URL
    await page.goto('https://floppyfingers.online/createRoom');
  
    /*
    const url = await page.url();
    for(var i = 0; i < 10; i++){
        var page = await browser.newPage();
        page.goto(url);
    }*/


})();