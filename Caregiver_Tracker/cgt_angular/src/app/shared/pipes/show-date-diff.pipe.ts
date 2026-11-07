import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'dateDiff', pure: true })
export class DateDiffPipe implements PipeTransform {
  transform(pipeValue: string) {
    if (!pipeValue) return [];
    console.log(pipeValue)
    return moment().calendar(pipeValue, { sameDay: '[Today]', lastDay: '[Yesterday]', lastWeek: '[Last Week]' });
  }
}
