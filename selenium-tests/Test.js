var webdriver = require('selenium-webdriver');

// Input capabilities
var capabilities = {
    'browserName' : 'Chrome',
    'browser_version' : '51.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1024x768',
    'browserstack.user' : 'rebekahapelt1',
    'browserstack.key' : 'azL4tv1uZGa2NFSuz5QU'
};

var driver = new webdriver.Builder().
usingServer('http://hub-cloud.browserstack.com/wd/hub').
withCapabilities(capabilities).
build();

driver.get('http://www.google.com');
driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack');
driver.findElement(webdriver.By.name('btnG')).click();

driver.getTitle().then(function(title) {
    console.log(title);
});

driver.quit();