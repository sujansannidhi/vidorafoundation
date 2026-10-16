/**
 * URL building for the Open Paths Google Forms. No copy lives here.
 */
import { forms } from '../content/volunteer.ts';

/** The sign-up form with the event prefilled, or null if either piece is missing. */
export function signupUrlFor(eventId: string): string | null {
  if (!forms.signup || !forms.signupEventField) return null;
  const url = new URL(forms.signup);
  url.searchParams.set(forms.signupEventField, eventId);
  return url.toString();
}
