import { Component } from '@angular/core';
import {
  animate,
  animation,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';

const slideFromRight = animation([
  style({ opacity: 0, transform: 'translateX(100%)' }),
  animate('1s', style({ opacity: 1, transform: 'translateX(0%)' })),
]);
const slideIntoRight = animation(
  animate('1s', style({ opacity: 0, transform: 'translateX(100%)' }))
);

const slideFromLeft = animation([
  style({ opacity: 0, transform: 'translateX(-100%)' }),
  animate('1s', style({ opacity: 1, transform: 'translateX(0%)' })),
]);
const slideIntoLeft = animation(
  animate('1s', style({ opacity: 0, transform: 'translateX(-100%)' }))
);

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: false,
  animations: [
    trigger('rightBlocks', [
      transition('void => *', useAnimation(slideFromRight)),
      transition('* => void', useAnimation(slideIntoRight)),
    ]),
    trigger('leftBlocks', [
      transition('void => *', useAnimation(slideFromLeft)),
      transition('* => void', useAnimation(slideIntoLeft)),
    ]),
  ],
})
export class MainComponent {
  envName: string;
}
