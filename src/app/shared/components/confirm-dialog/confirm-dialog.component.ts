import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Diálogo de confirmación genérico y reutilizable, comunicado con el
 * padre exclusivamente por eventos (@Output), sin conocer nada del
 * contexto de negocio que lo usa (podría reutilizarse para confirmar
 * cualquier acción destructiva, no solo el borrado de un héroe).
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  readonly title = input('Confirmar acción');
  readonly message = input('¿Estás seguro?');
  readonly confirmLabel = input('Confirmar');
  readonly cancelLabel = input('Cancelar');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
