// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const ***REMOVED***SpecReporter***REMOVED*** = require('jasmine-spec-reporter');
const fs = require('fs');
let rawdata = fs.readFileSync('tests/environment.json');
let credentials = JSON.parse(rawdata);

exports.config = ***REMOVED***
    seleniumAddress: 'http://localhost:4444/wd/hub',
    params: ***REMOVED***
    timeout: 10000,
    
    portal: 'http://portal-dev.denbi.de:8000',
    login: ***REMOVED***
      email: credentials['email'],
      password: credentials['password'],
      auth: 'google'
    ***REMOVED***
  ***REMOVED***,
  allScriptsTimeout: 11000,
  specs: [
    'cloud_application_test.ts'
  ],
  capabilities: ***REMOVED***
    'browserName': 'chrome',
    chromeOptions: ***REMOVED***
        args: ["--incognito"]
    ***REMOVED***
  ***REMOVED***,
  directConnect: true,
  framework: 'jasmine',
  jasmineNodeOpts: ***REMOVED***
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () ***REMOVED***
    ***REMOVED***
  ***REMOVED***,
  beforeLaunch: function () ***REMOVED***
    require('ts-node').register(***REMOVED***
      project: 'e2e/tsconfig.e2e.json'
    ***REMOVED***);
  ***REMOVED***,
  onPrepare() ***REMOVED***
    jasmine.getEnv().addReporter(new SpecReporter(***REMOVED***spec: ***REMOVED***displayStacktrace: true***REMOVED******REMOVED***));
      browser.manage().window().setSize(1600, 1000);
  ***REMOVED***
***REMOVED***;
