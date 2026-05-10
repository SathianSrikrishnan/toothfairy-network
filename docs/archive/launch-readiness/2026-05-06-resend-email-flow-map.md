# Resend Email Flow Map

Launch goal: parent emails should feel like calm receipts and recovery anchors, not marketing blasts. Every send should be safe to retry, tied to a parent email, and deduped by a durable event key before broad release.

| Flow | Trigger | Route or sender | Recipient | Template | Current status | Idempotency key |
| --- | --- | --- | --- | --- | --- | --- |
| Welcome | Google auth callback completes | `/api/auth/google/callback` and `/api/auth/callback` call `/api/toothfairy/welcome-email` | Parent email from the Google session | `renderWelcomeEmail` | Implemented, but can send again on repeat sign-in | `welcome:{parentEmail}:{yyyy-mm-dd}` or a durable `welcome_sent_at` user field |
| Memory created | Tooth memory is saved | `/api/toothfairy/mint` | Parent email from the authenticated session | `renderMemoryCreatedEmail` | Implemented after mint response data exists | `memory_created:{milestonePda}` |
| Gift receipt | Wallet gift transaction is verified server-side | `/api/toothfairy/gift-receipt` | Parent email resolved from the child profile guardian record | `renderGiftReceivedEmail` | Implemented after transaction and deposit account verification | `gift_receipt:{txSignature}` |
| Card gift receipt | MoonPay card checkout completes and the server verifies provider status | Planned MoonPay webhook or verified return route, then the same receipt sender | Parent email resolved from the child profile guardian record, with optional giver email if collected | `renderGiftReceivedEmail` or a card-specific receipt wrapper | Paused until MoonPay provider details, webhook signing, fee disclosure, and terms are final | `card_gift_receipt:{providerPaymentId}` |
| Legacy deposit email | Internal deposit notification fallback | `/api/toothfairy/deposit-email` | Parent email supplied by the internal caller | `renderGiftReceivedEmail` | Guarded admin route; keep as internal fallback until gift receipt path fully replaces it | `legacy_deposit:{milestonePda}:{txSignature}` when a signature exists |
| Drip or lifecycle email | Future parent education sequence | `/api/toothfairy/drip-email` | Parent email from subscription or account data | Existing drip renderer | Not launch-critical; keep paused until consent and unsubscribe mapping are final | `drip:{campaign}:{parentEmail}:{step}` |

## Durable Dedupe Plan

Create a small email events table before enabling broader Resend volume:

`tfn_email_events`

| Column | Purpose |
| --- | --- |
| `id` | Generated primary key |
| `event_key` | Unique idempotency key, for example `memory_created:{milestonePda}` |
| `flow` | `welcome`, `memory_created`, `gift_receipt`, `card_gift_receipt`, `legacy_deposit`, or `drip` |
| `recipient_email` | Normalized parent email |
| `resource_id` | `milestonePda`, `txSignature`, `providerPaymentId`, or campaign step id |
| `resend_message_id` | Returned by Resend after a successful send |
| `status` | `pending`, `sent`, `skipped`, or `failed` |
| `error` | Last send error, if any |
| `created_at` | Insert time |
| `sent_at` | Send completion time |

Implementation order:

1. Add the table with a unique index on `event_key`.
2. Wrap each send in an insert-first helper: insert `pending`, send through Resend only if the insert wins, then update to `sent` with `resend_message_id`.
3. If the insert conflicts, return `success: true, skipped: true, reason: "duplicate_email_event"` so retries are harmless.
4. Keep `RESEND_API_KEY` checks before the helper records a send attempt. Missing configuration should skip cleanly in preview or local environments.
5. Add route-level tests for duplicate welcome, memory-created, and gift-receipt attempts once the table exists.

Open launch note: welcome email frequency needs a product decision. A once-per-day key avoids accidental repeats during testing; a permanent `welcome_sent_at` field avoids repeat welcomes entirely.

## MoonPay Card Gift Readiness

Keep card gifts paused in the UI until these items are known and tested:

1. Provider payment id field name for the unique idempotency key.
2. Webhook event names for paid, failed, refunded, and chargeback states.
3. Webhook signature verification method and secret environment variable name.
4. Exact net amount, fee, and currency fields that should appear in the parent receipt.
5. Whether MoonPay returns the giver email, parent email, both, or neither.
6. Required disclosure text for card fees, refunds, custody, and support.

Launch behavior for card gifts:

1. Create payment intent or checkout session only after the memory exists.
2. On webhook, verify signature and provider status before creating or marking the gift.
3. Insert `card_gift_receipt:{providerPaymentId}` into `tfn_email_events` before sending.
4. Send the parent receipt only after the durable gift record exists.
5. If the webhook retries, return a duplicate skip rather than sending another receipt.
