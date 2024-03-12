import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'default',
  template: `
    <div>
    </div>`
})
export class Default {
  constructor(private router: Router) { }

  ngOnInit() {
    if (location.hash) {
      this.router.navigateByUrl(location.hash.substr(1))
    }
  }
}