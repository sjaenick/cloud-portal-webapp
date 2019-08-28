// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from "../page_objects/application_formular.po";
import {ApplicationOverviewPage} from "../page_objects/application_overview.po";
import {Util} from "../util";
import {FacilityOverviewPage} from "../page_objects/facility_overview.po";

describe('Cloud Application Approval Test', function () {

    beforeAll(async function () {
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
    });

    it('should navigate to application overview', async function () {
        await ApplicationOverviewPage.navigateToApplicationOverview();


    });

    it('should approve cloud application with denbi default facility', async function () {
        await ApplicationOverviewPage.approveCloudApplication(Util.OPENSTACK_APPLICATION_NAME);
    });

    it('should relog with facility manager', async function () {
        await LoginPage.login(browser.params.login.email_fm, browser.params.login.password_fm, browser.params.login.auth_fm, true);
    });

    it('should navigate to facility overview', async function () {
        FacilityOverviewPage.navigateToFacilityOverview();
    });

    it('should approve cloud application', async function () {
        FacilityOverviewPage.approveApplication(Util.OPENSTACK_APPLICATION_NAME);
        browser.sleep(10000)
    });


});
