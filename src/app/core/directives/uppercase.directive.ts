import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Fuerza a mayúsculas el valor visible e interno de un input de texto,
 * conservando la posición del cursor para no romper la experiencia de
 * escritura. Se usa en el campo "nombre" del formulario de héroes:
 *
 *   <input formControlName="name" appUppercase />
 *
 * Trabaja a través de NgControl para que el valor en mayúsculas quede
 * reflejado también en el propio FormControl (no solo visualmente),
 * de forma que las validaciones y el valor final enviado ya sean consistentes.
 */
@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  private readonly control = inject(NgControl, { self: true });

  @HostListener('input', ['$event.target'])
  onInput(target: EventTarget | null): void {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const cursorPosition = target.selectionStart;
    const upperValue = target.value.toUpperCase();

    if (target.value !== upperValue) {
      target.value = upperValue;
      this.control.control?.setValue(upperValue, { emitEvent: false });

      // Restaura la posición del cursor luego de reescribir el valor.
      target.setSelectionRange(cursorPosition, cursorPosition);
    } else {
      this.control.control?.setValue(upperValue, { emitEvent: false });
    }
  }
}
