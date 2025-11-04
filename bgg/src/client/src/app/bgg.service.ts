import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";

import { GameDetails, GameList } from './models'
import {lastValueFrom} from "rxjs";

@Injectable()
export class BggService {

  private http = inject(HttpClient)

  findGamesByName(q: string): Promise<GameList[]> {
    return lastValueFrom(
      this.http.get<GameList[]>('/api/search', { params: { q }})
    )
  }

  findGameByGid(gid: number): Promise<GameDetails> {
    return lastValueFrom(
      this.http.get<GameDetails>(`/api/game/${gid}`)
    )
  }
}
