import { CursoMEANAPPPage } from './app.po';

describe('curso-mean-app App', () => {
  let page: CursoMEANAPPPage;

  beforeEach(() => {
    page = new CursoMEANAPPPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
