import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FirstLoginComponent } from './home/first-login/first-login.component';
import { FeedingTrackerComponent } from './home/feeding-tracker/feeding-tracker.component';
import { ExcretionTrackerComponent } from './home/excretion-tracker/excretion-tracker.component';
import { MedicationTrackerComponent } from './home/medication-tracker/medication-tracker.component';
import { InventoryTrackerComponent } from './home/inventory-tracker/inventory-tracker.component';
import { CareTakenDetailsComponent } from './home/care-taken-details/care-taken-details.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CareTakenDetailsEffects } from './store/care-taken-details/care-taken-details.effects';
import { careTakenDetailReducer, careTakenDetailsReducer, showExperienceReducer } from './store/care-taken-details/care-taken-details.reducer';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MainModule } from './main/main.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        FirstLoginComponent,
        FeedingTrackerComponent,
        ExcretionTrackerComponent,
        MedicationTrackerComponent,
        InventoryTrackerComponent,
        CareTakenDetailsComponent,
    ],
    bootstrap: [AppComponent],
    imports: [BrowserModule,
        BrowserAnimationsModule,
        NgbModule,
        NgbNavModule,
        ReactiveFormsModule,
        AppRoutingModule,
        FormsModule,
        RouterModule,
        StoreModule.forRoot({ caretakendetail: careTakenDetailReducer, caretakendetails: careTakenDetailsReducer, experiencedetail: showExperienceReducer }),
        EffectsModule.forRoot([CareTakenDetailsEffects]),
        StoreDevtoolsModule.instrument({ logOnly: environment.production }),
        SharedModule,
        MainModule,],
    providers: [
        provideHttpClient(withInterceptors([(req, next) => {
            const withCredReq = req.clone({
                withCredentials: true,
            });
            return next(withCredReq);
        }])),
    ]
})
export class AppModule { }
