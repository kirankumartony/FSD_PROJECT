import { buildTodosUrl } from './todoQuery';

describe('buildTodosUrl', () => {
  it('sends active query filters to the API', () => {
    expect(
      buildTodosUrl('http://localhost:3000/api', {
        search: 'release notes',
        status: 'active',
        priority: 'high',
        due: 'today',
      })
    ).toBe('http://localhost:3000/api/todos?search=release+notes&status=active&priority=high&due=today');
  });

  it('omits default filters from the request', () => {
    expect(
      buildTodosUrl('http://localhost:3000/api', {
        search: '',
        status: 'all',
        priority: 'all',
        due: 'all',
      })
    ).toBe('http://localhost:3000/api/todos');
  });
});
