import schema from './index';

const validFixture = {
  firstName: 'Sahin',
  lastName: 'Maral',
  middleName: '',
  bio: '',
};

describe('EditProfileSchema', () => {
  it('accepts a valid fixture with empty optional fields', () => {
    expect(schema.isValidSync(validFixture)).toBe(true);
  });

  it('trims leading/trailing whitespace before validating length', () => {
    expect(schema.isValidSync({ ...validFixture, firstName: '  Sahin  ' })).toBe(true);
  });

  it('rejects a firstName that is too short after trimming', () => {
    expect(schema.isValidSync({ ...validFixture, firstName: ' J ' })).toBe(false);
  });

  it('rejects a firstName over 50 characters', () => {
    expect(schema.isValidSync({ ...validFixture, firstName: 'a'.repeat(51) })).toBe(false);
  });

  it('rejects a missing lastName', () => {
    expect(schema.isValidSync({ ...validFixture, lastName: '' })).toBe(false);
  });

  it('accepts a valid middleName and bio when provided', () => {
    expect(schema.isValidSync({ ...validFixture, middleName: 'Ali', bio: 'Hello there' })).toBe(
      true,
    );
  });

  it('rejects a middleName that is too short when provided', () => {
    expect(schema.isValidSync({ ...validFixture, middleName: 'A' })).toBe(false);
  });

  it('rejects a bio over 300 characters', () => {
    expect(schema.isValidSync({ ...validFixture, bio: 'a'.repeat(301) })).toBe(false);
  });
});
