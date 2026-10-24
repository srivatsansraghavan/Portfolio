import { Component, OnInit } from "@angular/core";
import CVDetails from "../../../assets/cv_srivatsan.json";
import { Actions, ofType } from "@ngrx/effects";
import { showWorkExperienceDetail } from "src/app/store/care-taken-details/care-taken-details.actions";

@Component({
    selector: 'app-main-card',
    templateUrl: './main-card.component.html',
    styleUrls: ['./main-card.component.css'],
    standalone: false,
})
export class MainCardComponent implements OnInit {
    name: string = CVDetails.name;
    title: string = CVDetails.title;
    linkedinUrl: string = CVDetails.linkedinUrl;
    summary: string = CVDetails.summary;
    technicalSkills: {
        frameworks: string[];
        programming_languages: string[];
        cloud_platforms: string[];
        databases: string[];
        message_brokers: string[];
        tools: string[];
    } = CVDetails.technical_skills;
    workExperience: { employer: string; designation: string; dateEmployed: string; details: string[] }[] = CVDetails.work_experience;
    workExperienceDetail: string[];
    workEmployer: string;
    showExperienceDetail = false;
    constructor(private actions$: Actions) {
    }

    ngOnInit() {
        this.actions$.pipe(ofType(showWorkExperienceDetail)).subscribe((employer) => {
            this.workExperienceDetail = this.workExperience.find((experience) => experience.employer === employer.employer)?.details;
            this.workEmployer = employer.employer;
            this.showExperienceDetail = true;
        });
    }

    hideDetail() {
        this.showExperienceDetail = false;
    }
}