import {
  query,
  transition,
  style,
  stagger,
  animate,
} from '@angular/animations';

export const addFeedAnimation = [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(-100%)' }),
      stagger(
        '120ms',
        animate(
          '1s ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        )
      ),
    ]),
  ]),
];
