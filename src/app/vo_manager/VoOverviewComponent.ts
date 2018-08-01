import ***REMOVED***Component, Input, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";
import ***REMOVED***Project***REMOVED*** from "../projectmanagement/project.model";
import ***REMOVED***ProjectMember***REMOVED*** from "../projectmanagement/project_member.model";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import * as moment from 'moment';

@Component(***REMOVED***
    selector: 'voOverview',
    templateUrl: 'voOverview.component.html',
    providers: [VoService, GroupService]


***REMOVED***)

export class VoOverviewComponent ***REMOVED***

    public emailSubject: string;
    public emailReply: string = '';
    public emailText: string;
    public emailStatus: number = 0;
    public emailHeader: string;
    public emailVerify: string;
    public emailType: number;
    public newsletterSubscriptionCounter: number;
    isLoaded = false;

    member_id: number;
    projects: Project[] = new Array();


    // modal variables for User list
    public usersModal;
    public usersModalProjectMembers: ProjectMember[] = new Array;
    public usersModalProjectID: number;
    public usersModalProjectName: string;


    public managerFacilities: [string, number][];
    public selectedFacility: [string, number]


    constructor(private voserice: VoService, private groupservice: GroupService) ***REMOVED***
        this.getVoProjects();
        this.voserice.getNewsletterSubscriptionCounter().subscribe(result => ***REMOVED***
            this.newsletterSubscriptionCounter = result['subscribed'];
        ***REMOVED***);


    ***REMOVED***


    sendEmail(subject: string, message: string, reply?: string) ***REMOVED***
        switch (this.emailType) ***REMOVED***
            case 0: ***REMOVED***
                this.sendMailToVo(subject, message, reply);
                break;
            ***REMOVED***
            case 1: ***REMOVED***
                this.sendNewsletterToVo(subject, message, reply);
                break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

    sendNewsletterToVo(subject: string, message: string, reply?: string) ***REMOVED***
        this.voserice.sendNewsletterToVo(encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => ***REMOVED***
            if (result == 1) ***REMOVED***
                this.emailStatus = 1;
            ***REMOVED***
            else ***REMOVED***
                this.emailStatus = 2;
            ***REMOVED***
        ***REMOVED***)

    ***REMOVED***


    sendMailToVo(subject: string, message: string, reply?: string) ***REMOVED***
        this.voserice.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => ***REMOVED***
            if (result == 1) ***REMOVED***
                this.emailStatus = 1;
            ***REMOVED***
            else ***REMOVED***
                this.emailStatus = 2;
            ***REMOVED***
        ***REMOVED***)

    ***REMOVED***

    setEmailType(type: number) ***REMOVED***
        this.emailType = type;
        switch (this.emailType) ***REMOVED***
            case 0: ***REMOVED***
                this.emailHeader = 'Send email to all members of\n' +
                    '                    the vo';
                this.emailVerify = 'Are you sure you want to send this email to all members of the vo?';
                break;
            ***REMOVED***
            case 1: ***REMOVED***
                this.emailHeader = 'Send newsletter to vo';
                this.emailVerify = 'Are you sure you want to send this newsletter?'
                break;
            ***REMOVED***

        ***REMOVED***

    ***REMOVED***

    public resetEmailModal() ***REMOVED***


        this.emailHeader = null;
        this.emailSubject = null;
        this.emailText = null;
        this.emailType = null;
        this.emailVerify = null;
        this.emailReply = '';
        this.emailStatus = 0;

    ***REMOVED***


    getVoProjects() ***REMOVED***
        let projects_ready = ***REMOVED******REMOVED***;
        this.voserice.getAllVoGroups().subscribe(result => ***REMOVED***
            let number_voprojects = result.length;
            if (number_voprojects == 0)***REMOVED***
                this.isLoaded=true;
            ***REMOVED***
            for (let group of result) ***REMOVED***
                projects_ready[group['id']] = false;

                this.groupservice.getShortame(group['id']).subscribe(name => ***REMOVED***

                        let shortname = name['shortname']
                        if (!shortname) ***REMOVED***
                            shortname = group['name']
                        ***REMOVED***

                        let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                        let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                        let is_pi = false;
                        let is_admin = false;
                        let newProject = new Project(
                            group["id"],
                            shortname,
                            group["description"],
                            dateCreated.date() + "." + (dateCreated.month() + 1) + "." + dateCreated.year(),
                            dateDayDifference,
                            is_pi,
                            is_admin,
                            [result['Facility'], result['FacilityId']]
                        );
                        newProject.Lifetime = group['lifetime']
                        if (newProject.Lifetime != -1) ***REMOVED***
                            newProject.LifetimeDays = Math.ceil(Math.ceil(Math.abs(moment(dateCreated).add(newProject.Lifetime, 'months').toDate().getTime() - moment(dateCreated).valueOf())) / (1000 * 3600 * 24));
                            let expirationDate = moment(dateCreated).add(newProject.Lifetime, 'months').toDate();
                            newProject.DateEnd = moment(expirationDate).date() + "." + (moment(expirationDate).month() + 1) + "." + moment(expirationDate).year();
                        ***REMOVED***

                        else ***REMOVED***
                            newProject.LifetimeDays = -1;
                        ***REMOVED***


                        this.projects.push(newProject);
                        projects_ready[group['id']] = true;

                        let all_ready = true;
                        if (Object.keys(projects_ready).length == number_voprojects) ***REMOVED***

                            for (let key in projects_ready) ***REMOVED***
                                if (projects_ready[key] == false) ***REMOVED***
                                    all_ready = false

                                ***REMOVED***
                            ***REMOVED***
                            if (all_ready == true) ***REMOVED***

                                this.isLoaded = true
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                )
            ***REMOVED***


        ***REMOVED***)


    ***REMOVED***

    lifeTimeReached(lifetimeDays: number, running: number): string ***REMOVED***

        if (lifetimeDays == -1) ***REMOVED***
            return "blue";
        ***REMOVED***
        return (lifetimeDays - running) < 0 ? "red" : "black";
    ***REMOVED***

    getMembesOfTheProject(projectid: number, projectname: string) ***REMOVED***
        this.groupservice.getGroupMembers(projectid.toString()).subscribe(members => ***REMOVED***
                this.usersModalProjectID = projectid;
                this.usersModalProjectName = projectname;
                this.usersModalProjectMembers = new Array();
                for (let member of members) ***REMOVED***
                    let member_id = member["id"];
                    let user_id = member["userId"];
                    let fullName = member["user"]["firstName"] + " " + member["user"]["lastName"];
                    this.usersModalProjectMembers.push(new ProjectMember(user_id, fullName, member_id));
                ***REMOVED***

            ***REMOVED***
        )
    ***REMOVED***

    public showMembersOfTheProject(projectid: number, projectname: string, facility: [string, number]) ***REMOVED***
        this.getMembesOfTheProject(projectid, projectname);

    ***REMOVED***


***REMOVED***
