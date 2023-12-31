import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(private router: Router, public menuService: MenuService) { }

  selectMenu(menu: number) {
    switch (menu) {
      case 1:
        this.router.navigate(['/home']);
        break;
      case 2:
        this.router.navigate(['/franquia']);
        break;
      case 3:
        this.router.navigate(['/funcionario']);
        break;
      case 4:
        this.router.navigate(['/cliente']);
        break;
      case 5:
        this.router.navigate(['/veiculo']);
        break;
      case 6:
        this.router.navigate(['/infracao']);
        break;
      case 7:
        this.router.navigate(['/multa']);
        break;
      case 8:
        this.router.navigate(['/orgaoAutuador']);
        break;
      case 9:
        this.router.navigate(['/argumento']);
        break;
      case 10:
        this.router.navigate(['/defesa']);
        break;
      case 100:
        localStorage.clear();
        this.router.navigate(['/login']);
        break;
    }
    this.menuService.menuSelecionado = menu;
  }
}
