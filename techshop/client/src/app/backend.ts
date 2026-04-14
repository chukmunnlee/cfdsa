import {HttpClient} from "@angular/common/http";
import {Injectable, inject} from "@angular/core";
import {lastValueFrom} from "rxjs";
import {Product} from "./models";

@Injectable()
export class BackendService {

  private http = inject(HttpClient)

  getCategories(): Promise<string[]> {
    return lastValueFrom(this.http.get<string[]>("/api/products"))
  }

  getProducts(category: string): Promise<Product[]> {
    const params = {
      skip: 0, limit: 4
    }
    return lastValueFrom(
      this.http.get<Product[]>(`/api/product/${category}`, { params })
    )
  }
}
