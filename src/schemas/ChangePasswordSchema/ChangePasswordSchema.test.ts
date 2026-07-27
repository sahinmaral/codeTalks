import schema from './index';

const validFixture = {
  currentPassword: 'OldPass1#',
  newPassword: 'NewPass2$',
  newPasswordRepeat: 'NewPass2$',
};

describe('ChangePasswordSchema', () => {
  it('accepts a valid fixture', () => {
    expect(schema.isValidSync(validFixture)).toBe(true);
  });

  it('rejects a newPassword missing a lowercase letter', () => {
    expect(
      schema.isValidSync({
        ...validFixture,
        newPassword: 'NEWPASS2$',
        newPasswordRepeat: 'NEWPASS2$',
      }),
    ).toBe(false);
  });

  it('rejects a newPassword missing an uppercase letter', () => {
    expect(
      schema.isValidSync({
        ...validFixture,
        newPassword: 'newpass2$',
        newPasswordRepeat: 'newpass2$',
      }),
    ).toBe(false);
  });

  it('rejects a newPassword missing a special character', () => {
    expect(
      schema.isValidSync({
        ...validFixture,
        newPassword: 'NewPass2',
        newPasswordRepeat: 'NewPass2',
      }),
    ).toBe(false);
  });

  it('rejects a newPassword equal to currentPassword', () => {
    expect(
      schema.isValidSync({
        ...validFixture,
        newPassword: 'OldPass1#',
        newPasswordRepeat: 'OldPass1#',
      }),
    ).toBe(false);
  });

  it('rejects when newPasswordRepeat does not match newPassword', () => {
    expect(schema.isValidSync({ ...validFixture, newPasswordRepeat: 'Different1#' })).toBe(false);
  });
});
