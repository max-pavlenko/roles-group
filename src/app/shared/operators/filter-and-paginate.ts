import {combineLatest, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {Named, SearchablePagination} from '@/shared/models/common.model';

export function filterAndPaginate<T extends Named>(filters$: Observable<SearchablePagination>) {
  return (source$: Observable<T[]>): Observable<PaginatedResult<T>> =>
    combineLatest([source$, filters$]).pipe(
      map(([items, filters]) => {
        const initialItemsPosition = (filters.page - 1) * filters.offset;
        const filteredItems = items.filter(item => item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()));
        return {
          items: filteredItems.slice(initialItemsPosition, initialItemsPosition + filters.offset),
          total: filteredItems.length
        };
      })
    );
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}
