import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AuthService {
  keycloak: any;
  constructor(private http: HttpClient) {}
  
   getPublic() {
    return this.http.get('/api/public');
  }

  getProtected() {
    return this.http.get('/api/protected');
  }
}
