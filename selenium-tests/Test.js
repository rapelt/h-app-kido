var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;

var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

driver.get('http://testHappkido.heroku.com');

driver.findElement(webdriver.By.id("username")).sendKeys("admin");
driver.findElement(webdriver.By.id("password")).sendKeys("admin");
driver.findElement(webdriver.By.id("submit-button")).click();

driver.getTitle().then(function(title) {
    console.log(title);
});



/*driver.get('http://www.google.com');

var element = driver.findElement(webdriver.By.name('q'));
element.sendKeys('Cheese!');
element.submit();

driver.getTitle().then(function(title) {
    console.log('Page title is: ' + title);
});

driver.wait(function() {
    return driver.getTitle().then(function(title) {
        return title.toLowerCase().lastIndexOf('cheese!', 0) === 0;
    });
}, 3000);

driver.getTitle().then(function(title) {
    console.log('Page title is: ' + title);
});*/

driver.quit();
