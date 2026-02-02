import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class TasksData {
  private http = inject(HttpClient); // as of Angular 21, you don't have to create a provider for the HttpClient

  getTasks() {
    return this.http.get('/api/tasks'); // fake for now, more later.
  }
}
