import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trackItems', pure: true })
export class TrackItemsPipe implements PipeTransform {
  transform(pipeValue: unknown, trackLevel?: unknown) {
    if (!pipeValue) return [];
    switch (trackLevel) {
      case 'getKeyValue':
        return Object.keys(pipeValue).map((key) => [
          { key: key, value: pipeValue[key] },
        ]);
      case 'getValueArray':
        return Object.keys(pipeValue).map((key) => pipeValue[key]);
      default:
        return [];
    }
  }
}
