import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TabPane} from './tabs.model';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent<T extends string> {
  @Input({required: true}) items: TabPane<T>[] = [];
  @Input() set initialSelected(item: TabPane<T> | undefined) {
    this.selectedItem = item ?? null;
  }
  @Output() selected = new EventEmitter<TabPane<T>>();

  selectedItem: TabPane<T> | null = null;

  onTabPaneClick(tab: TabPane<T>) {
    this.selected.emit(tab)
    this.selectedItem = tab;
  }
}
