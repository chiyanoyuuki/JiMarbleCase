import { Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { OverlayComponent } from './overlay/overlay.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'overlay', component: OverlayComponent }
];