# husnaedi.is

Static site (HTML, CSS, JS). Hosted on Vercel from GitHub; every push to `main` redeploys.

## Rates and inflation update automatically

`data/rates.json` holds the numbers shown in the key figures and used as calculator defaults.
The front page reads this file when it loads.

The GitHub Action `.github/workflows/update-rates.yml` runs every day at 09:40 (UTC, same as Iceland) and also on demand (Actions → "Uppfæra vexti og verðbólgu" → Run workflow).

| Number | Source | How |
|---|---|---|
| Stýrivextir (meginvextir) | Seðlabanki Íslands, front page | Automatic |
| Verðbólga, 12 months | Hagstofa Íslands, table VIS01000 (Seðlabanki as fallback) | Automatic |
| Íbúðaverð and leiguverð (chart and key figures) | HMS monthly index announcements | Automatic, saved in `data/housing.json` |
| Mortgage rates in the calculator | Aurbjörg rate table, median of Landsbankinn, Íslandsbanki and Arion banki | Automatic |

New HMS months are added using the monthly change HMS publishes, and checked against the 12 month change HMS publishes. If they don't match, the month is skipped and you get a notice.

If a number changed, the Action commits the new `data/rates.json` and Vercel redeploys.
If something needs attention (a source didn't respond, or the mortgage rates are older than 45 days or older than the latest policy rate change), the Action opens a GitHub issue named **"Tölur á husnaedi.is þarf að athuga"**. GitHub emails the repo owner. The issue closes itself when everything is fine again. If a source fails, the site keeps showing the last known value.

### Updating the mortgage rates (manual)

Edit `mortgage` in `data/rates.json`, for example:

```json
"mortgage": { "nominal": 9.25, "indexed": 4.35, "updated": "2026-11-20", "source": "Vaxtatöflur Landsbankans, Íslandsbanka og Arion banka" }
```

While `source` is `"áætlun"`, the calculator shows a yellow dot next to the rates.

### Testing the updater without network

```
node scripts/update-rates.mjs --fixtures scripts/fixtures --dry
```

The fixtures contain made up test numbers, not real data.

## One-time setup on GitHub

Repository → Settings → Actions → General → Workflow permissions: choose **Read and write permissions**.
