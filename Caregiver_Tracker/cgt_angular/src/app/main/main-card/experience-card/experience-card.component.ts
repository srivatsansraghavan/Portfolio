import { Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { showWorkExperienceDetail } from "src/app/store/care-taken-details/care-taken-details.actions";

@Component({
    selector: 'app-experience-card',
    templateUrl: './experience-card.component.html',
    styleUrls: ['./experience-card.component.css'],
    standalone: false,
})
export class ExperienceCardComponent {
    showHeader = true;
    cards = ['main_card', 'feeding_tracker', 'excretion_tracker', 'medication_tracker', 'inventory_tracker'];
    chosenCard = 'main_card';
    @Input() employer: string;
    @Input() designation: string;
    @Input() dateEmployed: string;
    constructor(private store: Store) {
        console.log(this.employer, this.designation, this.dateEmployed);
    }

    showDetail() {
        this.showHeader = false;
        this.store.dispatch(showWorkExperienceDetail({ employer: this.employer }))
    }
    hideDetail() {
        this.showHeader = true;
    }
}