# B01 USV — Control Console

Ground-control console (Security Center) prototype for **B01 — Autonomous Unmanned Surface Vehicle (USV)**.

B01 is an autonomous surface vehicle concept designed to survey maritime environments, detect underwater objects and near-surface hazards, assess potential risks, and provide explainable, risk-prioritized information to support maritime safety and inspection decisions.

Arabic, right-to-left. One static HTML file. **All data is simulated, and no physical sensor is connected.** The panels that show live-looking readings carry a «محاكاة» (simulation) tag.

**Live site:** https://moalqrnixd20000-design.github.io/mine-gcs-console/ (GitHub Pages, served from `main`).

**Vessel design dossier:** [vessel.html](vessel.html) shows the B01 side-view drawing with 16 numbered parts, matching the SAIF 2026 poster:
- hull-mounted multibeam, side-scan sonar and SVP;
- the EO/IR gimbal, navigation radar with AIS and navigation lights;
- Edge AI (GPU), SSD storage and the network switch;
- hybrid propulsion with a quieter survey mode.

Every part is **proposed** (conceptual design). Pick a part on the drawing or in the list to see what it is, how it is meant to work and why B01 carries it. Protection ratings, capacities, endurance and other specifications are TBD until components are selected and tested. A print copy with every part is in [B01-vessel-design.pdf](B01-vessel-design.pdf).

## Run locally

```bash
python -m http.server 8745 --directory mine-gcs-console
```

Open http://localhost:8745

## Two modes

### المراقبة (Watch)

- **Alert queue.** The queue is risk-prioritized: four cautious levels (high potential hazard, potential hazard, unknown, each requiring verification, then likely non-hazardous), then an evidence score.
  - The score is computed by rules on simulated data. It is not a trained model's confidence.
  - "Unknown" is a class of its own and is never forced into another.
  - Each alert has four evidence glyphs: shape, shadow, sway and anomaly.
  - Every alert is a detected candidate, not a verified hazard.
- **Surface picture.** The centre shows the simulated surface picture: radar, thermal camera, AIS, the geofence, and a two-pass crosshatch grid survey (horizontal Pass A complete, vertical Pass B in progress) with adaptive passes around targets.
  - In the simulation, lines are 25 m apart, assuming a clean water-column swath of about ±14 m. These are simulation assumptions, not sensor specifications. Real blind zones, minimum range and coverage depend on the selected sonar, its installation, water conditions and field validation.
  - Every line runs straight past the area and turns outside it, so turning data is never counted.
- **Beside and below.** The four sensing dimensions of the proposed model (image, location, time, motion) sit beside the surface picture, and the simulated health and cyber strip sits underneath.

### التحقيق (Investigate)

The Handover Package:
- **Evidence.** Seabed and water-column evidence is linked to the reasons, so hovering a reason lights up its region on the sonar image.
- **Contents.** The evidence-score ledger, a sway plot around the anchor point, multi-angle consensus, the location, timestamps, package integrity, the chain of custody and the analyst actions.
- **Encryption.** It is described only as "the latest available encryption version". No algorithm or protocol is named.

The queue, clock and health strip stay live in both modes.

## Design rules

- **Colour.** The night palette is taken from the B01 hull render. Colour appears only where attention is needed: coral marks the suspected object and its evidence, violet marks signatures and encryption, amber marks a caution.
- **Type.** Readex Pro is used for language. B612 Mono, the typeface designed for Airbus cockpit displays, is used for readouts.
- **Corners.** Chamfered panel corners echo the hull's faceted chines.
- **Orientation.** Instruments (map, sonar, charts) keep their physical orientation. Only the reading order is mirrored for RTL.
- **No confirmed mines.** The console never labels anything a confirmed mine or a verified hazard. It hands evidence to the verification team.
