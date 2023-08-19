import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModuleModule } from '../shared-material-module/shared-material-module.module';

@Component({
  selector: 'app-globaltopbar',
  standalone: true,
  imports: [CommonModule, SharedMaterialModuleModule],
  templateUrl: './globaltopbar.component.html',
  styleUrls: ['./globaltopbar.component.scss']
})
export class GlobaltopbarComponent {

}
