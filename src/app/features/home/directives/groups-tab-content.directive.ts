import {Directive, inject} from '@angular/core';
import {HomeTabToken} from '@/features/home/components/home-tab/home-tab.token';
import {Group} from '@/features/home/models/groups.model';
import {Role} from '@/features/home/models/roles.model';
import {SearchablePagination} from '@/shared/models/common.model';
import {SelectedEvent} from '@/features/home/models/event.model';
import {PermissionsService} from '@/features/home/services/permissions.service';
import {HomeTab} from '@/pages/home/home.model';
import {toSignal} from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appGroupsTabContent]',
  standalone: true,
  providers: [{provide: HomeTabToken, useExisting: GroupsTabContentDirective}]
})
export class GroupsTabContentDirective implements HomeTabToken<Group, Role> {
  permissionsService = inject(PermissionsService);

  data = toSignal(this.permissionsService.filteredRoles$);
  pagination = toSignal(this.permissionsService.filters$);
  parentItems = toSignal(this.permissionsService.groups$);

  parentTitle = HomeTab.Groups;
  subItemsKey: keyof Group = HomeTab.Roles;

  onFiltersChanged(filters: SearchablePagination) {
    this.permissionsService.patchFilters(filters);
  };

  onItemEdited(newGroup: Group) {
    this.permissionsService.putGroup(newGroup);
  };

  onItemToggled(event: SelectedEvent<Role, Group>) {
    this.permissionsService.toggleRole(event);
  };

  onParentItemAdded() {
    this.permissionsService.addGroup();
  };
}
