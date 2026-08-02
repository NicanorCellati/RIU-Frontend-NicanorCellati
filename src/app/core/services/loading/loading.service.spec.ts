import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('debería crearse con loading() en false', () => {
    expect(service).toBeTruthy();
    expect(service.loading()).toBeFalse();
  });

  it('start() debería poner loading() en true', () => {
    service.start();
    expect(service.loading()).toBeTrue();
  });

  it('stop() debería poner loading() en false cuando no quedan requests en vuelo', () => {
    service.start();
    service.stop();
    expect(service.loading()).toBeFalse();
  });

  it('con dos requests simultáneos, loading() sigue en true hasta que ambos terminan', () => {
    service.start();
    service.start();
    service.stop();
    expect(service.loading()).toBeTrue();

    service.stop();
    expect(service.loading()).toBeFalse();
  });
});
