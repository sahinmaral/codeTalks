import schema from './index';

describe('LoginSchema', () => {
  it('accepts a valid fixture', () => {
    expect(schema.isValidSync({ email: 'sahin@example.com', password: 'anything' })).toBe(true);
  });

  it('rejects a missing email', () => {
    expect(schema.isValidSync({ email: '', password: 'anything' })).toBe(false);
  });

  it('rejects a missing password', () => {
    expect(schema.isValidSync({ email: 'sahin@example.com', password: '' })).toBe(false);
  });
});
