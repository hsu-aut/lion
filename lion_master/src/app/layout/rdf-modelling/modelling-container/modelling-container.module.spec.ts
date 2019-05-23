import { ModellingContainerModule } from './modelling-container.module';

describe('ModellingContainerModule', () => {
  let rdfModule: ModellingContainerModule;

  beforeEach(() => {
    rdfModule = new ModellingContainerModule();
  });

  it('should create an instance', () => {
    expect(rdfModule).toBeTruthy();
  });
});