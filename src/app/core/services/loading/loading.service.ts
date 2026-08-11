import { computed, Injectable, signal } from '@angular/core';

/**
 * Estado global de "cargando", expuesto como Signal readonly.
 * El LoadingInterceptor incrementa/decrementa un contador de requests
 * en vuelo; loading() es true mientras ese contador sea mayor a cero,
 * de forma que múltiples requests simultáneos no "parpadeen" el loader
 * cuando termina solo uno de ellos.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly requestsInFlight = signal(0);

  readonly loading = computed(() => this.requestsInFlight() > 0);

  start(): void {
    this.requestsInFlight.update((count) => count + 1);
  }

  stop(): void {
    this.requestsInFlight.update((count) => Math.max(0, count - 1));
  }
}
