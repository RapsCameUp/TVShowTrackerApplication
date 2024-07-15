import { Component, OnInit } from '@angular/core';
import { ImdbShowServiceService } from '../service/imdb-show-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-search',
  templateUrl: './show-search.component.html',
  styleUrls: ['./show-search.component.css']
})
export class ShowSearchComponent implements OnInit {

  searchResults: any[] = [];
  searchTerm: string = '';

  constructor(private showService: ImdbShowServiceService) { }

  ngOnInit(): void { }

  searchShows(): void {

    //show loader
    Swal.fire({
      title: 'Processing',
      text: 'Please Wait...',
      imageUrl: './assets/Dual Ball-1s-200px.gif',
      imageAlt: 'Loading image',
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: false,
      showDenyButton: false,
      allowOutsideClick: false
    });

    this.showService.searchShows(this.searchTerm).subscribe(results => {
      this.searchResults = results;

      Swal.close();
    });
  }

}
