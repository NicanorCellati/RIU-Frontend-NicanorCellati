import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoadingService } from '../../../core/services/loading/loading.service';
import { LoadingBarComponent } from './loading-bar';

describe('LoadingBarComponent', () => {
  let fixture: ComponentFixture<LoadingBarComponent>;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LoadingBarComponent] });
    fixture = TestBed.createComponent(LoadingBarComponent);
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('no debería mostrar la barra si loading() es false', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="status"]'))).toBeNull();
  });

  it('debería mostrar la barra si loading() es true', () => {
    loadingService.start();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="status"]'))).not.toBeNull();
  });
});
