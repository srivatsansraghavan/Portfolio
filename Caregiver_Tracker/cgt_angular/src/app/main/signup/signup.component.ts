import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/shared/auth.service";

@Component({
    selector: 'app-signup',
    templateUrl: 'signup.component.html',
    styleUrl: 'signup.component.css',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {
    @Output() closeModal = new EventEmitter<boolean>();
    @Output() openLogin = new EventEmitter<boolean>();
    signUpForm: FormGroup;
    num1: number;
    num2: number;
    constructor(private modal: NgbModal, private authService: AuthService) {
        this.num1 = Math.floor(Math.random() * 100);
        this.num2 = Math.floor(Math.random() * 100);
    }

    ngOnInit() {
        this.signUpForm = new FormGroup({
            signUpEmail: new FormControl('', [Validators.required, Validators.email]),
            signUpPassword: new FormControl('', Validators.required),
            signUpRepeatPassword: new FormControl('', Validators.required),
            signUpFullName: new FormControl('', Validators.required),
            signUpAddVerify: new FormControl('', Validators.required),
        });
    }


    isSignupPasswordOk(): boolean {
        if (
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/.test(
                this.signUpForm.get('signUpPassword').value
            )
        ) {
            if (this.signUpForm.get('signUpPassword').value != '') {
                this.signUpForm.get('signUpPassword').setErrors(null);
            }
            return true;
        } else {
            if (this.signUpForm.get('signUpPassword').value != '') {
                this.signUpForm.get('signUpPassword').setErrors({
                    invalidPassword: true,
                });
            }
            return false;
        }
    }

    isPasswordRepeatPasswordSame(): boolean {
        if (
            this.signUpForm.get('signUpPassword').value ==
            this.signUpForm.get('signUpRepeatPassword').value
        ) {
            this.signUpForm.get('signUpRepeatPassword').setErrors(null);
            return true;
        } else {
            this.signUpForm.get('signUpRepeatPassword').setErrors({
                notSamePassword: true,
            });
            return false;
        }
    }

    isFullNameOk(): boolean {
        if (/^[a-zA-Z\s]+$/.test(this.signUpForm.get('signUpFullName').value)) {
            if (this.signUpForm.get('signUpFullName').value != '') {
                this.signUpForm.get('signUpFullName').setErrors(null);
            }
            return true;
        } else {
            if (this.signUpForm.get('signUpFullName').value != '') {
                this.signUpForm.get('signUpFullName').setErrors({
                    notFullName: true,
                });
            }
            return false;
        }
    }

    isAddVerifyOk(): boolean {
        if (this.signUpForm.get('signUpAddVerify').value != '') {
            if (
                this.num1 + this.num2 ==
                this.signUpForm.get('signUpAddVerify').value
            ) {
                this.signUpForm.get('signUpAddVerify').setErrors(null);
                return true;
            } else {
                this.signUpForm.get('signUpAddVerify').setErrors({
                    notEqualVerify: true,
                });
                return false;
            }
        } else {
            return false;
        }
    }

    doSignUp(): void {
        const signUpEmail = this.signUpForm.get('signUpEmail').value;
        const signUpPassword = this.signUpForm.get('signUpPassword').value;
        const signUpFullName = this.signUpForm.get('signUpFullName').value;
        this.authService.signUpUser(signUpEmail, signUpPassword, signUpFullName);
        this.closeModal.emit(true);
    }

    openLoginModal() {
        this.closeModal.emit(true);
        this.openLogin.emit(true);
    }
}