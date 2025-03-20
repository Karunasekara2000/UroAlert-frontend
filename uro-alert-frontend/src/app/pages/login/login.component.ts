import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  protected email: string = '';
  protected password: string = '';
  protected errorMessage: string = '';

  constructor(private router: Router,
              private authService: AuthenticationService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in both fields';
      return;
    }

    this.authService.authenticate(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Authentication Success:', response);

        // Save tokens to localStorage or sessionStorage if needed
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // Navigate to dashboard or home
        alert('Login Successful!');
        this.router.navigate(['/dashboard']); // You can create a dashboard component later
      },
      error: (error) => {
        if (error.status === 403) {
          this.errorMessage = 'Invalid email or password!';
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
        }
      }
    });
  }
}
