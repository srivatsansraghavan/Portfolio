import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'dateDiff', pure: true })
export class DateDiffPipe implements PipeTransform {
  transform(pipeValue: string) {
    if (!pipeValue) return [];
    return moment(pipeValue, 'YYYY-MM-DD').fromNow();
  }
}
