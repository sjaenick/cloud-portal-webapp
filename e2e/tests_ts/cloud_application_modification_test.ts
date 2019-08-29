// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from "../page_objects/application_formular.po";
import {ApplicationOverviewPage} from "../page_objects/application_overview.po";
import {Util} from "../util";

describe('Cloud ApplicationModification Test', function () {

    beforeAll(async function () {
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
    });

    it('should navigate to application overview', async function () {
        await ApplicationOverviewPage.navigateToApplicationOverview();
    });


    it('should send a modification request', async function () {
        await ApplicationOverviewPage.sendModificationRequest(Util.OPENSTACK_APPLICATION_NAME);
    });
});
