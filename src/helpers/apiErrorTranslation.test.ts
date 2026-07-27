import translateErrorMessage from './apiErrorTranslation';

describe('translateErrorMessage', () => {
  it('translates a known server error string', () => {
    expect(translateErrorMessage('This user has already accepted to this channel')).toBe(
      'You are already a member of this channel',
    );
  });

  it('passes through an unknown server error string unchanged', () => {
    expect(translateErrorMessage('Some unmapped server error')).toBe('Some unmapped server error');
  });
});
