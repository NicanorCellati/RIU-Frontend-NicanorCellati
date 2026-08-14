import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { SuperHeroService } from './super-hero.service';
import { provideInMemoryWebApi } from '../in-memory-data/provide-in-memory-web-api';

describe('SuperHeroService (integración con angular-in-memory-web-api real)', () => {
  let service: SuperHeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideInMemoryWebApi()],
    });
    service = TestBed.inject(SuperHeroService);
  });

  it('search("man") debería devolver varios héroes por coincidencia parcial, no por igualdad exacta', (done) => {
    service.search('man').subscribe((heroes) => {
      expect(heroes.length).toBeGreaterThan(1);
      expect(heroes.every((h) => h.name.toLowerCase().includes('man'))).toBeTrue();
      expect(heroes.some((h) => h.name === 'Spiderman')).toBeTrue();
      expect(heroes.some((h) => h.name === 'Superman')).toBeTrue();
      expect(heroes.some((h) => h.name === 'Wolverine')).toBeFalse();
      done();
    });
  });

  it('search() debería ser case-insensitive', (done) => {
    service.search('MAN').subscribe((heroes) => {
      expect(heroes.length).toBeGreaterThan(1);
      done();
    });
  });

  it('search() con término vacío debería devolver el listado completo (comportamiento de getAll())', (done) => {
    service.search('').subscribe((heroes) => {
      expect(heroes.length).toBe(12);
      done();
    });
  });
});
