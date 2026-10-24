import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLoginComponent } from './first-login.component';
import { provideHttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { FirstLoginService } from './first-login.service';

describe('FirstLoginComponent', () => {
  let component: FirstLoginComponent;
  let fixture: ComponentFixture<FirstLoginComponent>;
  let authService: AuthService;
  const mockModalService = {
    open: jasmine.createSpy('open'),
    dismissAll: jasmine.createSpy('dismissAll'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstLoginComponent],
      imports: [],
      providers: [provideHttpClient(),
      { provide: NgbModal, useValue: mockModalService },
        FirstLoginService]
    }).compileComponents();

    fixture = TestBed.createComponent(FirstLoginComponent);
    authService = TestBed.inject(AuthService);
    component = fixture.componentInstance;
    component.careTakenDOB = { year: 2026, month: 12, day: 28 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal and logout', () => {
    const logoutSpy = spyOn(authService, 'doLogOut').and.callThrough();
    component.closeModalLogOut();
    expect(mockModalService.dismissAll).toHaveBeenCalled();
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should call assignRoles of service', () => {
    const addRoleSpy = spyOn(component['flService'], 'addRole');

    component.assignRoles();
    expect(addRoleSpy).toHaveBeenCalled();
  });
});
