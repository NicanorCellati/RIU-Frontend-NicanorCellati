import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * Paginador simple y reutilizable. No conoce el modelo de negocio:
 * solo recibe el total de elementos y el tamaño de página, y emite
 * el número de página seleccionada por evento — el mismo patrón de
 * comunicación orientada a eventos que usamos en ConfirmDialogComponent.
 *
 * Usa Signal Inputs/Outputs (Angular 17+) en vez de @Input/@Output
 * clásicos, para que `totalPages` como `computed()` sea genuinamente
 * reactivo ante cambios de los inputs sin depender de change detection
 * por referencia.
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  readonly totalItems = input.required<number>();
  readonly pageSize = input(5);
  readonly currentPage = input(1);

  readonly pageChange = output<number>();

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / (this.pageSize() || 1))),
  );

  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.pageChange.emit(page);
  }
}