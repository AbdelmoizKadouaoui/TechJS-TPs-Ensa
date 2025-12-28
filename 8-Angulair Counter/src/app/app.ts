import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterComponent } from './counter/counter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CounterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  ngOnInit(){
    console.log("Test")
  }
  protected readonly title = signal('init_angulair');
}
