# Portfolio accessibility review — November 10, 2026

Scope: Home, About, Contact, Ask Read, Chasing Birdies.
Reviewed in Google Chrome on macOS through the native accessibility tree and
keyboard input. Existing live pages were inspected first, then changed pages
were reviewed using a local preview. This is not a WCAG conformance certification
or a completed VoiceOver listening test.

## Fixes

- Named all six main landmarks “Main content” and made them programmatically
  focusable. The skip link now lands on a named destination. Project overview
  sections also accept focus and retain their heading-based names.
- Removed decorative menu numbering from accessible names. Related-project
  cards now use concise, distinct “View the concept: [project]” names.
- Moved Ask Read's title before its dashboard in DOM reading order. Hid the
  scripted dashboard chrome while preserving the working evidence disclosure,
  source links, and a concise preview description. Added a level-two heading
  before the evidence categories and another for the product walkthrough.
- Made the decorative QB tablet, walkthrough phone, and static Plays workspace
  inert. During keyboard testing, Chrome focused the phone's scrolling area and
  exposed its contents despite `aria-hidden`; `inert` prevents that focus entry.
  The real Library season controls remain interactive.
- Moved the Birdies roster introduction before its list in DOM order, preserving
  desktop grid placement and the existing introduction-first mobile layout.
  Corrected the course-overview heading from level three to level two.
- Hid About's decorative sculpture from the reading order.
- Restored focus to Contact's submit button after a response if disabling it had
  moved focus to the document and the visitor had not focused another control.
  Entered values remain after failure; success clears the form.

## Verification

| Area | Observed result |
| --- | --- |
| Six-page reading structure | Inspected names, headings, image descriptions, links, and reading order in the macOS accessibility tree. |
| Home | Skip to content lands on Main content; Explore selected work lands on the named Ask Read section. |
| About | Skip target accepts focus; next Tab reaches the Contact CTA; decorative sculpture is absent from the accessibility tree. |
| Contact | Labels and keyboard sequence are usable; empty submission focuses the required name field with native validation feedback. |
| Ask Read | Title precedes preview; evidence disclosure opens by keyboard; sources appear when expanded. Overview receives focus. Tab then reaches the Library switches without entering decorative mockups; Space on Offseason exposes the offseason panel. |
| Chasing Birdies | Named main target accepts focus; roster heading precedes the list; keyboard activation changes the film button between Play swing and Pause swing. |
| Shared menu | Keyboard opening focuses Close menu; Tab reaches menu links; underlying page is excluded while modal is open; Escape returns focus to Open menu. Browser chrome remains reachable through normal browser navigation. |
| Contact responses | A localhost-only test endpoint returned failure and success. Both messages appeared in accessibility output; focus returned to Send message. Failure preserved input; success reset it. No message was sent to Web3Forms. |
| Source checks | Generated regions, JavaScript syntax, whitespace, local link/asset paths, and fragment targets checked. |

## Still requires listening verification

VoiceOver's speech and overlay could not be captured reliably through the available
connection. Continuous reading, rotor navigation, actual live-region speech, and
whether the user's repeated “empty” announcements persist remain unverified.
Do not mark those checks passed based on accessibility-tree output alone.
A final listening pass should keep Chrome focused, reload the deployed pages,
and cover all six routes with VoiceOver. Record any exact announcement and the
focused control or section before making further changes.
