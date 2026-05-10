# TFN V2 Product Truth

## Core Framing

Tooth Fairy Network is a child's first digital piggy bank, disguised as a magical family ritual.

The product should stay radically simple:

1. A child loses a tooth.
2. The family saves the memory.
3. Loved ones add small gifts.
4. The child grows into their first owned digital asset.

Everything else exists to make that simple product clearer, more trusted, and more emotionally valuable.

## What The Product Actually Is

The keepsake page is the atomic product:

- the tooth memory;
- the child's image/art;
- the note or story;
- the minted asset;
- the share link;
- the contribution path.

The Smile Fund is the collection layer:

- all keepsakes;
- all gifts;
- all memories;
- parent controls;
- unlock milestone;
- the child's first visible ownership timeline.

The tooth is the first wedge. Later milestones can expand the same model:

- first bike ride;
- first swim;
- first goal;
- first recital;
- first big responsibility moment;
- any childhood milestone where memory + story + small contribution makes sense.

## Strongest Parent-Facing Promise

Your child starts with something they made.

They can point to it and say:

> This is mine.

Then the parent can slowly teach:

- what ownership means;
- why small things can grow;
- why responsibility matters;
- how loved ones can support a child's future;
- why digital assets can be personal before they are financial.

## Main Vulnerabilities

### 1. Feature, Not Business

The critique is valid if TFN is only "mint a tooth NFT."

The business becomes more defensible if TFN is the first product in a broader childhood ownership timeline.

### 2. Too Much Crypto Language

Parents should not be asked to buy "NFT + escrow + Solana + onramp + story universe."

They should understand:

- save the memory;
- share with loved ones;
- start a digital piggy bank;
- parent stays in control.

The blockchain is the rail, not the headline.

### 3. "Savings Grow" Can Overpromise

Do not imply yield, returns, or investment performance unless that exists.

Preferred language:

- "family gifts add up";
- "small gifts become a first lesson in ownership";
- "a digital piggy bank";
- "a first asset they can grow into."

Avoid default language like:

- "hedge against inflation";
- "investment account";
- "make their money grow";
- "future returns."

### 4. Age 10 vs Age 18

Default framing:

- age 10 is the suggested learning milestone;
- parent can choose a later unlock;
- product should not depend on one universal age.

### 5. Story Universe Can Overwhelm The Product

Tanda and global tooth traditions should clarify the product, not compete with it.

The story layer should show children taking responsibility, overcoming small conflicts, preserving a memory, and growing into ownership.

The lost tooth ritual can be the closing ritual, not always the entire plot.

## Homepage Implication

The homepage should not explain every feature. It should make the product feel obvious:

> A lost tooth becomes a memory, a share link, and a first digital piggy bank.

The best V1 animation is a small product metaphor, not a large cinematic:

- a tiny fairy carries a coin;
- the coin drops into a digital piggy bank;
- the bank glows;
- the loop quietly reinforces "small gifts become ownership."

The product pages should carry the deeper proof:

- actual on-chain keepsake;
- actual story;
- actual contribution record;
- actual Smile Fund state;
- actual parent controls.

## Next Execution Sequence

1. Mint five real test examples.
2. Capture the real data for each:
   - child alias;
   - image/art URL;
   - story/note;
   - mint/asset address;
   - metadata URI;
   - milestone PDA;
   - keepsake URL;
   - contribution URL;
   - current deposits/balance.
3. Rebuild the keepsake page around real examples.
4. Rebuild Smile Fund as the collection/dashboard view.
5. Revisit homepage copy after the product pages are real.
6. Deploy to Vercel preview.
7. Run `/api/toothfairy/health`.
8. Test one controlled mint and one contribution.
9. Move production domain only after the preview path works.

## On-Chain Asset Pulling Reality

Codex can help pull real assets from the chain if it has:

- the asset/mint addresses or milestone PDAs;
- a working Solana RPC;
- any required API keys;
- the metadata URI structure.

The image is usually not "inside" the blockchain directly. The on-chain asset points to metadata, and the metadata points to image/story storage such as Arweave or another durable URL.

## Design Direction

Make the product simpler, not bigger.

Good V1:

- child-safe;
- parent-clear;
- emotionally warm;
- honest about what is live;
- powered by real minted examples;
- visually polished enough for testing;
- technically gated before production.

Bad V1:

- too much lore above the product;
- fake finance language;
- fake card contribution rail;
- mockups pretending to be live assets;
- homepage explaining what the real product page should prove.
