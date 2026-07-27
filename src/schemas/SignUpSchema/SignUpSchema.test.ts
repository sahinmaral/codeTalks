import schema from './index';

const validFixture = {
  username: 'sahin',
  email: 'sahin@example.com',
  password: 'Aa1#aaaa',
  passwordConfirm: 'Aa1#aaaa',
};

describe('SignUpSchema', () => {
  it('accepts a valid fixture', () => {
    expect(schema.isValidSync(validFixture)).toBe(true);
  });

  it('rejects a username shorter than 3 characters', () => {
    expect(schema.isValidSync({ ...validFixture, username: 'ab' })).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(schema.isValidSync({ ...validFixture, email: 'not-an-email' })).toBe(false);
  });

  it.each([
    ['no uppercase', 'aa1#aaaa'],
    ['no lowercase', 'AA1#AAAA'],
    ['no digit', 'Aa#aaaaa'],
    ['no special char', 'Aa1aaaaa'],
    ['too short', 'Aa1#a'],
  ])('rejects a weak password (%s)', (_label, password) => {
    expect(schema.isValidSync({ ...validFixture, password, passwordConfirm: password })).toBe(
      false,
    );
  });

  it('rejects when passwordConfirm does not match password', () => {
    expect(schema.isValidSync({ ...validFixture, passwordConfirm: 'Different1#' })).toBe(false);
  });
});
