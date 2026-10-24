import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  show(header: string, text: string, toastClass: string, autohide: boolean) {
    this.toasts.push({
      headertext: header,
      displaytext: text,
      classname: toastClass,
      autohide: autohide,
    });
  }
}

interface Toast {
  headertext: string;
  displaytext: string;
  classname: string;
  autohide: boolean;
}