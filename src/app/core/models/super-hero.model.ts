/**
 * Universos disponibles para clasificar a un súper héroe.
 * Se modela como union type en vez de string libre para evitar
 * valores inconsistentes en el formulario
 */
export type HeroUniverse = 'Marvel' | 'DC' | 'Valiant' | 'Dark Horse';

/**
 * Entidad principal del dominio. `id` es opcional porque un héroe
 * "nuevo" (todavía no persistido) no tiene id hasta que el servicio
 * se lo asigna al crearlo.
 */
export interface SuperHero {
  id?: number;
  name: string;
  realName: string;
  power: string;
  universe: HeroUniverse;
  imageUrl?: string;
}

/**
 * DTO utilizado por el formulario de alta/edición. Se separa del
 * modelo principal para que el formulario nunca dependa de un `id`
 * (el id lo gestiona exclusivamente el servicio).
 */
export type SuperHeroFormValue = Omit<SuperHero, 'id'>;

/** Resultado paginado genérico, reutilizable para cualquier listado. */
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};