import { Component } from '@angular/core';
import { DataStatisticsHttpService } from './data-statistics-http.service';
import { GroupsHttpService } from '../groups/groups-http.service';

@Component({
  selector: 'app-data-statistics',
  templateUrl: './data-statistics.component.html',
  styleUrls: ['./data-statistics.component.css'],
  providers: [DataStatisticsHttpService, GroupsHttpService]
})
export class DataStatisticsComponent {
}
