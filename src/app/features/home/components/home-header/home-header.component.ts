import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {TabsComponent} from '@/shared/components/tabs/tabs.component';
import {TabPane} from '@/shared/components/tabs/tabs.model';
import {LocalStorageService} from '@/shared/services/local-storage.service';
import {LocalStorageKey} from '@/shared/models/local-storage.model';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {startWith} from 'rxjs';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [
    TabsComponent,
    ReactiveFormsModule
  ],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeaderComponent<T extends string> {
  localStorageService = inject(LocalStorageService);

  @Input({required: true}) tabs: TabPane<T>[] = [];
  @Input() selectedTab?: TabPane<T>;
  @Output() selected = new EventEmitter<TabPane<T>>();
  isSelectOnTabChangeControl = new FormControl(this.localStorageService.getItem<boolean>(LocalStorageKey.IsSelectOnHomeTabChange) ?? true);

  constructor() {
    this.isSelectOnTabChangeControl.valueChanges
      .pipe(
        startWith(this.isSelectOnTabChangeControl.value),
        takeUntilDestroyed()
      ).subscribe(checked => {
      this.onSelectOnTabChange(!!checked);
    });
  }

  onSelectOnTabChange(checked: boolean) {
    this.localStorageService.setItem(LocalStorageKey.IsSelectOnHomeTabChange, checked);
  }
}
