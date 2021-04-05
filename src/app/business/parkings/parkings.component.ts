import {Component} from '@angular/core';
import {ParkingsHttpService} from './parkings-http.service';
import {DataCacheService} from '../../core/data-cache.service';

@Component({
  selector: 'app-parkings',
  templateUrl: './parkings.component.html',
  styleUrls: ['./parkings.component.css'],
  providers: [ParkingsHttpService, DataCacheService]
})
export class ParkingsComponent {
}
