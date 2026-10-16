# Vidora Foundation

Static site for Vidora Foundation. Astro 5, TypeScript, GSAP for the scroll
journey on `/`. No framework runtime: the nine content routes ship 0 KB of
JavaScript, and only the journey page loads GSAP.

## Running it

```
npm install
npm run dev      # http://localhost:4321
npm run build    # runs the content rules, then builds to dist/
npm run rules    # content rules only
npm run check    # content rules + astro check
```

`node scripts/generate-road.mjs` regenerates the road geometry. Edit the
control points in that script rather than the generated `road-paths.ts`.

## Where things live

- `src/content/` is the only place copy and numbers live. Nothing in
  `src/components` or `src/pages` hardcodes text.
- `src/styles/tokens.css` is the only file allowed to contain a hex value.
- `scripts/check-content-rules.mjs` enforces the brand and content rules and
  runs before every build.

## Rules the build enforces

These are not style preferences. Each one exists because breaking it creates
legal or credibility exposure.

1. No hex outside `tokens.css`.
2. Copper on a light surface is 2.67:1 and fails WCAG AA, so there is no token
   named `--copper` and `--copper-fill` may never appear in a colour property.
   The three copper tokens are named for where they are safe.
3. Contrast floors are computed from the tokens, not trusted.
4. Banned copy, and no em dashes.
5. 501(c)(3) status is pending, so no page may imply a tax benefit. The wording
   is one shared component, `PendingStatus.astro`, and no other file may
   mention deductibility.
6. Prospect organisations may not appear as partners.
7. Every published number carries a `source`, and must state what it excludes.
8. The three impact figures are three separate named exports. There is no array
   to iterate and `ImpactFigure.astro` takes exactly one figure, so no code path
   can sum them.
9. Every pillar carries a status, and a Planned pillar cannot be described in
   the present tense. Checked per field.
10. Gradients may not fade to the bare `transparent` keyword, which blends
    through transparent black and bands.
11. Never fabricate: a person's bio is `null` (rendered as an honest gap), never
    an empty array.
12. Open Paths (`src/content/volunteer.ts`): every event has an `EVT-*` id, a
    unique slug, steps, proof, safety rules, a cap and a machine-readable
    `capRule`; credits are well formed (bands ascend with no gaps or overlaps);
    no single submission can earn more than 8 hours; the global caps are exactly
    12 hours a month and 60 a school year; no copy anywhere promises hours
    ("easy hours", "guaranteed hours" and similar); and PVSA wording appears
    only in `volunteer.ts`.

## Open register

Everything below renders in the interface as a short, public-facing
"Coming soon" note (`TodoNote.astro`) until it is answered. Nothing is guessed
at and nothing is silently blank.

| # | Needed | Blocks |
|---|---|---|
| 1 | **Logo files** (lockup and mark) | header, footer, favicon, OG images |
| 2 | Bios, roles, photos, LinkedIn for Praneel, Neha, Mani | `/people` |
| 3 | GoFundMe URL | `/donate`, `/join`, stage 07 |
| 4 | Contact email, social handles, newsletter provider | footer, `/updates` |
| 5 | A photograph of the wholesale market the supplies were bought at | campaign page |
| 6 | Kit contents per grade | `/programs`, stages 03 and 05 |
| 7 | Chapter requirements and application process | `/join`, stage 07 |
| 8 | Confirmed partner list plus written permission | `/partners` |
| 9 | Whether any school may be named publicly | campaign page |
| 10 | Whether to publish an enrolment figure at all | `/impact` |
| 11 | Sign off on Sujan's bio, which is assembled from published copy | `/people` |
| 12 | The last field report stop, "what we would do differently" | stage 05 |
| 13 | Open Paths F1 Volunteer Registration form URL (`forms.register`) | `/volunteer`, `/volunteer/register` |
| 14 | F2 Event Sign-up form URL and its event field key (`forms.signup`, `forms.signupEventField`) | every event page |
| 15 | F3 Partner Confirmation form URL (`forms.partnerConfirm`) | local event pages, `/volunteer/partners` |
| 16 | F4 Hours Submission form URL (`forms.submit`) | `/volunteer/submit` |
| 17 | F5 Partner Completion form URL (`forms.partnerComplete`) | local event pages, `/volunteer/partners` |
| 18 | Verify endpoint, the Apps Script web app URL (`verifyEndpoint`) | `/verify` |
| 19 | Adult signatory name and title, never a parent of a volunteer (`signatory`) | `/volunteer/hours`, letters |
| 20 | First Drop name, dates and places (`openPaths.currentDrop`); plan proposes Nov 16 to 30, 2026, 75 places | `/volunteer` |
| 21 | Study Library folder URL (`studyLibraryUrl`) | Study Guide Studio |
| 22 | Full participation agreement and full site privacy policy, after legal review | `/volunteer/register`, `/privacy` |
| 23 | Confirm hour credits by having the team time each event once | `volunteer.ts` credits |
| 24 | Recheck the PVSA status before each Drop (`pvsa.checkedOn`) | `/volunteer/hours`, FAQ |
| 25 | Flyer and receipt templates for book and supply drives | drive event pages |

The logo is the one that matters most. There is no logo file in this repo and
the mark has deliberately **not** been recreated from its description, because
altering the mark is a brand hard rule. What ships is the wordmark set in
Bodoni at the real lockup's tracking. Drop the real files into `public/brand/`
and replace `Wordmark.astro` with an `<img>`.

## Open Paths, Phase 2

Phase 1 runs on Google Forms, Sheets and Apps Script. Move to Phase 2 when
Phase 1 reaches about 300 sign-ups a month or reviewers say the Sheet is the
bottleneck. Phase 2 keeps this site on Astro: add the `@astrojs/vercel`
adapter, keep `output: 'static'`, and opt only the dynamic routes out of
prerendering with `export const prerender = false` (a student dashboard at
`/volunteer/me`, a reviewer console at `/admin/review`, and `/api/verify`).
Data moves to hosted Postgres (Supabase or Neon) with tables that mirror the
Sheet tabs one to one and keep every existing ID, so letters already issued
still verify. Check whether Vercel's Hobby plan allows a site that takes
donations before relying on it. Do not add public profiles, comments or
messaging between volunteers: Texas's SCOPE Act covers services that let
minors interact and share content.

## Notes

- `/people` does not name the team's schools. The previous site did. This is a
  deliberate choice, not an oversight, since the team are minors.
- GoFundMe is the only donation channel. No Stripe, no embedded widget, no
  card fields.
- No claim is published about how funds move between the US and India.
