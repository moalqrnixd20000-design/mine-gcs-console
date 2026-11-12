# B01 Mine Detection Console

Ground-control console (Security Center) for the "Smart System for Naval Mine Detection" USV, hull B01.
Arabic, right-to-left. One static HTML file. **All data is simulated.**

## Run

```bash
python -m http.server 8745 --directory mine-gcs-console
```

Open http://localhost:8745

## Two modes

- **المراقبة (Watch).** The alert queue is sorted by model confidence, with four evidence glyphs per alert (shape, shadow, sway, anomaly). The centre shows the fused surface picture: radar, thermal camera, AIS, the geofence, and survey lines with adaptive cross-passes. The four sensing dimensions from the deck (image, location, time, motion) sit beside it, and the health and cyber strip sits underneath.
- **التحقيق (Investigate).** The Handover Package. Seabed and water-column evidence is linked to the reasons, so hovering a reason lights up its region on the sonar image. It also holds the confidence ledger, a sway plot around the anchor point, multi-angle consensus, the pinpoint location, timestamps, the Ed25519 signature, the chain of custody, and the analyst actions.

The queue, clock and health strip stay live in both modes.

## Design rules

- Night palette taken from the B01 hull render. Colour appears only where attention is needed: coral marks the suspected object and its evidence, violet marks signatures and encryption, amber marks a caution.
- Readex Pro is used for language. B612 Mono, the typeface designed for Airbus cockpit displays, is used for live readouts.
- Chamfered panel corners echo the hull's faceted chines.
- Instruments (map, sonar, charts) keep their physical orientation. Only the reading order is mirrored for RTL.
- The console never labels anything a confirmed mine. It hands evidence to the verification team.
