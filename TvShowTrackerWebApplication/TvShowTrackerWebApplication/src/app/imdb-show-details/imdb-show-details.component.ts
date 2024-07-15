import { Component, OnInit } from '@angular/core';
import { ImdbShowServiceService } from '../service/imdb-show-service.service';

@Component({
  selector: 'app-imdb-show-details',
  templateUrl: './imdb-show-details.component.html',
  styleUrls: ['./imdb-show-details.component.css']
})
export class ImdbShowDetailsComponent implements OnInit {

  show: any;

  constructor(private showService: ImdbShowServiceService) { }

  ngOnInit(): void {
    this.getShowDetails('American');
  }

  getShowDetails(title: string): void {
    this.showService.getShowDetails(title).subscribe(data => {
      this.show = data;
    });
  }

}
