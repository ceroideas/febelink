import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: string, prefix: string = 'hace', suffix: string = ''): string {
    if (!value) {
      return value;
    }

    value = (value.replace(' ', 'T')).replace(/\//g, '-');

    // Get localdate
    const localDate = new Date();

    // Get difference in seconds
    let seconds = Math.floor((+localDate - +new Date(value)) / 1000);

    // Apply timezone difference
    seconds += (localDate.getTimezoneOffset() * 60);

    if (seconds < 29) {
      return 'Ahora mismo';
    }

    let intervals: any = {}
    intervals = {
      'año': 31536000,
      'mes': 2592000,
      'semana': 604800,
      'día': 86400,
      'hora': 3600,
      'minuto': 60,
      'segundo': 1
    };

    let counter;
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        let $plural = '';
        if (counter > 1) {
          $plural = 's';
          if (i === 'mes') {
            $plural = 'es';
          }
        }

        return prefix + ' ' + counter + ' ' + i + $plural + ' ' + suffix;
      }
    }

    return value;
  }
}
