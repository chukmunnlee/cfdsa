import { Component, inject, ListenerOptions, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BggService} from '../bgg.service';
import {GameList} from '../models';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {

  private activtedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  private bggSvc = inject(BggService)

  protected q = ''
  protected results$!: Promise<GameList[]>

  ngOnInit(): void {
    this.q = this.activtedRoute.snapshot.queryParams['q']
    if (!this.q) {
      this.router.navigate(['/'])
      return
    }

    this.results$ = this.bggSvc.findGamesByName(this.q)
  }

}
