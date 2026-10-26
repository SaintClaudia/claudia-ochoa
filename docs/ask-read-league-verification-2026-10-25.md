# October 25, 2026 League verification audit

Read-only audit of the portfolio rankings. No HTML, CSS, ranking, commit, push, or deployment changes were made during this audit.

## Common completed-game cutoff

2026 regular season, completed games dated on or before October 25, 2026, through each listed player’s completed Week 7 game. Preseason and future games are excluded. Jacksonville had its Week 7 bye, so Lawrence’s latest game remains October 18. Goff and Burrow had earlier bye weeks; Penix appeared in five of Atlanta’s seven games. Different games-played counts are therefore compatible with the same date cutoff.

## Reconciliation

Game-by-game completions, attempts, yards, touchdowns, and interceptions were summed. Season passer ratings were independently recalculated from those aggregate totals using the NFL formula, not averaged from game ratings. The resulting values match the current canonical NFL league tables.

| Player | Games with passing stats | Cmp/Att | Yards | Passing TD | INT | Season rating |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Kirk Cousins | 7 | 161/257 | 1,877 | 16 | 5 | 97.4 |
| Jared Goff | 6 | 150/223 | 1,788 | 14 | 0 | 112.5 |
| Brock Purdy | 7 | 146/211 | 1,748 | 15 | 4 | 110.1 |
| Joe Burrow | 6 | 157/219 | 1,653 | 15 | 3 | 110.4 |
| Trevor Lawrence | 6 | 120/184 | 1,480 | 14 | 4 | 106.2 |
| Michael Penix Jr. | 5 | 96/144 | 1,157 | 9 | 1 | 109.1 |

The six-player union covers all five players in each of the two displayed tables. Passing-TD ranks remain Cousins 1, Purdy/Burrow T-2, Goff/Lawrence T-4. The display is five players, not every tied player: Stafford also has 14 and is outside that five-player display. Qualified passer-rating ranks remain Goff, Burrow, Purdy, Penix, Lawrence.

## Official-page discrepancies observed

- Cousins’ dedicated NFL 2026 log stopped at October 18. His NFL summary page includes the completed October 25 Rams game and a 16-TD season total. The Raiders’ final box score independently confirms two passing TDs in that game; his first six games sum to 14.
- Goff’s NFL summary page still showed five games, 12 TDs, and 111.3. His dedicated NFL 2026 log includes the October 25 Green Bay game: 22/32, 303 yards, two TDs, no interceptions. Adding that completed game yields 14 TDs and 112.5. Detroit’s official recap corroborates the latest game. Both canonical NFL leaderboards carry the updated aggregate.
- Consequently, the evidence supports the newer values at the completed-October-25 cutoff, but the public NFL pages are not synchronized. This audit does not claim that a separate authenticated statistical API/feed snapshot was accessed.
- Passer-rating qualification remains 14 attempts per team game. High-rating low-volume passers are excluded; Jackson’s 96 attempts are below Baltimore’s 98-attempt threshold after seven team games.

## Official sources

League tables:
- [Passing TDs](https://www.nfl.com/stats/player-stats/category/passing/2026/reg/all/passingtouchdowns/desc)
- [Passer rating](https://www.nfl.com/stats/player-stats/category/passing/2026/reg/all/passingpasserrating/desc)

Completed-game records:
- [Cousins NFL summary including Week 7](https://www.nfl.com/players/kirk-cousins/stats/)
- [Raiders final Rams-game box score](https://www.raiders.com/game-day/2026/reg-week7/rams-at-raiders/box-score)
- [Goff NFL 2026 log](https://www.nfl.com/players/jared-goff/stats/logs/2026/)
- [Lions final-game recap](https://www.detroitlions.com/news/recap-lions-vs-packers-goff-williams-stbrown-branch)
- [Purdy NFL 2026 log](https://www.nfl.com/players/brock-purdy/stats/logs/2026/)
- [Burrow NFL 2026 log](https://www.nfl.com/players/joe-burrow/stats/logs/2026/)
- [Lawrence NFL 2026 log](https://www.nfl.com/players/trevor-lawrence/stats/logs/2026/)
- [Penix NFL 2026 log](https://www.nfl.com/players/michael-penix-jr/stats/logs/2026/)
- [Jacksonville Week 7 bye](https://www.jaguars.com/schedule/2026/)

Stale public counterparts, retained to document the discrepancy:
- [Cousins dedicated NFL 2026 log](https://www.nfl.com/players/kirk-cousins/stats/logs/2026/)
- [Goff NFL summary](https://www.nfl.com/players/jared-goff/stats/)

## Change status

The existing uncommitted five-row ranking edit remains untouched. This verification adds only this local audit document. Layout and styling are unchanged; nothing was published.
