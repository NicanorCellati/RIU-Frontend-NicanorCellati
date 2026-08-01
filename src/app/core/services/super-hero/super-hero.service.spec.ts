import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SuperHero } from '../../models/super-hero.model';
import { SuperHeroService } from './super-hero.service';

describe('SuperHeroService', () => {
  let service: SuperHeroService;
  let httpMock: HttpTestingController;

  const mockHero: SuperHero = {
    id: 1,
    name: 'Spiderman',
    realName: 'Peter Parker',
    power: 'Agilidad y sentido arácnido',
    universe: 'Marvel',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SuperHeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Garantiza que no queden requests sin resolver entre tests.
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() debería hacer un GET a api/heroes y devolver el listado completo', () => {
    const mockList: SuperHero[] = [mockHero];

    service.getAll().subscribe((heroes) => {
      expect(heroes.length).toBe(1);
      expect(heroes).toEqual(mockList);
    });

    const req = httpMock.expectOne('api/heroes');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('getById() debería hacer un GET a api/heroes/:id', () => {
    service.getById(1).subscribe((hero) => {
      expect(hero).toEqual(mockHero);
    });

    const req = httpMock.expectOne('api/heroes/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockHero);
  });

  it('search() con término vacío debería comportarse como getAll()', () => {
    service.search('   ').subscribe();

    const req = httpMock.expectOne('api/heroes');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('search("man") debería incluir el término como query param', () => {
    const matches: SuperHero[] = [mockHero];

    service.search('man').subscribe((heroes) => {
      expect(heroes).toEqual(matches);
    });

    const req = httpMock.expectOne((r) => r.url === 'api/heroes/' && r.params.get('name') === 'man');
    expect(req.request.method).toBe('GET');
    req.flush(matches);
  });

  it('create() debería hacer un POST con el héroe (sin id)', () => {
    const { id, ...newHero } = mockHero;

    service.create(newHero).subscribe((hero) => {
      expect(hero.id).toBe(1);
    });

    const req = httpMock.expectOne('api/heroes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);
    req.flush(mockHero);
  });

  it('update() debería hacer un PUT a api/heroes/:id', () => {
    const updated: SuperHero = { ...mockHero, power: 'Nuevo poder' };

    service.update(updated).subscribe((hero) => {
      expect(hero.power).toBe('Nuevo poder');
    });

    const req = httpMock.expectOne(`api/heroes/${updated.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updated);
    req.flush(updated);
  });

  it('delete() debería hacer un DELETE a api/heroes/:id', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne('api/heroes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
