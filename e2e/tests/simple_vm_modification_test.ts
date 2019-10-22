// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from '../page_objects/application_formular.po';
import {ApplicationOverviewPage} from '../page_objects/application_overview.po';
import {Util} from '../util';
import {ProjectOverview} from '../page_objects/project_overview.po';

describe('Simple Application Modification Test', function () {

  beforeAll(async function () {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
  });

  it('should navigate to application overview', async function () {
    console.log('Starting send a simple vm modification request test!');
    await ProjectOverview.navigateToSimpleProjectverview();
  });

  it('should open the modification request modal', async function () {
    await ProjectOverview.openModificationModal(Util.SIMPLE_VM_APPLICATION_NAME);
  });

  it('should have old values prefilled', async function () {
    await ProjectOverview.areDefaultValuesSetOpenstack();
  });

  it('should fill modification formular', async function () {
    await ProjectOverview.fillModificationRequest();
  });

  it('should have total ram and cores right', async function () {
    await ProjectOverview.checkTotalCoresRam();
  });

  it('should send a modification request', async function () {
    await ProjectOverview.sendModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
  });
});