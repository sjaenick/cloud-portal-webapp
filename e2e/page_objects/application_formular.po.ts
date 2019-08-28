import ***REMOVED***browser, by, element, protractor, ProtractorExpectedConditions***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from "../util";

export class FormularPage ***REMOVED***
    private static timeout: number = browser.params.timeout;
    private static auth = browser.params.login.auth;
    private static SUBMIT_BTN: string = "submit_btn";
    private static VERIFICATION_BTN: string = "verification_btn";
    private static ACKNOWLEDGE_BTN: string = 'acknowledge_approve_btn';
    private static NOTIFICATION_REDIRECT_BTN: string = "notification_btn_redirect";

    static async submitApplication(): Promise<any> ***REMOVED***
        console.log("Submit Application");

        await Util.waitForElementToBeClickableById(this.SUBMIT_BTN);
        const submitBtn = element(by.id(this.SUBMIT_BTN));

        await submitBtn.click();
        await Util.waitForElementToBeClickableById(this.VERIFICATION_BTN);
        const verificationBtn = element(by.id(this.VERIFICATION_BTN));

        await verificationBtn.click();

        await browser.sleep(1000);
        await Util.waitForElementToBeClickableById(this.ACKNOWLEDGE_BTN);

        const acknowledgeBtn = element(by.id(this.ACKNOWLEDGE_BTN));
        await acknowledgeBtn.click();

        await Util.waitForElementToBeClickableById(this.NOTIFICATION_REDIRECT_BTN);

        const redirectBtn = element(by.id(this.NOTIFICATION_REDIRECT_BTN));
        await redirectBtn.click();

        console.log('Submitted Application');

    ***REMOVED***

    static async navigateToCloudApplication(): Promise<any> ***REMOVED***
        console.log("Navigate to CloudApplicaiton form");
        let url = await browser.driver.getCurrentUrl();
        console.log('GetUrl: ' + url);
        url = url.substring(0, url.indexOf('#'));
        console.log('SubstringUrl: ' + url);
        console.log('AddedUrl: ' + url + '#/applications/newCloudApplication');

        await browser.driver.get(url + '#/applications/newCloudApplication');
        await Util.waitForPage('#/applications/newCloudApplication');


    ***REMOVED***

    static async navigateToSimpleVmApplication(): Promise<any> ***REMOVED***
        console.log("Navigate to SimpleApplication form");

        let url = await browser.driver.getCurrentUrl();
        console.log('GetUrl: ' + url);
        url = url.substring(0, url.indexOf('#'));
        console.log('SubstringUrl: ' + url);
        console.log('AddedUrl: ' + url + '#/applications/newSimpleVmApplication');
        await browser.driver.get(url + '#/applications/newSimpleVmApplication');
        await Util.waitForPage('#/applications/newSimpleVmApplication');

    ***REMOVED***


    static async fillFormular(name:string): Promise<any> ***REMOVED***

        console.log('Getting form.');
        // fill  Formular
        console.log("Fill form");
        element(by.name('project_application_name')).sendKeys(name);
        element(by.name('project_application_shortname')).sendKeys(name);
        element(by.name('project_application_description')).sendKeys('ProtractorTest Description');
        element(by.name('project_application_lifetime')).sendKeys('4');
        element(by.name('project_application_institute')).sendKeys('Proctractor Institute');
        element(by.name('project_application_workgroup')).sendKeys('Proctractor Workgroup');
        element(by.name('project_application_bmbf_project')).sendKeys('BMBF Project');
        element(by.name('project_application_elixir_project')).sendKeys('Elixir Project');
        element(by.id('project_application_de.NBI default')).sendKeys('1');
        element(by.name('project_application_horizon2020')).sendKeys('Horizon2020Project');
        element(by.id('id_project_application_report_allowed')).click();
        element(by.id('dissemination_information_accordion')).click();
        element(by.name('information_public_title_input')).sendKeys("A Public Title");
        element(by.id('public_description_enabled')).click();
        element(by.name('information_description')).sendKeys("A Public Description");
        element(by.id('information_resources_checkbox')).click();
        element(by.id('information_lifetime_checkbox')).click();
        element(by.id('information_project_type_checkbox')).click();
        element(by.id('information_pi_name_checkbox')).click();
        element(by.id('information_institution_checkbox')).click();
        element(by.id('information_workgroup_checkbox')).click();
        element(by.id('information_project_affiliation_checkbox')).click();
        element(by.id('platform_newsletter_checkbox')).click();
        element(by.id('platform_landing_page_checkbox')).click();
        element(by.id('platform_portal_news_checkbox')).click();
        element(by.id('platform_twitter_checkbox')).click();
        element(by.id('project_application_pi_approved_checkbox')).click();
        element(by.id('project_application_responsibility_checkbox')).click();
    ***REMOVED***
***REMOVED***
