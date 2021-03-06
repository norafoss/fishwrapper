/*
 * Copyright 2019 Zane Littrell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const webdriver = require('selenium-webdriver'),
  until = webdriver.until,
  By = webdriver.By;
const firefox = require('selenium-webdriver/firefox');
const should = require('chai').should();
const db = require('../db/issues.js');
const Login = require('../lib/login.js');
const faker = require('faker');

let driver;

describe('IssuesEdit', function() {
  beforeEach(function() {
    driver = new webdriver.Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(new firefox.Options().headless())
      .build();
  });
  afterEach(async function() {
    this.timeout(0);
    try {
      await driver.quit();
    } catch (error) {
      throw error;
    }
  });
  it('should require login', async function() {
    this.timeout(0);
    try {
      const fakeLink = faker.internet.url();
      await db.put(1, fakeLink);
      await driver.get('http://localhost:3000/issues/1/edit');
      await driver.wait(until.urlContains('/login'));

      const url = await driver.getCurrentUrl();
      url.should.equal('http://localhost:3000/login');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  it('should change the issue link', async function() {
    this.timeout(0);
    try {
      const fakeLink = faker.internet.url();
      await db.put(1, fakeLink);
      await Login.login(driver);
      await driver.get('http://localhost:3000/issues/1/edit');

      await driver.findElement(By.name('link')).sendKeys(process.cwd()
        + '/test/assets/test.pdf');
      await driver.findElement(By.id('form-submit')).click();

      await driver.wait(until.urlIs('http://localhost:3000/issues'));

      // Ensure that a db Item was changed with the matching data
      const item = await db.get(1);
      item.Item.link.should.not.equal(fakeLink);
      item.Item.link.should.have.string('test.pdf');

      await db.delete(1);
      await Login.logout(driver);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
