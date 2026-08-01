import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Interceptor que muestra un indicador de carga global
 * mientras hay alguna operación HTTP en curso (alta, edición, borrado, búsqueda).
 * Se registra en app.config.ts con provideHttpClient(withInterceptors([loadingInterceptor])).
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.start();

  return next(req).pipe(finalize(() => loadingService.stop()));
};