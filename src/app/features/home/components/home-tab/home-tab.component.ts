import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {HomeHeaderComponent} from '@/features/home/components/home-header/home-header.component';
import {SidebarTabsComponent} from '@/shared/components/sidebar-tabs/sidebar-tabs.component';
import {ListItemComponent} from '@/shared/components/list-item/list-item.component';
import {isUniqueArray, OffsetSize, UniqueEntity} from '@/shared/models/common.model';
import {NonNullableFormBuilder, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {PaginationComponent} from '@/shared/components/pagination/pagination.component';
import {HomeTabToken} from '@/features/home/components/home-tab/home-tab.token';
import {LocalStorageService} from '@/shared/services/local-storage.service';
import {LocalStorageKey} from '@/shared/models/local-storage.model';

@Component({
  selector: 'app-home-tab',
  standalone: true,
  imports: [
    HomeHeaderComponent,
    SidebarTabsComponent,
    ListItemComponent,
    ReactiveFormsModule,
    PaginationComponent
  ],
  templateUrl: './home-tab.component.html',
  styleUrl: './home-tab.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeTabComponent<P extends UniqueEntity, I extends UniqueEntity> implements OnInit {
  homeTabContent = inject(HomeTabToken<P, I>, {self: true});
  nnfb = inject(NonNullableFormBuilder);
  dr = inject(DestroyRef);
  localStorageService = inject(LocalStorageService);

  readonly OffsetSize = OffsetSize;
  selectedParentItem: null | P = null;

  filtersForm = this.nnfb.group({
    searchQuery: [''],
    offset: [OffsetSize.All],
    page: [1],
  });

  get items() {
    return this.homeTabContent.data()!.items;
  }

  get parentItems() {
    return this.homeTabContent.parentItems()!;
  }

  ngOnInit() {
    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.dr)).subscribe(() => {
      const values = this.filtersForm.getRawValue();
      this.homeTabContent.onFiltersChanged({...values, offset: +values.offset});
    });

    if (this.parentItems.length > 0 && this.localStorageService.getItem<boolean>(LocalStorageKey.IsSelectOnHomeTabChange))
      this.selectedParentItem = this.parentItems.at(-1)!;
  }

  onTabSelected(item: P) {
    this.selectedParentItem = item;
    this.filtersForm.reset();
  }

  isItemSelected(item: I) {
    if (!this.selectedParentItem) return false;
    const subItems = this.selectedParentItem[this.homeTabContent.subItemsKey];
    if (!isUniqueArray(subItems)) {
      throw new Error('Invalid subItemsKey: the property must be Unique[]');
    }
    return subItems.some(({id}) => id === item.id);
  }

  onItemToggled(item: I, checked: boolean) {
    this.homeTabContent.onItemToggled({item, checked, parent: this.selectedParentItem!});
  }

  onItemEdited(item: P) {
    this.homeTabContent.onItemEdited(item);
    if (this.selectedParentItem?.id === item.id) this.selectedParentItem.name = item.name;
  }
}
