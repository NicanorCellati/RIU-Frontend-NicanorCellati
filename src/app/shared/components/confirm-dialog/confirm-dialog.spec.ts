import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ConfirmDialogComponent] });
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse con los textos por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.title).toBe('Confirmar acción');
    expect(component.message).toBe('¿Estás seguro?');
  });

  it('onConfirm() debería emitir el evento confirmed', () => {
    const spy = jasmine.createSpy('confirmed');
    component.confirmed.subscribe(spy);

    component.onConfirm();

    expect(spy).toHaveBeenCalled();
  });
});
