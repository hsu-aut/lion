import { RdfModellingModule } from './rdf-modelling.module';

describe('RdfModellingModule', () => {
  let rdfModule: RdfModellingModule;

  beforeEach(() => {
    rdfModule = new RdfModellingModule();
  });

  it('should create an instance', () => {
    expect(rdfModule).toBeTruthy();
  });
});