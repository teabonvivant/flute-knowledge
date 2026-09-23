---
name: "長笛知識館 / Quiet Flute Library"
description: "A literary flute library with Japanese classical restraint."
colors:
  background: "hsl(45 29% 97%)"
  foreground: "hsl(86 6% 20%)"
  primary: "hsl(86 13% 32%)"
  primary-foreground: "hsl(45 29% 97%)"
  card: "hsl(45 30% 99%)"
  muted: "hsl(48 12% 94%)"
  muted-foreground: "hsl(49 5% 40%)"
  border: "hsl(52 10% 83%)"
  input: "hsl(50 7% 57%)"
  dark-background: "hsl(65 6% 12%)"
  dark-foreground: "hsl(45 17% 88%)"
  dark-primary: "hsl(78 18% 72%)"
  dark-primary-foreground: "hsl(65 6% 12%)"
  dark-card: "hsl(65 6% 15%)"
  dark-muted: "hsl(65 5% 16%)"
  dark-muted-foreground: "hsl(48 9% 70%)"
  dark-border: "hsl(65 5% 32%)"
  dark-input: "hsl(50 7% 48%)"
typography:
  display:
    fontFamily: "\"Atlas Serif\", \"Noto Serif TC\", \"Songti TC\", \"PMingLiU\", serif"
    fontSize: "clamp(30px,3.2vw,42px)"
    fontWeight: 500
    lineHeight: 1.65
    letterSpacing: ".075em"
  article-title:
    fontFamily: "\"Atlas Serif\", \"Noto Serif TC\", \"Songti TC\", \"PMingLiU\", serif"
    fontSize: "clamp(28px,3vw,38px)"
    fontWeight: 500
    lineHeight: 1.85
    letterSpacing: ".05em"
  body:
    fontFamily: "\"Atlas Serif\", \"Noto Serif TC\", \"Songti TC\", \"PMingLiU\", serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 2.3
    letterSpacing: ".025em"
  body-mobile:
    fontFamily: "\"Atlas Serif\", \"Noto Serif TC\", \"Songti TC\", \"PMingLiU\", serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 2.2
  utility:
    fontFamily: "\"Atlas Noto\", \"Microsoft JhengHei\", \"PingFang TC\", sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  control: "2px"
spacing:
  section: "88px"
  section-mobile: "62px"
  gutter: "32px"
  gutter-mobile: "20px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.control}"
    padding: "8px 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "8px 20px"
    height: "44px"
  button-ghost:
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "8px 20px"
    height: "44px"
  button-link:
    textColor: "{colors.primary}"
    padding: "8px 0"
    height: "44px"
---
# Design System: 長笛知識館

## Overview

**Creative North Star: "Quiet Flute Library"**

A quiet Chinese reading room: soft paper, warm ink, restrained olive and natural-light flute imagery. The user-approved Yakumo Saryo and Natsuhasha references establish cultural atmosphere and literary typography. The rejected silver-blue oversized English masthead is not part of this system.

Key characteristics: Ming/Song typography, measured whitespace, natural material in the photography, flat editorial surfaces, and legible utility controls. Product facts and publication scope remain in PRODUCT.md; page composition lives in the surface brief.

## Colors

The frontmatter preserves the exact HSL source values. Olive is the primary action colour; warm ink provides reading contrast. Paper, muted fields and thin rules separate sections. The brass, wine and reed aliases all resolve to the same olive source rather than separate decorative accents.

**The One Palette Rule.** Use the semantic variables across every route. The dark reading theme replaces them with warm charcoal, pale ink and light olive. Explicit data-theme wins; otherwise the system colour preference applies.

## Typography

Atlas Serif is the self-hosted Noto Serif TC family, used for headings and reading text; Atlas Noto is self-hosted Noto Sans TC for utility controls, metadata and tables. Their fallbacks are recorded above. Font display uses swap. The small English brand line uses Georgia. Local font licences are in public/fonts/.

The article title becomes 30px below 768px and 27px at 520px or less. Article section headings use 24px on desktop and 23px on mobile. General prose uses 17px with line-height 2.2; the journal body has its own desktop and mobile roles above. Existing component utility styles can use sans; that does not redefine the reading voice.

**The Reading Voice Rule.** Keep editorial headings and paragraphs in the serif family; use sans for concise operational information.

## Layout

The desktop content wrapper is 1184px including 32px side padding, leaving 1120px inside. At 767px the gutters become 24px, and at 520px they become 20px. Journal prose is limited to 650px; general prose to 690px. Major bands use the section spacing above.

The journal contents column is 170px beside the body on wide screens; at 1100px it becomes 150px. At 999px it stacks above the body. Desktop navigation switches to the sticky compact header below 1000px. Article shelves change from three columns to image/text rows below 1000px and single columns at 520px. Filters wrap instead of creating horizontal page scroll. The narrower breakpoints are 767px and 520px.

## Elevation & Depth

Reading surfaces are flat. Rules and slight background changes define sections. The temporary mobile navigation uses a soft downward shadow; cards have no shadow. Photographic light carries the material depth.

## Shapes

Controls and the common card primitive use a restrained 2px radius; some utility fields retain square corners. Images remain rectangular, without decorative masks. Rules use the border token. Touch controls generally retain at least 44px height.

## Components

The centred desktop wordmark sits above the main navigation; on smaller screens it moves left beside search and menu controls. Current navigation and hover states use a thin underline. Mobile menu links use a subdued active fill.

Buttons have primary, secondary, ghost and link variants. Disabled buttons reduce opacity and block pointer actions. Inputs have clear borders and visible labels; classification and pagination remain ordinary links. Keyboard focus uses the ring colour. Selection, caret and scrollbars also use the semantic palette.

Journal entries combine image, title, category/reading time, excerpt and a plain reading action. Article pages preserve breadcrumb classification, a centred title/byline, photograph with caption, readable body, contents and related reading. Do not restore the removed duplicate category above the H1.

The homepage image is public/images/design/quiet-headjoint.webp. Its adjacent provenance sidecar records the exact prompt and source. Original article images and diagrams remain separate subject matter, not decorative replacements.

Link colour/background transitions last 0.2 seconds; anchor scrolling is smooth. The button primitive has its existing pressed scale. Reduced-motion mode disables transforms and smooth scrolling, and reduces animation/transition duration. Print removes header, footer and contents chrome.

## Do's and Don'ts

- Do retain Chinese serif titles and comfortable reading measures.
- Do preserve source links, classification and accessible controls when simplifying a page.
- Do use real content and subject-specific imagery with durable provenance.
- Don't restore the rejected blue/silver oversized sans-serif identity.
- Don't add decorative preheading labels or external-link arrows to internal reading links.
- Don't hide content behind entrance animation or remove the reading display preference.
