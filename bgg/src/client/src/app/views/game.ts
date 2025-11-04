import { Component, inject, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BggService} from '../bgg.service';
import {GameDetails} from '../models';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements OnInit {

  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  protected bggSvc = inject(BggService)
  protected gid = -1
  protected q = ''

  protected game$!: Promise<GameDetails>

  ngOnInit(): void {

    this.gid = parseInt(this.activatedRoute.snapshot.params['gid']) || -1
    console.info('>>>> gid = ', this.gid)
    console.info('>>>> gid = ', this.activatedRoute.snapshot.params)
    if (this.gid <= 0) {
      this.router.navigate(['/'])
      return
    }
    this.q = this.activatedRoute.snapshot.queryParams['q']

    this.game$ = this.bggSvc.findGameByGid(this.gid)
  }

  back() {
      this.router.navigate(['/search'], { queryParams: { q: this.q } })
  }

}
