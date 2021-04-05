import { Component } from '@angular/core';
import { initializer } from '../initializer';
import { AuthService } from '../core/auth.service';
import { HttpService } from '../core/http.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.less']
})
export class EntryComponent {

  constructor(private authService: AuthService, private httpService: HttpService) {
    authService.authorizeBySecretKey(initializer.user);
    httpService.setStartTimeStamp(initializer.startTimeStamp);
  }
}
