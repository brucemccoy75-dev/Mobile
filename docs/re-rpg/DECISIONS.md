# Re-RPG — Design Decisions Log

Decisions made in planning session 1. Each entry: decision, rationale, implications.

| # | Topic | Decision |
|---|---|---|
| 1 | Healing | HP is a run resource. No healing after fights. In-fight healing is rare and costly (long cooldown-equivalent via deck rarity, turn cost, downsides). Shrine = one clean full heal per screen. Boss kill = full heal. HP drain is the primary death driver. |
| 2 | Skill limiter | **Dealt hand, not cooldowns.** Known skills form a deck shuffled per encounter. Round 1 deals 1, round 2 deals 2nd, round 3 deals 3rd. Hand cap 3. When full, each new deal discards the oldest card in hand. Played skills go to a discard pile; reshuffle when the deck is empty. Attack and Defend are always-available basics outside the hand. Future: stamina meter for multi-play turns. |
| 3 | Enemy intent | Exact intent shown for the current round (icon + number) plus a posture tell for the following round. Two-step lookahead. |
| 4 | Rewards | Kill: pick 1 of 2 (item or tome), skip allowed, gold on top. Chest and boss: pick 1 of 3. |
| 5 | Set roll | Rolled set defines this run's set-tome pool only. Start with Attack, Defend, empty deck, no gear. Anything currently held is removed from the run's drop pool (no duplicate drops). |
| 6 | Heirloom | From death 2 onward, each run starts with one random discovered item or tome for the class, weighted toward the rolled set. Slot growth is a later knob. |
| 7 | POC scope out | Multi-enemy fights, fleeing, fog of war, inventory. All out. |
| 8 | Persistence | Firebase. Anonymous auth on first launch, link Google account later. Firestore: one document per player (MetaState + current RunState). Local-first with a sync adapter; game code only sees a `SaveStore` interface. |
| 9 | Deck cap | 6 known skills. Tomes beyond the cap force a binding swap or skip. Cap becomes an item/set stat later. If long fights stale, first lever is dealing 2 cards per round after round 5. |
| 10 | Repo | Re-RPG gets its own new repository. This repo (map3d) is unrelated. |

## Knock-on changes

- **Defend is a basic action**, so the Warrior Tank set replaces it. Draft: Shield Bash (small damage + Guard) alongside Bind Wound.
- Healing skills carry a tax to honour decision 1: Bind Wound heals small and ends the turn; Mend heals more but applies Weak to the caster for 1 turn.
- Early runs drain the tome pool after two tomes (decision 5), so offers fall back to equipment and gold. That is intentional pressure toward discovery.
- Simulator primary metric: HP remaining on arrival at Boss 1, and % of runs that arrive at all, bucketed by number of discovered entries.
