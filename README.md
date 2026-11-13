# B01 Mine Detection Console

Ground-control console (Security Center) for the "Smart System for Naval Mine Detection" USV, hull B01.
Arabic, right-to-left. One static HTML file. **All data is simulated.**

**Live site:** https://moalqrnixd20000-design.github.io/mine-gcs-console/ (GitHub Pages, served from `main`).

**Vessel design dossier:** [vessel.html](vessel.html) has the B01 side-view drawing with 13 numbered parts. Pick a part on the drawing or in the list to see what it is, how it works, why B01 carries it, and its protection rating. A print copy with every part is in [B01-vessel-design.pdf](B01-vessel-design.pdf).

## Run locally

```bash
python -m http.server 8745 --directory mine-gcs-console
```

Open http://localhost:8745

## Two modes

- **المراقبة (Watch).** The alert queue is sorted by model confidence, with four evidence glyphs per alert (shape, shadow, sway, anomaly). The centre shows the fused surface picture: radar, thermal camera, AIS, the geofence, and a two-pass crosshatch grid survey (horizontal Pass A complete, vertical Pass B in progress) with adaptive passes around targets. Lines are 25 m apart because the clean water-column swath is only about ±14 m; beyond it the seabed's side-lobe echo is a dead zone. Every line runs straight past the area and turns outside it, so turning data is never counted. The four sensing dimensions from the deck (image, location, time, motion) sit beside it, and the health and cyber strip sits underneath.
- **التحقيق (Investigate).** The Handover Package. Seabed and water-column evidence is linked to the reasons, so hovering a reason lights up its region on the sonar image. It also holds the confidence ledger, a sway plot around the anchor point, multi-angle consensus, the pinpoint location, timestamps, package integrity, the chain of custody, and the analyst actions. Encryption is described only as "the latest available encryption version"; no algorithm or protocol is named.

The queue, clock and health strip stay live in both modes.

## Design rules

- Night palette taken from the B01 hull render. Colour appears only where attention is needed: coral marks the suspected object and its evidence, violet marks signatures and encryption, amber marks a caution.
- Readex Pro is used for language. B612 Mono, the typeface designed for Airbus cockpit displays, is used for live readouts.
- Chamfered panel corners echo the hull's faceted chines.
- Instruments (map, sonar, charts) keep their physical orientation. Only the reading order is mirrored for RTL.
- The console never labels anything a confirmed mine. It hands evidence to the verification team.
