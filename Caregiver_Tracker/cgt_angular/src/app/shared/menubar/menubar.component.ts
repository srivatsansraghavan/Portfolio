import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { AuthService } from '../auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menubar',
  templateUrl: 'menubar.component.html',
  styleUrls: ['menubar.component.css'],
  standalone: false,
})
export class MenubarComponent implements OnInit, AfterContentChecked {
  envName: string;
  isLoggedIn: boolean;
  loggedInUser: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService,
    public modal: NgbModal,
  ) {

  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.shouldAllow();
    this.loggedInUser = this.authService.loggedInUserEmail();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  openProfileModal(profile_modal: TemplateRef<null>): void {
    this.modal.open(profile_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
    });
  }

  openSignupModal(signup_modal: TemplateRef<null>): void {
    this.modal.open(signup_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'md',
    });
  }

  openLoginModal(login_modal: TemplateRef<null>): void {
    this.modal.open(login_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
    });
  }

  showChanges(history_modal: TemplateRef<null>): void {
    this.modal.open(history_modal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  closeHistoryModal(): void {
    this.modal.dismissAll();
  }

  closeProfileModal() {
    this.modal.dismissAll();
  }

  doLogout(): void {
    this.authService.doLogOut();
  }
}
