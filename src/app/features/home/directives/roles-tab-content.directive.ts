import {Directive, inject} from '@angular/core';
import {HomeTabToken} from '@/features/home/components/home-tab/home-tab.token';
import {Permission, Role} from '@/features/home/models/roles.model';
import {SearchablePagination} from '@/shared/models/common.model';
import {SelectedEvent} from '../models/event.model';
import {HomeTab} from '@/pages/home/home.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {PermissionsService} from '@/features/home/services/permissions.service';

@Directive({
  selector: '[appRolesTabContent]',
  standalone: true,
  providers: [{provide: HomeTabToken, useExisting: RolesTabContentDirective}]
})
export class RolesTabContentDirective implements HomeTabToken<Role, Permission> {
  permissionsService = inject(PermissionsService);

  parentTitle = HomeTab.Roles;
  subItemsKey: keyof Role = 'permissions';
  parentItems = toSignal(this.permissionsService.roles$);
  data = toSignal(this.permissionsService.filteredPermissions$);
  pagination = toSignal(this.permissionsService.filters$);

  onItemEdited(newRole: Role) {
    this.permissionsService.putRole(newRole);
  }

  onItemToggled(event: SelectedEvent<Permission, Role>) {
    this.permissionsService.togglePermission(event);
  }

  onParentItemAdded() {
    this.permissionsService.addRole();
  }

  onFiltersChanged(filters: SearchablePagination) {
    this.permissionsService.patchFilters(filters);
  }
}
