import { Component, OnInit } from '@angular/core';
import { ShowService } from '../service/show.service';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { baseUrl } from '../baseurl';
import { Episode } from '../models/episode';
import { Show } from '../models/show';

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
    this.loadShows();

    this.showDetailsModal = new bootstrap.Modal(document.getElementById('showDetailsModal')!);
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  openShowDetailsModal(show: any): void {
    this.selectedShow = show;
    if (this.showDetailsModal) {
      this.showDetailsModal.show();
    }
  }

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
    this.showService.getAllShows().subscribe(shows => {
      this.shows = shows;

      console.log(this.shows);
    });
  }

  viewNextEpisode(show: any): void {
    this.showService.getNextEpisode(show.id).subscribe(episode => {
      alert(`Next Episode to watch: Season ${episode.season}, Episode ${episode.episodeNumber} - ${episode.title}`);
    });
  }

  removeShow(deleteShow: Show): void {
    let showIdToDelete = deleteShow.id;

    console.log(showIdToDelete);

    this.showService.deleteShowById(showIdToDelete).subscribe(
      () => {
        console.log(`Show with ID ${showIdToDelete} deleted successfully.`);
        // Handle any UI updates or navigation after successful deletion
      },
      (error) => {
        console.error('Error deleting show:', error);
        // Handle error scenarios, e.g., show a user-friendly message
      }
    );
  }


  /*removeShow(id: any): void {
    console.log(`show id below`);
    console.log(id);
    this.showService.deleteShow(id).subscribe(() => {
      this.loadShows();
    });
  }*/

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


  /*saveShow(): void {
    if (this.showForm.valid) {
      this.showService.addShow(this.showForm.value).subscribe(() => {
        this.loadShows();
        const addShowModal = new bootstrap.Modal(document.getElementById('addShowModal')!);
        addShowModal.hide();
      });
    }
  }*/

  markEpisodeAsWatched(episode: Episode): void {
    if (!episode.isWatched) { // Check if episode is not already watched

      let userName = sessionStorage.getItem('Username');
      let showId = this.selectedShow?.id;
      let episodeId = episode.id;

      const model = { showId, episodeId, userName };
      this.showService.markEpisodeAsWatched(model)
        .subscribe(() => {
          console.log('Episode marked as watched successfully');
          //success
          episode.isWatched = true; // Update local episode status
        }, error => {
          console.error('Error marking episode as watched:', error);
        });

    }
  }

  saveShow(form: NgForm): void {
    if (form.valid) {
      const formData = new FormData();
      formData.append('title', this.newShow.title);
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }

      this.newShow.episodes.forEach((episode: any, index: number) => {
        formData.append(`episodes[${index}].title`, episode.title);
        formData.append(`episodes[${index}].season`, episode.season.toString());
        formData.append(`episodes[${index}].episodeNumber`, episode.episodeNumber.toString());
      });

      this.showService.addShow(formData).subscribe(() => {
        window.location.reload();
      });
    }
  }

  getImageUrl(imagePath: string): string {
    return `${this.imageUrl}/uploads/${imagePath}`;
  }

}
