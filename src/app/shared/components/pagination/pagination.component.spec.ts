import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PaginationComponent] });
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalItems', 12);
    fixture.componentRef.setInput('pageSize', 5);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();
  });

  it('debería crearse y calcular totalPages en base a totalItems y pageSize', () => {
    expect(component).toBeTruthy();
    expect(component.totalPages()).toBe(3);
    expect(component.pages()).toEqual([1, 2, 3]);
  });

  it('goTo() debería emitir pageChange con una página válida', () => {
    const spy = jasmine.createSpy('pageChange');
    component.pageChange.subscribe(spy);

    component.goTo(2);

    expect(spy).toHaveBeenCalledWith(2);
  });

  it('goTo() no debería emitir si la página es menor a 1', () => {
    const spy = jasmine.createSpy('pageChange');
    component.pageChange.subscribe(spy);

    component.goTo(0);

    expect(spy).not.toHaveBeenCalled();
  });

  it('goTo() no debería emitir si la página supera el total de páginas', () => {
    const spy = jasmine.createSpy('pageChange');
    component.pageChange.subscribe(spy);

    component.goTo(4);

    expect(spy).not.toHaveBeenCalled();
  });

  it('goTo() no debería emitir si la página pedida ya es la actual', () => {
    const spy = jasmine.createSpy('pageChange');
    component.pageChange.subscribe(spy);

    component.goTo(1);

    expect(spy).not.toHaveBeenCalled();
  });

  it('totalPages() debería usar 1 como tamaño de página si pageSize llega en 0', () => {
    fixture.componentRef.setInput('pageSize', 0);
    expect(component.totalPages()).toBe(12);
  });
});
