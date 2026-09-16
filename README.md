# Postman + Newman API Automation POC

Postman collection with a Newman run. Environment variables, assertions and negative cases, running in CI.

Target: authenticated [Toolshop API](https://api.practicesoftwaretesting.com/api/documentation) — register, login, Bearer token, cart journey.

## Prerequisites

- Node.js 18+
- npm

## Setup

```powershell
npm install
```

## Run locally

```powershell
npm test
```

Optional override:

```powershell
$env:API_BASE_URL="https://api.practicesoftwaretesting.com"
npm test
```

## Reports

| Output | Path |
|---|---|
| Newman HTML (htmlextra) | `reports/newman-report.html` |

Open after a run:

```powershell
start reports\newman-report.html
```

## Collection layout

| Folder | What it covers |
|---|---|
| **Auth Setup** | `POST /users/register` (unique user) → `POST /users/login` → saves `access_token` |
| **Authenticated Positive** | `GET /users/me`, catalog, create cart, add item, read cart, delete cart |
| **Negative Tests** | No token (401), bad password (401/422), unknown cart (404) |
| **Data Validation** | Product field types, response time SLA |

## Environment variables

Defined in `Environment/Toolshop_Environment.postman_environment.json`:

| Variable | Set by |
|---|---|
| `base_url` | Environment file (default Toolshop API) |
| `email` / `password` | Register pre-request script |
| `access_token` | Login test script |
| `product_id` | Catalog test script |
| `cart_id` | Create cart test script |

## CI

GitHub Actions runs `npm test` (Newman) on push/PR and uploads `reports/` as the `newman-report` artifact.

The live Toolshop API is used in CI (no Cloudflare on the API host).

## Layout

```
Collection/     Postman collection (exportable back to Postman)
Environment/  Postman environment
scripts/      Newman runner
reports/        Generated HTML (gitignored)
```
