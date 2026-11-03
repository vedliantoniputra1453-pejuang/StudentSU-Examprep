# anti-slop.md

Checklist for detecting and avoiding AI slop in StudentSU Examprep. Slop is not ugly design — it is **unearned signal**: decoration, claims, and UI furniture that imply value the product has not delivered. Read this before you say "done".

## 1. The shapes of slop

**Generic gradient hero.** Purple-to-blue mesh, floating orbs, blurred blobs behind a headline. Signals "we had no idea what this product is".
Fix: delete the gradient. Put the real product surface — a question, a CPMK, a score — in the hero.

**Emoji spam.** 🚀✨🎯 sprinkled into headings, buttons, and toasts to manufacture energy.
Fix: remove all emoji. Use an inline SVG icon or nothing. One idea per heading.

**Hype micro-copy.** "Supercharge your study game", "Unlock your potential", "Learning, reimagined".
Fix: state the function. "Latihan soal dari materi kuliahmu."

**Fake cards.** Stat cards showing "1,204 students", "98% satisfaction", "12x faster" with no source.
Fix: delete, or replace with a number the app actually computed from this user's data — and label it as such.

**Invented statistics.** Any percentage, count, or benchmark not derived from real local state is a lie.
Fix: remove. If a real metric exists, show it with its unit and period.

**Animation theatre.** Looping shimmer skeletons on content that loads instantly, staggered entrance on every card, particles on every click.
Fix: one transition per state change, 240ms. Reduce motion shortens it. Nothing loops.

**Random glassmorphism.** Blurred translucent panels over a blurred background because it looked modern in a screenshot.
Fix: white surface, 1px outline, 20px radius. The design system already solved this.

**"AI-powered" as a claim.** Badge on everything, with no statement of what the AI does or where it can be wrong.
Fix: say what it does — "Soal dibuat dari CPMK dan materimu oleh Gemini" — and show the failure state.

**Dark patterns.** Pre-checked boxes, "no thanks" styled as a dead link, a 4-step cancel flow, artificial urgency ("2 soal tersisa hari ini!").
Fix: symmetric choices, one-click reversal, no pressure.

**Fake badges.** "Verified", "Official SU partner", lock icons on features that are merely unbuilt, streaks that reset to look longer.
Fix: only label what is true. Unbuilt means not shown.

**Empty-state cheer.** A giant illustration and "Belum ada apa-apa nih! Yuk mulai!" where a next action belongs.
Fix: one sentence of state plus one primary action.

## 2. How to fix slop

Work in this order. Stop at the first step that applies.

1. **Delete it.** Most slop is removable without replacement. Do that first.
2. **Replace with real content.** Show the student's actual CPMK, actual score, actual material title.
3. **Simplify.** Fewer words, fewer decorations, fewer containers. Cut the badge, keep the sentence.
4. **Make it honest.** If something is unbuilt, unknown, or approximate, say so in place.

Never fix slop by adding more: no second gradient, no "cleaner" illustration, no extra tooltip explaining the decoration.

## 3. Self-review before you finish

Answer all five in writing in your head. Any "no" is a blocker.

1. **If I removed every decorative element, would the page still communicate?** If no, the content is too thin — fix the content, not the decoration.
2. **Is every number on screen computed from real state?** If a number is a placeholder, delete it or label it "contoh".
3. **Could a skeptical student ask "says who?" about any claim here?** If yes, remove the claim.
4. **Does any animation or color exist purely to seem impressive?** If yes, cut it.
5. **Does the copy name the specific thing (CPMK, sesi, UTS, mata kuliah), or is it generic study-app filler?** If generic, rewrite it.

## 4. Banned words and phrases

Never ship these in UI copy, headings, empty states, toasts, or metadata.

- unlock, unleash, supercharge, elevate, empower, transform, reimagine, revolutionize, seamless, effortless, cutting-edge, next-gen, game-changer, world-class, best-in-class
- AI-powered, AI-driven, smart, intelligent, magic, magical (as a product claim)
- Oops, Yay, Whoops, Uh oh, Ta-da, Voila
- "your journey", "take your learning to the next level", "study smarter, not harder"
- "built for students like you" (with no evidence), "trusted by thousands"
- Rocket, sparkle, lightning, trophy emoji
- Lorem ipsum in any form, including "Coming soon" as a substitute for a decision

## 5. Slop test for visuals

- No gradient fills except the one flat token surface.
- No more than two type families per screen (display + body).
- No body text below 16px; 14px is the floor for captions and labels.
- No card inside a card inside a card.
- No shadow without an elevation reason (hover, modal).
- No color used for decoration only — every accent means something (leaf = progress, coral = needs work, sun = achievement).
- Icons at one stroke weight and one corner style; no mixed icon sets.