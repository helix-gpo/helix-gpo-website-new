import { Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-hint',
  imports: [Icon],
  templateUrl: './hint.html',
  styleUrl: './hint.scss',
})
export class Hint {
  iconName = input.required<string>();
  iconColor = input<string>('#03dbff');
  iconSize = input<string>('1.6rem');
  text = input.required<string>();
}
