import { Component, inject, OnInit, signal } from '@angular/core';
import {BackendService} from './backend';
import {Product} from './models';

const DISCOUNT = 0.20

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected title = 'client'
  protected category = ''
  protected categories = signal<string[]>([])
  protected products = signal<Product[]>([])
  private backendSvc = inject(BackendService)

  async ngOnInit() {
    const categories = await this.backendSvc.getCategories()
    this.categories.set(categories)
    this.category = this.randomCategory(categories)
    this.getProduct(this.category)
  }

  getProduct(category: string) {
    this.backendSvc.getProducts(category)
      .then(result => {
        this.category = category
        this.products.set(result)
      })
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

  protected salePrice(original: number) {
    return (original * (1 - DISCOUNT)).toFixed(2)
  }

  protected saving(original: number) {
    return (original * DISCOUNT).toFixed(2)
  }

  protected isLowStock(stock: number) {
      return (stock > 0) && (stock <= 10)
  }
}
