import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SuperHero } from '../../../core/models/super-hero.model';
import { HeroListComponent } from './hero-list.component';
import { SuperHeroService } from '../../../core/services/super-hero/super-hero.service';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let heroServiceSpy: jasmine.SpyObj<SuperHeroService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const heroes: SuperHero[] = [
    { id: 1, name: 'Spiderman', realName: 'Peter Parker', power: 'Agilidad', universe: 'Marvel' },
    { id: 2, name: 'Superman', realName: 'Clark Kent', power: 'Vuelo', universe: 'DC' },
  ];

  // Crea el fixture y hace el primer detectChanges + tick dentro de fakeAsync,
  // para que el debounceTime(300) del constructor quede sobre el reloj virtual
  // de fakeAsync y no dispare un setTimeout "real" fuera de control del test.
  function setup(): void {
    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    heroServiceSpy = jasmine.createSpyObj('SuperHeroService', ['search', 'delete']);
    heroServiceSpy.search.and.returnValue(of(heroes));

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeroListComponent],
      providers: [
        { provide: SuperHeroService, useValue: heroServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  it('debería crearse y cargar el listado inicial', fakeAsync(() => {
    setup();

    expect(heroServiceSpy.search).toHaveBeenCalled();
    expect(component.pagedHeroes().length).toBe(2);
  }));

  it('debería filtrar en base al valor ingresado, con debounce', fakeAsync(() => {
    setup();
    heroServiceSpy.search.calls.reset();
    heroServiceSpy.search.and.returnValue(of([heroes[0]]));

    component.filterControl.setValue('man');
    tick(300);
    fixture.detectChanges();

    expect(heroServiceSpy.search).toHaveBeenCalledWith('man');
    expect(component.pagedHeroes().length).toBe(1);
  }));

  it('onAdd() debería navegar a la ruta de alta', fakeAsync(() => {
    setup();
    component.onAdd();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes/nuevo']);
  }));

  it('onEdit() debería navegar a la ruta de edición del héroe', fakeAsync(() => {
    setup();
    component.onEdit(heroes[0]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes', 1, 'editar']);
  }));

  it('onDeleteRequest() debería abrir el diálogo de confirmación', fakeAsync(() => {
    setup();
    component.onDeleteRequest(heroes[0]);
    expect(component.heroToDelete()).toEqual(heroes[0]);
  }));

  it('onDeleteCancel() debería cerrar el diálogo sin eliminar', fakeAsync(() => {
    setup();
    component.onDeleteRequest(heroes[0]);
    component.onDeleteCancel();
    expect(component.heroToDelete()).toBeNull();
    expect(heroServiceSpy.delete).not.toHaveBeenCalled();
  }));

  it('onDeleteConfirm() debería eliminar el héroe y cerrar el diálogo', fakeAsync(() => {
    setup();
    heroServiceSpy.delete.and.returnValue(of(undefined));

    component.onDeleteRequest(heroes[0]);
    component.onDeleteConfirm();

    expect(heroServiceSpy.delete).toHaveBeenCalledWith(1);
    expect(component.heroToDelete()).toBeNull();
    expect(component.pagedHeroes().some((h) => h.id === 1)).toBeFalse();
  }));

  it('onDeleteConfirm() debería mostrar un error si falla el borrado', fakeAsync(() => {
    setup();
    heroServiceSpy.delete.and.returnValue(throwError(() => new Error('fail')));

    component.onDeleteRequest(heroes[0]);
    component.onDeleteConfirm();

    expect(component.errorMessage()).toContain('No se pudo eliminar');
    expect(component.heroToDelete()).toBeNull();
  }));
});
