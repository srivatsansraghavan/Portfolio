import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  elapsedHour = '00';
  elapsedMinute = '00';
  elapsedSecond = '00';
  totalSeconds = 0;
  currentTime: Date;

  start(startedTime: Date) {
    this.elapsedHour = '00';
    this.elapsedMinute = '00';
    this.elapsedSecond = '00';
    const interval = setInterval(() => {
      this.currentTime = new Date();
      const diffTimeSecond = Math.floor(
        (this.currentTime.getTime() - startedTime.getTime()) / 1000
      );
      this.totalSeconds = diffTimeSecond;
      const diffTimeMinute = Math.floor(
        (this.currentTime.getTime() - startedTime.getTime()) / 60000
      );
      const diffTimeHour = Math.floor(
        (this.currentTime.getTime() - startedTime.getTime()) / 3600000
      );
      this.elapsedSecond = (
        diffTimeSecond > 59 ? diffTimeSecond % 60 : diffTimeSecond
      ).toLocaleString('en-US', { minimumIntegerDigits: 2 });
      this.elapsedMinute = (
        diffTimeMinute > 59 ? diffTimeMinute % 60 : diffTimeMinute
      ).toLocaleString('en-US', { minimumIntegerDigits: 2 });
      this.elapsedHour = (
        diffTimeHour > 23 ? diffTimeHour % 24 : diffTimeHour
      ).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    }, 1000);
    return interval;
  }

  stop(trackerInterval) {
    clearInterval(trackerInterval);
    return this.totalSeconds;
  }
}
