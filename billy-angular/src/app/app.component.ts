import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `<app-user [name]="'Simran'"></app-user>`
})
export class UserComponent {
  @Input() name: string = '';  // Definindo a propriedade 'name' com valor inicial como string vazia
}
