import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

/**
 * Barra de carga global. Se suscribe al Signal expuesto por LoadingService,
 * que a su vez es alimentado por loadingInterceptor en cada request HTTP.
 */
@Component({
  selector: 'app-loading-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (loadingService.loading()) {
    <div
      class="fixed top-0 left-0 z-[2000] h-[3px] w-full animate-loading-sweep bg-[linear-gradient(90deg,#6366f1,#22d3ee,#6366f1)] bg-[length:200%_100%]"
      role="status"
      aria-label="Cargando"
    ></div>
  }`,
})
export class LoadingBarComponent {
  protected readonly loadingService = inject(LoadingService);
}