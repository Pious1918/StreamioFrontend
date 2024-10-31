import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativetime',
  standalone: true
})
export class RelativetimePipe implements PipeTransform {

  transform(value: string | Date):string {
    
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Calculate time intervals
    let interval = Math.floor(seconds / 31536000);
    if (interval === 1) return `1 year ago`;
    if (interval > 1) return `${interval} years ago`;

    interval = Math.floor(seconds / 2592000); // Months
    if (interval === 1) return `1 month ago`;
    if (interval > 1) return `${interval} months ago`;

    interval = Math.floor(seconds / 86400); // Days
    if (interval === 1) return `1 day ago`;
    if (interval > 1) return `${interval} days ago`;

    interval = Math.floor(seconds / 3600); // Hours
    if (interval === 1) return `1 hour ago`;
    if (interval > 1) return `${interval} hours ago`;

    interval = Math.floor(seconds / 60); // Minutes
    if (interval === 1) return `1 minute ago`;
    if (interval > 1) return `${interval} minutes ago`;

    return `${seconds} seconds ago`;
  }

}
