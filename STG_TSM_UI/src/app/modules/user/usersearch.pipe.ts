import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'app/core/user/user.types';

@Pipe({
  name: 'usersearch'
})
export class UsersearchPipe implements PipeTransform {

  transform(user: User[], searchText: string): User[] {

    if(!user || !searchText){
      return user;
    }
    return user.filter(user => user.employeeName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }

}
