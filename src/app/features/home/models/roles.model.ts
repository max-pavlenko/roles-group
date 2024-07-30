import {Unique, UniqueEntity} from '@/shared/models/common.model';

export interface Role extends Permission {
  permissions: Unique[];
}

export interface Permission extends UniqueEntity {
}
