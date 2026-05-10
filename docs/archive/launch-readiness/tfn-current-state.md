# TFN Current State

Last updated: May 8, 2026

This file is the repo-local memory for future Codex sessions.

## Locked Baseline

- Branch: `codex/tfnv2`
- Commit: `4964ffc880729583aaf8373a36d7d5757d7d2aad`
- Tag: `tfn-launch-baseline-2026-05-08`
- Meaning: TFN launch baseline, with the working Google and email flow validated end to end.

## Live Flow Status

- Incognito end-to-end flow worked: homepage, Magic Studio draw flow, preview, Google auth, save/mint, and email.
- Tooth Fairy Network email delivery was validated.
- MoonPay/card gift on-ramp is not ready; card gifts should remain paused until provider, receipt, fee, refund, and support flows are tested.

## Branch Hygiene

- Treat the locked baseline as the stable launch reference.
- Use named branches for research, design, copy, email, story, and payment experiments.
- Current branch: `codex/tfn-homepage-email-brand-polish`.
- Do not production deploy from an experiment branch unless the user explicitly approves that branch for live review.

## Current Homepage Direction

- Headline: `Turn a lost tooth into your child's first digital wallet.`
- Proof messages now live in the subheading and How it Works flow, not as repeated hero chips.
- Storybook layer: use the v2 first-shelf covers and the `Meet Tanda and the collectors of the Tooth Fairy Network` framing under the ritual steps.
- Magical object: `Toothlight`.
- Logo/mark exploration: use the readable golden Toothlight mark that matches the tooth in the hero image; polish later rather than chasing a new abstract logo.
- Tanda voice: story-native, not corporate CEO language.
- Avoid broad "free" promises in polished copy; use low-friction language such as `Try the memory first`.

## Open Architecture Question

Explore whether the Magic Studio should add a low-friction edit/change step after AI polish. This may reduce friction if the controls are simple, but it should be designed and tested on a separate branch before changing the locked flow.
