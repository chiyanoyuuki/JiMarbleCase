import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: any = null;

  setUserData(data: any) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }

  isAuthenticated(): boolean {
    return !!this.userData;
  }

  clear() {
    this.userData = null;
  }
}