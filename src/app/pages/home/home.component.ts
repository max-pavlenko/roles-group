import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {TabPane} from '@/shared/components/tabs/tabs.model';
import {HomeTab} from '@/pages/home/home.model';
import {SidebarTabsComponent} from '@/shared/components/sidebar-tabs/sidebar-tabs.component';
import {HomeHeaderComponent} from '@/features/home/components/home-header/home-header.component';
import {AsyncPipe, NgComponentOutlet, NgSwitch, NgSwitchCase} from '@angular/common';
import {Permission} from '@/features/home/models/roles.model';
import {HomeTabComponent} from '@/features/home/components/home-tab/home-tab.component';
import {PermissionsService} from '@/features/home/services/permissions.service';
import {LocalStorageService} from '@/shared/services/local-storage.service';
import {LocalStorageKey} from '@/shared/models/local-storage.model';
import {uniquify} from '@/shared/utils/array';
import {GroupsTabContentDirective} from '@/features/home/directives/groups-tab-content.directive';
import {RolesTabContentDirective} from '@/features/home/directives/roles-tab-content.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeHeaderComponent,
    SidebarTabsComponent,
    NgComponentOutlet,
    NgSwitch,
    NgSwitchCase,
    HomeTabComponent,
    AsyncPipe,
    GroupsTabContentDirective,
    RolesTabContentDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent implements OnInit {
  permissionsService = inject(PermissionsService);
  localStorageService = inject(LocalStorageService);

  readonly HomeTab = HomeTab;
  readonly tabs: TabPane<HomeTab>[] = uniquify([
    {name: HomeTab.Groups},
    {name: HomeTab.Roles},
  ])

  selectedTab?: typeof this.tabs[number] = this.tabs.at(-1);

  ngOnInit() {
    const permissions = this.localStorageService.getItem<Permission[]>(LocalStorageKey.Permissions);
    if (!permissions) {
      this.localStorageService.setItem(LocalStorageKey.Permissions, this.permissionsService.permissions$.value);
    }
  }

  onTabSelected(tab: TabPane<HomeTab>) {
    this.selectedTab = tab;
  }
}
