import schema from './index';

describe('CreateChannelSchema', () => {
  it('accepts a valid fixture', () => {
    expect(schema.isValidSync({ name: 'General', description: 'General discussion' })).toBe(true);
  });

  it('rejects an empty name', () => {
    expect(schema.isValidSync({ name: '', description: 'General discussion' })).toBe(false);
  });

  it('rejects an empty description', () => {
    expect(schema.isValidSync({ name: 'General', description: '' })).toBe(false);
  });
});
