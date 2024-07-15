import { Injectable } from '@angular/core';
import { baseUrl } from '../baseurl';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  serverUrl = baseUrl.baseUrl;

  constructor(private http: HttpClient) { }

  getAllShows(): Observable<any> {
    return this.http.get(`${this.serverUrl}/shows`);
  }

  getShowById(id: string): Observable<any> {
    return this.http.get(`${this.serverUrl}/shows/${id}`);
  }

  addShow(formData: FormData): Observable<any> {
    return this.http.post(`${this.serverUrl}/shows`, formData);
  }

  /*addShow(show: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/shows`, show);
  }*/

  updateShow(id: string, show: any): Observable<any> {
    return this.http.put(`${this.serverUrl}/shows/${id}`, show);
  }

  deleteShow(id: any): Observable<any> {
    return this.http.delete(`${this.serverUrl}/shows/${id}`);
  }

  /*deleteShowById(id: any): Observable<any> {
    console.log(id);
    return this.http.delete(`${this.serverUrl}/shows/delete/${id}`);
  }*/

  deleteShowById(id: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/shows/delete/${id}`, {});
  }


  markEpisodeAsWatched(model: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/shows/markEpisodeAsWatched`, model);
  }

  getNextEpisodeToWatch(userId: string, showId: string): Observable<any> {
    return this.http.get(`${this.serverUrl}/shows/${userId}/next?showId=${showId}`);
  }

  getNextEpisode(showId: string): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/shows/${showId}/next`);
  }

}
