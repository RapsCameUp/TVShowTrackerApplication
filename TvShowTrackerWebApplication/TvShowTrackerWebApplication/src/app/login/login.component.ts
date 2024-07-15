import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  error: string | null = null;

  credentials = {
    username: '',
    password: ''
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      Swal.fire('Warning', 'Missing Fields. Please ensure you enter username and password', 'warning');
      return;
    }

    Swal.fire({
      title: 'Logging In',
      text: 'Please Wait...',
      imageUrl: './assets/Dual Ball-1s-200px.gif',
      imageAlt: 'Loading image',
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: false,
      showDenyButton: false,
      allowOutsideClick: false
    });

    this.authService.login(this.loginForm.value).subscribe(result => {
      this.router.navigate(['/shows']);

    }, (error) => {
      console.log(error);
      Swal.fire('Error', 'Invalid password or username. Please Try Again.', 'error');
    });
  }

}
