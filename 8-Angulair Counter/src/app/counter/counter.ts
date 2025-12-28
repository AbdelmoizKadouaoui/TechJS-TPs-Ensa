import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.html',
})

export class CounterComponent {
  number = 0;

  increment(): void {
    this.number++;
  }

  decrement(): void {
    this.number--;
  }

  reset(): void {
    this.number = 0;
  }
}
