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

driver.get('http://testHappkido.heroku.com');
/*driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack');
driver.findElement(webdriver.By.name('btnG')).click();*/

driver.findElement(webdriver.By.id("username")).sendKeys("admin");
driver.findElement(webdriver.By.id("password")).sendKeys("admin");
driver.findElement(webdriver.By.id("submit-button")).click();

driver.getTitle().then(function(title) {
    console.log(title);
});

driver.quit();