

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import 'reflect-metadata';

import { AppComponent } from './src/app.component';
import './src/styles.css';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
  ],
});

// AI Studio always uses an `index.tsx` file for all project types.