import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user_name: any;
  user_full_name: any;
  constructor(private _router: Router, private _authService: AuthService) { }

  ngOnInit(): void {

    // get username
    this.user_name = sessionStorage.getItem('Username');
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
