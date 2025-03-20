import { Component } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  protected firstName: string = '';
  protected lastName: string = '';
  protected email: string = '';
  protected password: string = '';
  protected role: string = 'USER'; // default role; you can adjust as needed
  protected errorMessage: string = '';
  protected successMessage: string = '';

  constructor(private authService: AuthenticationService,
              private router: Router) {}

  onSubmit() {
    // Here you could add validations (e.g., checking if fields are empty)

    this.authService.register(this.firstName, this.lastName, this.email, this.password, this.role)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.successMessage = 'Account created successfully!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = error.error?.message || 'Registration failed, please try again.';
        }
      });
  }
}
