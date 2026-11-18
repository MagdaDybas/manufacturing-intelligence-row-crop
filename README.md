# Manufacturing Intelligence — Row Crop prototype

High-fidelity **clickable** HTML prototype for Bayer Manufacturing Intelligence (Row Crop only).

**Status:** Working IA hypothesis, updated from **PEY Power BI**. Sample / fictional data only (KPI numbers placeholder).

## Run locally

```bash
cd local/manufacturing-intelligence
python3 -m http.server 5180
```

Open [http://localhost:5180/](http://localhost:5180/).

## Navigation (PEY-aligned)

| Primary | Content |
| --- | --- |
| Overview | Seeds Production KPIs strip 01–06; Quality overview-only |
| Process Dashboards | Receiving, Shelling, Sizing, Packaging, Bag Printing Line |
| Reports (C&P) | Drying & Shelling, Sizing, Packaging only |
| APL Tracking | Automated Planting Line — 6 Power BI pages |
| My Dashboards / AI Assistant | Personal + assistant patterns |

### Locked PEY rules
- **APL** = Automated Planting Line (sibling to Seeds Production)
- Drying → mainly **Drying & Shelling C&P** (no standalone Drying KPI page)
- Quality → CS Produced, DTS 1, DTS1 % on overview only
- Bag Printing Line → KPI only
- **Campaign** filter is first-class (e.g. C2026V)
- **Adaptive filters** — bar swaps fields per dashboard (PEY Power BI sets); Date range on all except Receiving & Shelling KPIs; C&P has 7 fields (+ Status on Packaging C&P)
- **Site profile** — v1 locked to PEY; other sites may need different dashboards/reports/filters (hypothesis to validate)

### Filters by view (PEY)
| View | Filters |
| --- | --- |
| Overview KPIs | Campaign, Date range |
| Receiving KPIs | Campaign, Date/Week, Receiving Lane |
| Shelling KPIs | Campaign, Actual Start Time Local, Blend |
| Sizing / Packaging KPIs | Campaign, Date range, Process Order, Variety, Batch |
| Bag Printing Line | Campaign, Date range, Order Variety, Order |
| C&P (Drying&Shelling, Sizing) | Campaign, Date range, Process Order, Variety, Batch, Material #, Resources, Equipment |
| Packaging C&P | Same as C&P + Status |
| APL / My / AI (until confirmed) | Campaign, Date range |

## Files

- `index.html` — shell
- `styles.css` — layout & visual language
- `app.js` — routing, views, interactions
