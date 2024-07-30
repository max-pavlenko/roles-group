import {SearchablePagination, UniqueEntity} from '@/shared/models/common.model';
import {SelectedEvent} from '@/features/home/models/event.model';
import {Signal} from '@angular/core';
import {PaginatedResult} from '@/shared/operators/filter-and-paginate';

export abstract class HomeTabToken<S extends UniqueEntity, I extends UniqueEntity> {
  abstract parentTitle: string;
  abstract subItemsKey: keyof S;

  abstract parentItems: Signal<S[] | undefined>;
  abstract data: Signal<PaginatedResult<I> | undefined>;
  abstract pagination: Signal<Omit<SearchablePagination, 'searchQuery'> | undefined>;

  abstract onParentItemAdded: () => void;
  abstract onItemEdited: (s: S) => void;
  abstract onItemToggled: (e: SelectedEvent<I, S>) => void;
  abstract onFiltersChanged: (e: SearchablePagination) => void;
}
