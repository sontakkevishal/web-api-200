import { HttpClient } from '@angular/common/http';
import { DOCUMENT, inject } from '@angular/core';
import { User } from './types';
import { UserProfile } from './auth-reducer';

export class AuthApi {
  #client = inject(HttpClient);

  #document = inject(DOCUMENT);

  getUser() {
    // fake classroom stuff.
    return this.#client.get<User>('/api/auth/user');
  }

  logOut() {
    this.#document.location.href = `/api/auth/logout?returnUrl=${encodeURIComponent('/')}`;
  }

  login() {
    return this.#client
      .get('/api/auth/login?returnUrl=/', { observe: 'response', responseType: 'text' })
      .subscribe((resp) => {
        if (resp.url != null) {
          window.location.href = resp.url;
        }
      });
  }
  getProfile() {
    return this.#client.get<UserProfile>('/api/user');
  }
}
