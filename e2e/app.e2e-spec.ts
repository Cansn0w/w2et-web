import { W2etPage } from './app.po';

describe('w2et App', function() {
  let page: W2etPage;

  beforeEach(() => {
    page = new W2etPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
