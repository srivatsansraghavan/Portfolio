import { Component } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toast.component.html',
  standalone: false,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 100',
  },
})
export class ToastComponent {
  loggedIn = false;

  constructor(public toastService: ToastService) {}
}
