import { Component, OnInit } from '@angular/core';
import { ShowService } from '../service/show.service';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { baseUrl } from '../baseurl';
import { Episode } from '../models/episode';
import { Show } from '../models/show';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css']
})
export class ShowListComponent implements OnInit {

  shows: any[] = [];
  selectedFile: File | null = null;
  imageUrl = baseUrl.imageUrl;
  selectedShow: any = null;
  showDetailsModal: bootstrap.Modal | null = null;

  newShow: any = {
    title: '',
    imagePath: '',
    episodes: []
  };

  constructor(private fb: FormBuilder, private showService: ShowService) { }

  ngOnInit(): void {

    //get all the shows
    this.loadShows();

    //bootstrap modal
    this.showDetailsModal = new bootstrap.Modal(document.getElementById('showDetailsModal')!);
  }

  //file selected - image upload for show
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  //show details modal
  openShowDetailsModal(show: any): void {
    this.selectedShow = show;
    if (this.showDetailsModal) {
      this.showDetailsModal.show();
    }
  }

  //getting next episode
  getNextEpisodeNumber(show: any): string {
    const unwatchedEpisodes = show.episodes.filter((episode: any) => !episode.isWatched);
    if (unwatchedEpisodes.length > 0) {
      const nextEpisode = unwatchedEpisodes[0];
      return `Season ${nextEpisode.season}, Episode ${nextEpisode.episodeNumber}`;
    }
    return '';
  }

  isNextEpisode(index: number): boolean {
    if (!this.selectedShow) return false;
    const unwatchedEpisodes = this.selectedShow.episodes.filter((episode: any) => !episode.isWatched);
    if (unwatchedEpisodes.length > 0) {
      return this.selectedShow.episodes[index] === unwatchedEpisodes[0];
    }
    return false;
  }

  loadShows(): void {

    //page loader
    Swal.fire({
      title: 'Loading Shows',
      text: 'Please Wait...',
      imageUrl: './assets/Dual Ball-1s-200px.gif',
      imageAlt: 'Loading image',
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: false,
      showDenyButton: false,
    });

    // get all the shows
    this.showService.getAllShows().subscribe(shows => {
      this.shows = shows;

      Swal.close();
    });
  }

  viewNextEpisode(show: any): void {
    this.showService.getNextEpisode(show.id).subscribe(episode => {
      alert(`Next Episode to watch: Season ${episode.season}, Episode ${episode.episodeNumber} - ${episode.title}`);
    });
  }

  removeShow(deleteShow: Show): void {

    //user should confirm delete
    Swal.fire({
      title: 'Are you sure?',
      text: "The Show will be removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {

        let showIdToDelete = deleteShow._Id;

        this.showService.deleteShow(showIdToDelete).subscribe(
          () => {

            Swal.fire(
              'Deleted',
              'Show Deleted Successfully',
              'success'
            ).then(() => {
              window.location.reload(); //reload page
            });
          },
          (error) => {
            console.error('Error deleting show:', error);
            Swal.fire('Error', 'Something went wrong. Please Try Again.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Process Cancelled', 'error');
      }
    });
  }

  addEpisode(): void {
    this.newShow.episodes.push({
      title: '',
      season: 1,
      episodeNumber: 1
    });
  }

  removeEpisode(index: number): void {
    this.newShow.episodes.splice(index, 1);
  }

  openAddShowModal(): void {
    const addShowModal = new bootstrap.Modal(document.getElementById('addShowModal')!);
    addShowModal.show();
  }

  markEpisodeAsWatched(episode: Episode): void {
    if (!episode.isWatched) { // Check if episode is not already watched

      let userName = sessionStorage.getItem('Username');
      let showId = this.selectedShow?.id;
      let episodeId = episode.id;

      const model = { showId, episodeId, userName };
      this.showService.markEpisodeAsWatched(model)
        .subscribe(() => {
          console.log('Episode marked as watched successfully');
          Swal.fire('Success', 'Episode marked as watched successfully.', 'success');
          //success
          episode.isWatched = true; // Update local episode status
        }, error => {
          console.error('Error marking episode as watched:', error);
          Swal.fire('Error', 'Something went wrong. Please Try Again.', 'error');
        });

    }
  }

  saveShow(form: NgForm): void {
    if (form.valid) {
      const formData = new FormData();
      formData.append('title', this.newShow.title);

      if (!this.selectedFile) {
        Swal.fire('Warning', 'Please select Show cover image', 'warning');
        return;
      }

      if (this.newShow.episodes.length === 0) {
        Swal.fire('Warning', 'Please add at least one episode', 'warning');
        return;
      }

      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }

      // all the episodes and their properties (tile, season,..)
      this.newShow.episodes.forEach((episode: any, index: number) => {
        formData.append(`episodes[${index}].title`, episode.title);
        formData.append(`episodes[${index}].season`, episode.season.toString());
        formData.append(`episodes[${index}].episodeNumber`, episode.episodeNumber.toString());
      });

      this.showService.addShow(formData).subscribe(() => {
        Swal.fire(
          'Successfully Added',
          'Show Added Successfully',
          'success'
        ).then(() => {
          window.location.reload();
        });
      });
    }
    else {
      Swal.fire('Error', 'Form is not valid', 'error');
    }
  }

  getImageUrl(imagePath: string): string {
    return `${this.imageUrl}/uploads/${imagePath}`;
  }
}
