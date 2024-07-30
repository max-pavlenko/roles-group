import {Named, Unique} from '@/shared/models/common.model';

export interface Group extends Named, Unique {
  roles: Unique[];
}
