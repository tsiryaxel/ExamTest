import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginResponse {
    token: string;
    email?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private router = inject(Router);

    token = signal<string | null>(localStorage.getItem('auth_token'));
    userEmail = signal<string | null>(localStorage.getItem('user_email'));

    get isLoggedIn() {
        return !!this.token();
    }

    async login(email: string, password: string) {
        const res = await fetch(`${environment.apiBase}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || 'Login failed');
        }

        const data: LoginResponse = await res.json();
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_email', email);

        this.token.set(data.token);
        this.userEmail.set(email);

        this.router.navigateByUrl('/exams');
    }

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        this.token.set(null);
        this.userEmail.set(null);
        this.router.navigateByUrl('/login');
    }

    getAuthHeader() {
        return this.token() ? { Authorization: `Bearer ${this.token()}` } : {};
    }
}
