import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  error: string | null = null;

  user = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire('Warning', 'Missing Fields. Please ensure there are no missing fields.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Processing Data',
      text: 'Please wait...',
      imageUrl: './assets/Dual Ball-1s-200px.gif',
      imageAlt: 'Loading image',
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: false,
      showDenyButton: false,
      allowOutsideClick: false
    });

    this.authService.register(this.registerForm.value).subscribe(
      () => this.router.navigate(['/login']),
      (err) => this.error = 'Registration failed'
    );


    this.authService.register(this.registerForm.value).subscribe(result => {
      Swal.fire(
        'Registration Successful',
        'You Can Now Login With Your Credentials',
        'success'
      ).then(() => {
        this.router.navigate(['/login'])
      });

    }, (error) => {
      Swal.fire('Error', 'Something went wrong. Please Try Again.', 'error');
      return;
    });
  }

}
