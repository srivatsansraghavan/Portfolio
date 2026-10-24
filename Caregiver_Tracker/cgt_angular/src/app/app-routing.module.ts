import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { AuthGuardService } from './shared/auth-guard.service';

const routes: Routes = [
  { path: 'cgt/home', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'login', component: MainComponent, canActivate: [AuthGuardService] },
  { path: 'home', component: MainComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
