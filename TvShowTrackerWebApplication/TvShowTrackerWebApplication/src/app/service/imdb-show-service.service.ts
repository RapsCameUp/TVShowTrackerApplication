import { Injectable } from '@angular/core';
import { baseUrl } from '../baseurl';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImdbShowServiceService {

  serverUrl = baseUrl.baseUrl;

  constructor(private http: HttpClient) { }

  getShowDetails(title: string): Observable<any> {
    return this.http.get(`${this.serverUrl}/IMDB/${title}`);
  }

  getEpisodes(title: string, season: number): Observable<any> {
    return this.http.get(`${this.serverUrl}/IMDB/${title}/episodes/${season}`);
  }

  searchShows(searchTerm: string): Observable<any> {
    return this.http.get(`${this.serverUrl}/IMDB/search/${searchTerm}`);
  }
}
