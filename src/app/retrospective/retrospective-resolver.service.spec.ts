import { TestBed, inject } from '@angular/core/testing';

import { RetrospectiveResolverService } from './retrospective-resolver.service';

describe('RetrospectiveResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetrospectiveResolverService]
    });
  });

  it('should be created', inject([RetrospectiveResolverService], (service: RetrospectiveResolverService) => {
    expect(service).toBeTruthy();
  }));
});
