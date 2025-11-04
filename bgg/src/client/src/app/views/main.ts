import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit {

  private fb = inject(FormBuilder)
  private router = inject(Router)

  protected form!: FormGroup

  ngOnInit(): void {
    this.form = this.fb.group({
      q: this.fb.control('', [ Validators.required ])
    })
  }

  performSearch() {
    const queryParams = this.form.value
    this.router.navigate([ '/search' ], { queryParams })
  }

}
