import { Component, inject, OnInit, signal } from '@angular/core';
import {BackendService} from './backend';
import {Product} from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected title = 'client'
  protected category = ''
  //protected products: Product[] = []
  protected products = signal<Product[]>([])
  private backendSvc = inject(BackendService)

  async ngOnInit() {
    const categories = await this.backendSvc.getCategories()
    this.category = this.randomCategory(categories)
    this.backendSvc.getProducts(this.category)
      .then(result => this.products.set(result))
    console.info('>>> products: ', this.products)
  }

  private randomCategory(categories: string[]): string {
    const idx = Math.floor(Math.random() * categories.length)
    return categories[idx]
  }

  protected stars(rating: number) {
    const full  = Math.round(rating)
    const empty = 5 - full
    return '★'.repeat(full) + '☆'.repeat(empty)
  }
}
