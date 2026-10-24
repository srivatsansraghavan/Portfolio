import { NgModule } from "@angular/core";
import { MenubarComponent } from "./menubar/menubar.component";
import { ShowEditDeleteDirective } from "./directives/mousehover.directive";
import { DateDiffPipe } from "./pipes/show-date-diff.pipe";
import { TrackItemsPipe } from "./pipes/track-items.pipe";
import { AuthService } from "./auth.service";
import { AuthGuardService } from "./auth-guard.service";
import { TimerComponent } from "./timer/timer.component";
import { ToastComponent } from "./toast/toast.component";
import { ToastService } from "./toast/toast.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SignupComponent } from "../main/signup/signup.component";
import { LoginComponent } from "../main/login/login.component";
import { RouterModule } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@NgModule({
    declarations: [MenubarComponent, ShowEditDeleteDirective, TimerComponent, ToastComponent, TrackItemsPipe, DateDiffPipe],
    imports: [NgbModule, SignupComponent, LoginComponent, RouterModule],
    providers: [AuthService, AuthGuardService, ToastService, CookieService],
    exports: [ToastComponent, TrackItemsPipe, DateDiffPipe, MenubarComponent, TimerComponent],
})
export class SharedModule { }