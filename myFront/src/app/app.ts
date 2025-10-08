import { Component, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ ajouter
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule], // ✅ ajouter CommonModule
  templateUrl: './app.html', 
  styles: []
})
export class App {
  protected readonly title = signal('myFront');
  auth = inject(AuthService);
}
