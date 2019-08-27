// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from './page_objects/login.po';
import {FormularPage} from "./page_objects/application_formular.po";
import {ApplicationOverviewPage} from "./page_objects/application_overview.po";

describe('Simple Application Test', function () {
    
    beforeEach(async function () {
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, true);
    });

    it('should send a simple vm application', async function () {
        await FormularPage.navigateToSimpleVmApplication();
        console.log('Getting form.');
        await FormularPage.fillFormular();

        await FormularPage.submitApplication();
        let isPresent: boolean = await ApplicationOverviewPage.isApplicationRequestPresent("ProtractorTest");
        expect(isPresent).toBeTruthy();

    });
});
