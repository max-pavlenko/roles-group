import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {OffsetSize, SearchablePagination} from '@/shared/models/common.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: PaginationComponent, multi: true}]
})
export class PaginationComponent implements ControlValueAccessor {
  @Input({required: true}) total = 0;
  @Input({required: true}) pagination: Omit<SearchablePagination, 'searchQuery'> = {offset: OffsetSize.All, page: 1};
  isDisabled = false;
  onChange = (page: number) => {};
  onTouched = () => {};

  get totalPages() {
    return [...new Array(Math.ceil(this.total / this.pagination.offset))].map((_, i) => i + 1);
  }

  writeValue(page: number): void {
    this.pagination.page = page;
  }

  registerOnChange(fn: typeof this.onChange): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: typeof this.onTouched): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onPageClick(page: number) {
    this.onChange(page);
    this.onTouched();
  }
}
