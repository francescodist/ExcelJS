import { CheckDelegationModule } from './check-delegation.module';

describe('CheckDelegationModule', () => {
  let checkDelegationModule: CheckDelegationModule;

  beforeEach(() => {
    checkDelegationModule = new CheckDelegationModule();
  });

  it('should create an instance', () => {
    expect(checkDelegationModule).toBeTruthy();
  });
});
