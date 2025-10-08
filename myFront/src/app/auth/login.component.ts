import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  auth = inject(AuthService);

  async login() {
    try {
      await this.auth.login(this.email, this.password);
    } catch (e: any) {
      alert('Login failed: ' + e.message);
    }
  }
  
}
