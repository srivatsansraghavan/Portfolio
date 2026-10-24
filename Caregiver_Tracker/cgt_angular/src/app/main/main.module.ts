import { NgModule } from "@angular/core";
import { MainComponent } from "./main.component";
import { MainCardComponent } from "./main-card/main-card.component";
import { ExperienceCardComponent } from "./main-card/experience-card/experience-card.component";
import { SharedModule } from "../shared/shared.module";
import { JsonPipe } from "@angular/common";

@NgModule({
    declarations: [MainComponent, MainCardComponent, ExperienceCardComponent],
    imports: [SharedModule, JsonPipe],
})
export class MainModule { }
