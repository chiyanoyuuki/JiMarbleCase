import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, isDevMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { SkinService } from './services/skin.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  skins: any[] = [];
  constructor() {}
  ngOnInit() {}
}