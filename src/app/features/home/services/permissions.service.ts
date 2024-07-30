import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {OffsetSize, SearchablePagination, Unique, UniqueEntity} from '@/shared/models/common.model';
import {Permission, Role} from '@/features/home/models/roles.model';
import {Group} from '@/features/home/models/groups.model';
import {LocalStorageKey} from '@/shared/models/local-storage.model';
import {LocalStorageService} from '@/shared/services/local-storage.service';
import {replaceUniqueArrayItem, uniquify} from '@/shared/utils/array';
import {filterAndPaginate, PaginatedResult} from '@/shared/operators/filter-and-paginate';
import {SelectedEvent} from '@/features/home/models/event.model';

const DEFAULT_PERMISSIONS: Permission[] = uniquify([
  {name: 'Create - 1'}, {name: 'Edit - 2'}, {name: 'Delete - 3'}, {name: 'Visit - 4'}
]);

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  localStorageService = inject(LocalStorageService);

  permissions$ = new BehaviorSubject(this.localStorageService.getItem<Permission[]>(LocalStorageKey.Permissions) ?? DEFAULT_PERMISSIONS);
  roles$ = new BehaviorSubject<Role[]>(this.localStorageService.getItem<Role[]>(LocalStorageKey.Roles) ?? []);
  groups$ = new BehaviorSubject<Group[]>(this.localStorageService.getItem<Group[]>(LocalStorageKey.Groups) ?? []);

  filters$ = new BehaviorSubject<SearchablePagination>({searchQuery: '', offset: OffsetSize.All, page: 1});
  filteredRoles$: Observable<PaginatedResult<Role>> = this.roles$.pipe(filterAndPaginate(this.filters$));
  filteredPermissions$: Observable<PaginatedResult<Permission>> = this.permissions$.pipe(filterAndPaginate(this.filters$));

  addRole() {
    const newRoles = [
      ...this.roles$.value,
      {id: crypto.randomUUID(), name: `New Role ${this.roles$.value.length + 1}`, permissions: []}
    ];
    this.roles$.next(newRoles);
    this.localStorageService.setItem(LocalStorageKey.Roles, newRoles);
  }

  addGroup() {
    const newGroups = [
      ...this.groups$.value,
      {id: crypto.randomUUID(), name: `New Group ${this.groups$.value.length + 1}`, roles: []}
    ];
    this.groups$.next(newGroups);
    this.localStorageService.setItem(LocalStorageKey.Groups, newGroups);
  }

  putRole(role: Role) {
    const newRoles = replaceUniqueArrayItem(this.roles$.value, role);
    this.roles$.next(newRoles);
    this.localStorageService.setItem(LocalStorageKey.Roles, newRoles);
  }

  putGroup(group: Group) {
    const newGroups = replaceUniqueArrayItem(this.groups$.value, group);
    this.groups$.next(newGroups);
    this.localStorageService.setItem(LocalStorageKey.Groups, newGroups);
  }

  toggleEntity<P extends UniqueEntity, I extends Unique>({item, checked}: Omit<SelectedEvent<I, P>, 'parent'>, subItems: I[]) {
    const checkedActions: Record<`${boolean}`, () => unknown> = {
      true: () => subItems.push(item),
      false: () => subItems = subItems.filter(({id}) => id !== item.id)
    };
    checkedActions[`${checked}`]();
    return subItems;
  }

  togglePermission(event: SelectedEvent<Permission, Role>) {
    const subItems = this.toggleEntity(event, event.parent.permissions);
    if (!subItems) return;
    event.parent.permissions = subItems;
    this.putRole({...event.parent, permissions: subItems});
  }

  toggleRole(event: SelectedEvent<Role, Group>) {
    const subItems = this.toggleEntity(event, event.parent.roles);
    if (!subItems) return;
    event.parent.roles = subItems;
    this.putGroup({...event.parent, roles: subItems});
  }

  patchFilters(filters: SearchablePagination) {
    const {value: initialFilters} = this.filters$;
    const {page, ...otherFilters} = filters;

    Object.keys(otherFilters).forEach((key) => {
      const filterKey = key as keyof typeof filters;
      if (filters[filterKey] !== initialFilters[filterKey]) filters.page = 1;
    });

    this.filters$.next({...initialFilters, ...filters});
  }
}
