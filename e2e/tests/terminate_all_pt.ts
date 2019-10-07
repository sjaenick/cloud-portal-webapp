// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from '../page_objects/application_formular.po';
import {Util} from '../util';
import {VoOverviewPage} from '../page_objects/vo_overview.po';

describe('Simple Application Test', function () {

  beforeAll(async function () {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
  });

  it('should navigate to the vo overview', async function () {
    console.log('Starting terminate simple vm application test');
    await VoOverviewPage.navigateToVolumeOverview();
  });

  it('should filter projects', async function () {
    await VoOverviewPage.filterForPTProjets();

  });

  it('should terminate projects', async function () {
        await VoOverviewPage.getAllPTProjects();

    //await VoOverviewPage.terminateProject('show_terminate_12086')

  });

});
