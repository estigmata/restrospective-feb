import { RetrospectivePage } from './app.po';

describe('retrospective App', () => {
  let page: RetrospectivePage;

  beforeEach(() => {
    page = new RetrospectivePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
