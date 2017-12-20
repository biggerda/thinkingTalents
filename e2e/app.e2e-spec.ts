import { ThinkingTalentsPage } from './app.po';

describe('thinking-talents App', () => {
  let page: ThinkingTalentsPage;

  beforeEach(() => {
    page = new ThinkingTalentsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
