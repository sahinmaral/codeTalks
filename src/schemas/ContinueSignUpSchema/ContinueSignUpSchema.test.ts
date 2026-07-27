import schema from './index';

const validFixture = {
  firstName: 'Sahin',
  lastName: 'Maral',
};

describe('ContinueSignUpSchema', () => {
  it('accepts a valid fixture', () => {
    expect(schema.isValidSync(validFixture)).toBe(true);
  });

  it('rejects a missing firstName', () => {
    expect(schema.isValidSync({ ...validFixture, firstName: '' })).toBe(false);
  });

  it('rejects a missing lastName', () => {
    expect(schema.isValidSync({ ...validFixture, lastName: '' })).toBe(false);
  });

  it('allows a null middleName', () => {
    expect(schema.isValidSync({ ...validFixture, middleName: null })).toBe(true);
  });
});
