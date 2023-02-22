import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SSNFormat'
})
export class SSNFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
    if (value === undefined) {
      return '';
    } else if (value != null || value !== 0 ) {
      value = '0000000000' + value;
      return 'XXX-XX-' + value.substring(value.length - 4, value.length);
    } else {
      return '';
    }
  }
  }

}


@Pipe({
  name: 'eventHolidayType'
})
export class eventHolidayType implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
    if (value.length >0) {
 
      let holidaytype = value.map(item => item.holidayType)
      return holidaytype[0];
    }else {
      return 'W';
    }
  }
  }

}


@Pipe({
  name: 'TotalHours'
})
export class TotalHours implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
    if (value.length >0) {
 
      
      return value.map(item => item.totalHours).reduce((prev, next) => prev + next);;
    }else {
      return 0;
    }
  }
  }

}

@Pipe({
  name: 'WeeklyTotalHoursPipe'
})
export class WeeklyTotalHoursPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
    if (value.length >0) {
      return value.map(item => item.weeklyTotalHours);
    }else {
      return 0;
    }
  }
  }

}

@Pipe({
  name: 'NextMonthWeeklyTotalHoursPipe'
})
export class NextMonthWeeklyTotalHoursPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      let last = value[value.length-1];
      if (last) {
      return last.weeklyTotalHours
     }else {
      return 0;
    }
  }
  }

}





