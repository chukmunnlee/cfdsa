import { Component, OnInit, signal } from '@angular/core';

import { rnd } from './utils'

const COUNT = 4

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('angular');
  protected instanceName = 'dov-bear'

  protected dovs: number[] = []

  ngOnInit(): void {
    //const total = parseInt(req.query['num']) || 4
    this.dovs = rnd(14, COUNT)

  }
}
