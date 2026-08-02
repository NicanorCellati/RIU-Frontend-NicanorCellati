import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { SuperHero } from '../../../core/models/super-hero.model';
import { HeroFormComponent } from './hero-form.component';
import { SuperHeroService } from '../../../core/services/super-hero/super-hero.service';

describe('HeroFormComponent', () => {
  let fixture: ComponentFixture<HeroFormComponent>;
  let component: HeroFormComponent;
  let heroServiceSpy: jasmine.SpyObj<SuperHeroService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const hero: SuperHero = {
    id: 1,
    name: 'SPIDERMAN',
    realName: 'Peter Parker',
    power: 'Agilidad y sentido arácnido',
    universe: 'Marvel',
  };

  function setup(paramMap: Record<string, string> = {}): void {
    TestBed.configureTestingModule({
      imports: [HeroFormComponent],
      providers: [
        { provide: SuperHeroService, useValue: heroServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap(paramMap)) },
        },
      ],
    });
    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    heroServiceSpy = jasmine.createSpyObj('SuperHeroService', ['getById', 'create', 'update']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  });

  describe('modo alta (sin :id)', () => {
    beforeEach(() => setup());

    it('debería crearse en modo alta, sin precargar nada', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBeFalse();
      expect(heroServiceSpy.getById).not.toHaveBeenCalled();
    });

    it('submit() con el form inválido no debería llamar al servicio, y marca todo como touched', () => {
      component.submit();

      expect(heroServiceSpy.create).not.toHaveBeenCalled();
      expect(component.form.get('name')?.touched).toBeTrue();
    });

    it('submit() con el form válido debería crear el héroe y navegar al listado', () => {
      heroServiceSpy.create.and.returnValue(of(hero));
      component.form.setValue({
        name: 'SPIDERMAN',
        realName: 'Peter Parker',
        power: 'Agilidad y sentido arácnido',
        universe: 'Marvel',
        imageUrl: '',
      });

      component.submit();

      expect(heroServiceSpy.create).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes']);
    });

    it('hasError() debería devolver true si el control fue tocado y tiene ese error', () => {
      component.form.get('name')?.markAsTouched();
      expect(component.hasError('name', 'required')).toBeTrue();
    });

    it('hasError() debería devolver false para un control que no existe en el form', () => {
      expect(component.hasError('id' as never, 'required')).toBeFalse();
    });
  });

  describe('modo edición (con :id)', () => {
    it('debería precargar el héroe en modo edición', () => {
      heroServiceSpy.getById.and.returnValue(of(hero));

      setup({ id: '1' });

      expect(heroServiceSpy.getById).toHaveBeenCalledWith(1);
      expect(component.isEditMode()).toBeTrue();
      expect(component.form.value.name).toBe('SPIDERMAN');
    });

    it('submit() en modo edición debería actualizar el héroe existente', () => {
      heroServiceSpy.getById.and.returnValue(of(hero));
      setup({ id: '1' });
      heroServiceSpy.update.and.returnValue(of(hero));

      component.submit();

      expect(heroServiceSpy.update).toHaveBeenCalledWith(jasmine.objectContaining({ id: 1 }));
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes']);
    });
  });
});
