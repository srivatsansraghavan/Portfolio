import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "src/app/shared/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrl: 'login.component.css',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
    @Output() closeModal = new EventEmitter<boolean>();
    @Output() openSignUp = new EventEmitter<boolean>();
    loginForm: FormGroup;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.loginForm = new FormGroup({
            loginEmail: new FormControl('', [Validators.required, Validators.email]),
            loginPassword: new FormControl(null, Validators.required),
        });
    }

    doLogin(): void {
        const loginEmail = this.loginForm.get('loginEmail').value;
        const loginPassword = this.loginForm.get('loginPassword').value;
        this.authService.loginUser(loginEmail, loginPassword);
        this.closeModal.emit(true);
    }

    openSignupModal() {
        this.closeModal.emit(true);
        this.openSignUp.emit(true);
    }
}