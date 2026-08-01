import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SuperHero } from '../../models/super-hero.model';

const API_URL = 'api/heroes';

/**
 * Servicio de acceso a datos de Super Héroes.
 *
 * Se apoya en HttpClient (contra angular-in-memory-web-api) en vez de
 * mantener el estado "a mano" en el propio servicio, para que:
 *  - Los componentes trabajen 100% de forma reactiva con Observables.
 *  - El interceptor de loading global funcione igual que con una API real.
 *  - El código sea el mismo el día que haya un backend real: alcanza con
 *    quitar InMemoryDataService de app.config.ts.
 */
@Injectable({ providedIn: 'root' })
export class SuperHeroService {
  private readonly http = inject(HttpClient);

  /** Devuelve todos los héroes. */
  getAll(): Observable<SuperHero[]> {
    return this.http.get<SuperHero[]>(API_URL);
  }

  /** Devuelve un único héroe por id. */
  getById(id: number): Observable<SuperHero> {
    return this.http.get<SuperHero>(`${API_URL}/${id}`);
  }

  /**
   * Devuelve los héroes cuyo `name` contiene el término recibido
   * (case-insensitive), por ejemplo "man" -> Spiderman, Superman,
   * Superwoman.
   */
  search(term: string): Observable<SuperHero[]> {
    const query = term.trim();
    if (!query) {
      return this.getAll();
    }
    const params = new HttpParams().set('name', query);
    return this.http.get<SuperHero[]>(`${API_URL}/`, { params });
  }

  /** Da de alta un nuevo héroe. El backend en memoria le asigna el id. */
  create(hero: Omit<SuperHero, 'id'>): Observable<SuperHero> {
    return this.http.post<SuperHero>(API_URL, hero);
  }

  /** Actualiza un héroe existente. */
  update(hero: SuperHero): Observable<SuperHero> {
    return this.http.put<SuperHero>(`${API_URL}/${hero.id}`, hero);
  }

  /** Elimina un héroe por id. */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
