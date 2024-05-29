const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

async function runTests() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Test 1: Verify login with valid credentials
        await driver.get('https://the-internet.herokuapp.com/login');
        await driver.findElement(By.id('username')).sendKeys('tomsmith');
        await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.wait(until.urlIs('https://the-internet.herokuapp.com/secure'), 5000);
        let successMsg = await driver.findElement(By.css('.flash.success')).getText();
        assert.strictEqual(successMsg.includes('You logged into a secure area!'), true);

        // Test 2: Verify login with invalid credentials
        await driver.get('https://the-internet.herokuapp.com/login');
        await driver.findElement(By.id('username')).sendKeys('invalidUser');
        await driver.findElement(By.id('password')).sendKeys('invalidPassword');
        await driver.findElement(By.css('button[type="submit"]')).click();
        let errorMsg = await driver.findElement(By.css('.flash.error')).getText();
        assert.strictEqual(errorMsg.includes('Your username is invalid!'), true);

        // Test 3: Verify login with empty username and password fields
        await driver.get('https://the-internet.herokuapp.com/login');
        await driver.findElement(By.css('button[type="submit"]')).click();
        errorMsg = await driver.findElement(By.css('.flash.error')).getText();
        assert.strictEqual(errorMsg.includes('Your username is invalid!'), true);

        // Test 4: Verify login with valid username and empty password
        await driver.get('https://the-internet.herokuapp.com/login');
        await driver.findElement(By.id('username')).sendKeys('tomsmith');
        await driver.findElement(By.css('button[type="submit"]')).click();
        errorMsg = await driver.findElement(By.css('.flash.error')).getText();
        assert.strictEqual(errorMsg.includes('Your password is invalid!'), true);

        // Test 5: Verify login with empty username and valid password
        await driver.get('https://the-internet.herokuapp.com/login');
        await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');
        await driver.findElement(By.css('button[type="submit"]')).click();
        errorMsg = await driver.findElement(By.css('.flash.error')).getText();
        assert.strictEqual(errorMsg.includes('Your username is invalid!'), true);

    } finally {
        await driver.quit();
    }
}

runTests();