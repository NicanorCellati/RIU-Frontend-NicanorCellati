import { SuperHero } from '../../models/super-hero.model';
import { InMemoryDataService } from './in-memory-data.service';

describe('InMemoryDataService', () => {
  let service: InMemoryDataService;

  beforeEach(() => {
    service = new InMemoryDataService();
  });

  it('createDb() debería devolver el listado inicial de héroes', () => {
    const db = service.createDb() as { heroes: SuperHero[] };
    expect(db.heroes.length).toBe(12);
    expect(db.heroes[0].name).toBe('Spiderman');
  });

  it('genId() debería devolver max(id) + 1 cuando ya hay héroes', () => {
    const heroes = [{ id: 3 }, { id: 7 }, { id: 5 }] as SuperHero[];
    expect(service.genId(heroes)).toBe(8);
  });
});
