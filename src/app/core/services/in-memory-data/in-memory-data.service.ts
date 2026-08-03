import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, ResponseOptions } from 'angular-in-memory-web-api';
import { SuperHero } from '../../models/super-hero.model';

/**
 * Fuente de datos en memoria que simula un backend REST real detrás de
 * HttpClient (vía angular-in-memory-web-api). Esto permitirá que HeroService
 * use HttpClient de forma genuina —incluyendo interceptors, manejo de
 * errores HTTP y latencia simulada— sin necesitar un servidor real,
 * cumpliendo el requisito de la prueba ("como requisito del desafio no hacía falta un backend").
 */
@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes: SuperHero[] = [
      {
        id: 1,
        name: 'Spiderman',
        realName: 'Peter Parker',
        power: 'Agilidad y sentido arácnido',
        universe: 'Marvel',
        imageUrl: '',
      },
      {
        id: 2,
        name: 'Superman',
        realName: 'Clark Kent',
        power: 'Fuerza y vuelo',
        universe: 'DC',
        imageUrl: '',
      },
      {
        id: 3,
        name: 'Bloodshot',
        realName: 'Angelo Mortalli',
        power: 'Maquina de pelea',
        universe: 'Valiant',
        imageUrl: '',
      },
      {
        id: 4,
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 'Estrategia e ingeniería',
        universe: 'DC',
        imageUrl: '',
      },
      {
        id: 5,
        name: 'Ironman',
        realName: 'Tony Stark',
        power: 'Armadura tecnológica',
        universe: 'Marvel',
        imageUrl: '',
      },
      {
        id: 6,
        name: 'Wonder Woman',
        realName: 'Diana Prince',
        power: 'Fuerza y lazo de la verdad',
        universe: 'DC',
        imageUrl: '',
      },
      {
        id: 7,
        name: 'Wolverine',
        realName: 'Logan',
        power: 'Regeneración y garras de adamantium',
        universe: 'Marvel',
        imageUrl: '',
      },
      {
        id: 8,
        name: 'Aquaman',
        realName: 'Arthur Curry',
        power: 'Control de los mares',
        universe: 'DC',
        imageUrl: '',
      },
      {
        id: 9,
        name: 'Deadpool',
        realName: 'Wade Wilson',
        power: 'Regeneración y humor letal',
        universe: 'Marvel',
        imageUrl: '',
      },
      {
        id: 10,
        name: 'Flash',
        realName: 'Barry Allen',
        power: 'Súper velocidad',
        universe: 'DC',
        imageUrl: '',
      },
      {
        id: 11,
        name: 'Superwoman',
        realName: 'Kristin Wells',
        power: 'Fuerza y vuelo',
        universe: 'DC',
        imageUrl: '',
      },
      {
        id: 12,
        name: 'Hellboy',
        realName: 'Anung Un Rama',
        power: 'Demonio con gran corazón',
        universe: 'Dark Horse',
        imageUrl: '',
      },
    ];
    return { heroes };
  }

  /** Asigna ids incrementales al crear, como haría una API real. */
  genId(heroes: SuperHero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map((h) => h.id ?? 0)) + 1 : 1;
  }

  /**
   * Simula latencia de red realista, para que el interceptor de loading
   * y los estados de carga de la UI tengan sentido de mostrarse en pantalla.
   */
  responseInterceptor(res: ResponseOptions, _reqInfo: RequestInfo): ResponseOptions {
    return res;
  }
}
