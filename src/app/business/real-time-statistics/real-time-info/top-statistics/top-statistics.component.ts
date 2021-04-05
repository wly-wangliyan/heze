import { Component, OnInit, OnDestroy } from '@angular/core';
import { RealTimeInfoHttpService, DynamicsEntity } from '../real-time-info-http.service';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';

@Component({
  selector: 'app-top-statistics',
  templateUrl: './top-statistics.component.html',
  styleUrls: ['./top-statistics.component.less']
})
export class TopStatisticsComponent implements OnInit, OnDestroy {

  public dynamicsRecord: DynamicsEntity = new DynamicsEntity();

  private dataSubscription: Subscription;

  constructor(private realTimeInfoHttpService: RealTimeInfoHttpService,
    private globalService: GlobalService) { }

  ngOnInit() {
    this.generateDynamicsInfo();
  }

  private generateDynamicsInfo() {
    this.dataSubscription = this.realTimeInfoHttpService.requestDynamicsData().subscribe(data => {
      this.dynamicsRecord = data;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  public ngOnDestroy() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }
}
