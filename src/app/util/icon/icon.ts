import { NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [NgStyle],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  iconName = input.required<string>();
  iconSize = input<string>('2.4rem');
  iconColor = input<string>('currentColor');
}
