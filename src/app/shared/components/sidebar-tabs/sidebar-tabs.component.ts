import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Named, Unique} from '@/shared/models/common.model';

@Component({
  selector: 'app-sidebar-tabs',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './sidebar-tabs.component.html',
  styleUrl: './sidebar-tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarTabsComponent<T extends Named & Unique> {
  @Input({required: true}) items: T[] = [];
  @Input({required: true}) domain: PropertyKey = '';
  @Input() selectedTab: T | null = null;
  @Output() tabSelected = new EventEmitter<T>();
  @Output() newAdded = new EventEmitter();
  @Output() itemEdited = new EventEmitter<T>();
  editedTab: T | null = null;
  tabNameControl = new FormControl('');

  constructor() {}

  addNewGroup() {
    this.newAdded.emit();
  }

  onItemClick(item: T) {
    this.selectedTab = item;
    this.tabSelected.emit(item);
  }

  onEditItem(event: Event, item: T, input: HTMLInputElement) {
    event.stopPropagation();
    this.editedTab = item;
    setTimeout(() => input.focus(), 1);
    this.tabNameControl.setValue(item.name);
  }

  onEditBlur() {
    if (this.tabNameControl.value !== this.editedTab?.name) {
      this.onItemEdited();
      return;
    }
    this.resetEditItem();
  }

  resetEditItem() {
    this.editedTab = null;
    this.tabNameControl.reset();
  }

  onItemEdited() {
    this.itemEdited.emit({
      ...this.editedTab!,
      name: this.tabNameControl.value
    });
    this.resetEditItem();
  }
}
