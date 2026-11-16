# Personal Resume Website (Hugo)

[![Live](https://img.shields.io/badge/-Live%20%E2%86%97-0d9488?style=flat-square)](https://ixchelone.dev/)
[![Build](https://img.shields.io/github/actions/workflow/status/ixchelone/resume/hugo.yaml?branch=main&label=Build&style=flat-square)](https://github.com/ixchelone/resume/actions/workflows/hugo.yaml)
[![Hugo](https://img.shields.io/badge/Hugo-e03582?style=flat-square&logo=hugo&logoColor=white)](https://gohugo.io/)
[![Theme](https://img.shields.io/badge/-Resume%20Theme-6f42c1?style=flat-square)](https://github.com/eddiewebb/hugo-resume)
[![Cloudflare Pages](https://img.shields.io/badge/-Cloudflare%20Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Cloudflare Worker](https://img.shields.io/badge/-Cloudflare%20Worker-1f2937?style=flat-square&logo=cloudflare&logoColor=F38020)](https://developers.cloudflare.com/pages/functions/advanced-mode/)
[![Credentials](https://img.shields.io/badge/-%F0%9F%93%84%20Credentials-86198f?style=flat-square)](https://github.com/ixchelone/resume/releases/tag/credentials)
[![MIT](https://img.shields.io/static/v1?label=&message=MIT&color=0066cc&style=flat-square&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![CC BY-NC-ND 4.0](https://img.shields.io/static/v1?label=&message=CC%20BY-NC-ND%204.0&color=555555&style=flat-square&logo=creativecommons&logoColor=white)](LICENSE-CC)

Static résumé site with selected work, skills, and certifications; PDFs render inline in the browser.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Theming & Assets](#theming--assets)
  - [Theme (submodule) & safe customization](#theme-submodule--safe-customization)
  - [Navbar brand icon (profileImage)](#navbar-brand-icon-profileimage)
  - [CSS (self-hosted)](#css-self-hosted)
  - [Fonts (self-hosted; third-party)](#fonts-self-hosted-third-party)
  - [JavaScript (self-hosted)](#javascript-self-hosted)
  - [Icons & Favicons](#icons--favicons)
- [Local Dev](#local-dev)
- [Build & Deploy](#build--deploy)
  - [Production Domain & DNS](#production-domain--dns)
- [PDF Hosting](#pdf-hosting)
- [Data & Content Structure](#data--content-structure)
- [Commit Conventions](#commit-conventions)
- [License](#license)
  - [Code](#code)
  - [Content](#content)
  - [Third-Party Components](#third-party-components)

## Features

- Clean, minimal site built with **Hugo**
- Deployed on **Cloudflare Pages**
- PDFs via **GitHub Releases**, proxied inline by a **Cloudflare Pages Worker**
- **Hugo Resume** theme with custom tweaks
- Config-driven **navbar brand icon** (SVG by default) with intrinsic width/height, cumulative layout shift (CLS)–safe, and accessible labels from `params.brandName` (fallback `.Site.Title`) — see [Navbar brand icon](#navbar-brand-icon-profileimage)

- **Self-hosted assets (no external CSS/JS CDNs)**
  - **CSS:** all styles live in `assets/css/`, built via Hugo and served from this site
  - **Fonts:** Open Sans, Saira in `static/fonts/`, declared via `assets/css/fonts.css` (`@font-face`)
  - **JS:** vendor + site scripts from `static/js/` (incl. `static/js/vendor/`)

- **Hugo Pipes optimization**
  - Single bundled stylesheet (minified) with **fingerprinting** for cache-busting
    *(generated as `public/css/app.min.<hash>.css`, served at `/css/app.min.<hash>.css`)*

## Technologies Used

- [Hugo](https://gohugo.io/) — static site generator (Extended; version pinned in [CI](.github/workflows/hugo.yaml))
- [Hugo Resume by Eddie Webb](https://github.com/eddiewebb/hugo-resume) — theme (as a git submodule)
- [Cloudflare Pages](https://www.cloudflare.com/products/pages/) — hosting and deployment
- [Cloudflare Worker — Pages Function, Advanced Mode](https://developers.cloudflare.com/pages/functions/advanced-mode/) - PDF proxy and static asset routing
- [GitHub Actions](https://github.com/features/actions) — automated Hugo build and deployment
- [GitHub Releases](https://github.com/ixchelone/resume/releases/tag/credentials) — PDF asset storage
- Fonts: [Open Sans](https://fonts.google.com/specimen/Open+Sans), [Saira](https://fonts.google.com/specimen/Saira)

## Theming & Assets

### Theme (submodule) & safe customization

- Upstream theme lives in `themes/resume/` (git submodule). Don’t edit it directly.
- Override via local templates:
  - Layouts: `layouts/_default/`, `layouts/partials/`
  - Shortcodes: `layouts/shortcodes/` (e.g., `credentials.html`, `education.html`, `employment.html`, `languages.html`, `skills.html`)

### Navbar brand icon (`profileImage`)

- Config-driven and CLS-safe (intrinsic `width`/`height` in HTML; defaults to 32×32 if unset).
- **Default:** `static/images/profileImage.svg`
- **Labels:** desktop `alt` and mobile label use `params.brandName` (fallback `.Site.Title`) set in [`config.toml`](./config.toml).
- **Failsafe:** `object-fit: contain; object-position: center`.
- **Config example:**

  ```toml
  [params]
    brandName = "Ilona Ixchel Loučka"
    profileImage = "images/inguz.png"
    profileImageWidth = 32
    profileImageHeight = 32
  ```

### CSS (self-hosted)

- Site styles in `assets/css/`:
- `fonts.css` → `@font-face` declarations for local fonts
- `resume-override.css`, `tweaks.css` → your safe override layers (don’t patch the theme files)
  - Vendor CSS in `assets/css/vendor/`
- Built via **Hugo Pipes** into a single, minified, fingerprinted bundle (see [**Features**](#features)).

### Fonts (self-hosted; third-party)

- Directories: `static/fonts/OpenSans/`, `static/fonts/Saira/`
- Referenced from `assets/css/fonts.css` via `@font-face`
- Licensing: **SIL OFL 1.1** — see **[NOTICE](./NOTICE)**

### JavaScript (self-hosted)

- Site scripts in `static/js/`; vendor scripts in `static/js/vendor/`
- No external JS CDNs (served locally).

### Icons & Favicons

- Favicons & manifests: `static/icons/` (`favicon.ico`, `site.webmanifest`, etc.)
- Template tags for icons live in `layouts/partials/favicon.html` — update filenames there if you replace assets.

## Local Dev

Prereqs: Hugo **Extended**; init theme submodule once (after cloning):

  ```bash
  git submodule update --init --recursive
  ```

Run:

  ```bash
  hugo server -D --disableFastRender
  ```

Open: [http://localhost:1313/](http://localhost:1313/)

## Build & Deploy

Deployed via **Cloudflare Pages** (project `ixchelone`) using [GitHub Actions](.github/workflows/hugo.yaml) and the Cloudflare Wrangler CLI.

The production deployment has been successfully verified, including the Hugo site, static assets, custom domain, HTTPS, and PDF delivery through the Pages Worker.

- **Build (local):**

  ```bash
  hugo --gc --minify --cleanDestinationDir
  cp cloudflare/_worker.js public/_worker.js
  ```

- **CI/CD flow:**

  - **Trigger:** Push to `main` when relevant site or deployment files change, or manual workflow dispatch.
  - **Build:** Install Hugo Extended (version pinned to `0.141.0`), checkout the repository including recursive Git submodules, and build the website into `public/`.
  - **Worker integration:** Copy the tracked `cloudflare/_worker.js` into the root of the generated `public/` directory.
  - **Deploy:** Upload the complete `public/` directory to the Cloudflare Pages project `ixchelone` using `cloudflare/wrangler-action@v4`.

- **Change detection:** The workflow runs only when relevant files change (`assets/`, `archetypes/`, `content/`, `data/`, `i18n/`, `layouts/`, `static/`, `themes/`, `config.toml`, `cloudflare/_worker.js`, or `.github/workflows/`), or when manually dispatched.

- **Hugo installation & version pinning:** CI uses `peaceiris/actions-hugo@v2` with Hugo Extended version pinned through the `HUGO_VERSION` environment variable.

- **Cache:** Restores and saves the Hugo cache (`HUGO_CACHEDIR`) between builds to speed up subsequent builds.

  Cache key: `${{ runner.os }}-hugo-${{ env.HUGO_VERSION }}-${{ hashFiles('config.toml') }}`.

- **Deployment authentication:** Wrangler authenticates using the GitHub Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The GitHub token allows the Wrangler Action to create a GitHub Deployment record. It is provided through `secrets.GITHUB_TOKEN` with the `deployments: write` permission.

- **Generated output:** Hugo generates the website in `public/`. The Worker is copied into this directory during CI. The generated `public/` directory remains excluded from Git version control.

- **Concurrency:** `concurrency: { group: cloudflare-pages, cancel-in-progress: true }` prevents overlapping production deployments.

- **Traceability:** The site footer shows the commit used to generate the page and links to the corresponding GitHub commit.

  Ensure `enableGitInfo = true` in [`config.toml`](./config.toml) and `fetch-depth: 0` in `actions/checkout` so Git metadata is available.

### Production Domain & DNS

- **Canonical domain:** [https://ixchelone.dev/](https://ixchelone.dev/)
- **Alternative hostname:** [https://www.ixchelone.dev/](https://www.ixchelone.dev/)
- **Canonical redirect:** All requests to the `www` hostname are permanently redirected to the apex domain using a Cloudflare Single Redirect (HTTP 301).
- **Redirect behavior:** Original URL paths and query strings are preserved. Both HTTP and HTTPS requests are redirected to HTTPS.
- **Domain registrar:** Porkbun.
- **DNS provider:** Cloudflare.
- **DNS delegation:** The domain uses Cloudflare nameservers.
- **Hosting:** Cloudflare Pages project `ixchelone`.
- **HTTPS:** Enabled through Cloudflare SSL/TLS for both hostnames.

## PDF Hosting

PDF documents (certificates, certifications, courses, and the résumé) are stored as **GitHub Release assets** in the `credentials` release of [`ixchelone/resume`](https://github.com/ixchelone/resume/releases/tag/credentials).

They are served inline through a **Cloudflare Pages Worker**, using the same domain as the Hugo portfolio.

- **Source repository:** [`ixchelone/resume`](https://github.com/ixchelone/resume)
- **Release:** [`credentials`](https://github.com/ixchelone/resume/releases/tag/credentials)
- **Worker source:** [`cloudflare/_worker.js`](./cloudflare/_worker.js)
- **Hosting:** Cloudflare Pages project `ixchelone`, with `ixchelone.dev` as the canonical production domain.

### Public URLs

**Preferred short URLs:**
`https://ixchelone.dev/<filename>.pdf`

**Backward-compatible URLs:**
`https://ixchelone.dev/docs/credentials/<type>/<filename>.pdf`

The `<type>` segment can be `certifications`, `certificates`, or `courses`.

The default Cloudflare Pages domain remains available for deployment diagnostics and direct testing:
`https://ixchelone.pages.dev/<filename>.pdf`

The canonical production domain is `https://ixchelone.dev/`.

### Request handling

The Worker handles PDF requests by fetching the matching asset from the GitHub Release.
All other requests are forwarded to Cloudflare Pages static assets through `env.ASSETS.fetch(request)`, allowing the same Pages project to serve the Hugo website.

The Worker sets the following response headers for PDF files:

- `Content-Disposition: inline` — display the PDF in the browser.
- `Content-Type: application/pdf`.
- `Cache-Control: public, max-age=3600` — allow browser caching for approximately one hour.

The PDF endpoint supports HTTP byte-range requests, allowing clients to retrieve partial content instead of downloading the entire document.

Partial content delivery has been verified in production using HTTP `Range` requests and `206 Partial Content` responses, with the expected `Content-Range` and `Content-Length` headers.

### Cache behavior

- **Worker response:** PDF responses include `Cache-Control: public, max-age=3600`, allowing browser caching for one hour.
- **Cloudflare Browser Cache TTL:** The zone-level setting is configured as `Respect Existing Headers`, ensuring that Cloudflare respects the cache policy defined by the Worker instead of overriding it with a fixed browser TTL.
- **Production verification:** Confirmed that production PDF responses return `Cache-Control: public, max-age=3600`.
- **Implementation:** No additional Range-specific Worker code or deployment changes were required.

### Why a Worker?

The Worker provides stable, short PDF URLs under the portfolio's own domain, independently of GitHub's Release download URLs.
GitHub Releases remain the central storage location for all PDF assets.
Uploading or replacing a GitHub Release asset without changing its filename or the corresponding JSON entry does not require a Hugo rebuild.
Adding a new credential to the portfolio requires updating the appropriate `data/*.json` file and deploying a new Hugo build.
See [`cloudflare/README.md`](./cloudflare/README.md) for deployment details, routing, response headers, caching, and instructions on adding new PDF assets.

## Data & Content Structure

Credential and course data lives in `data/` as JSON files:

- `data/certifications.json` — professional certifications.
- `data/certificates.json` — certificates and completed programs.
- `data/courses.json` — courses and other training.
Each entry contains structured information displayed by the corresponding Hugo shortcodes and partials.

### Minimal data model

Example entry in `data/certificates.json`:

```json
{
  "title": "CyberEdu NIS2 Academy",
  "subtitle": "MoyaKybeon Cybersecurity Manager",
  "issuer": "Netia s.r.o.",
  "url": "https://ixchelone.dev/cyberedu-nis2-academy.pdf",
  "date": "2025-03-07"
}
```

### Data conventions

- **Filenames:** Use unique, lowercase kebab-case filenames with the `.pdf` extension (e.g., `prince2-agile-practitioner.pdf`).
- **GitHub Release assets:** Upload PDF files as individual assets to the `credentials` release in [`ixchelone/resume`](https://github.com/ixchelone/resume/releases/tag/credentials).
- **Asset filenames:** The PDF filename referenced in the JSON `url` must exactly match the corresponding GitHub Release asset name.
- **URL mapping:** The canonical short URL is `https://ixchelone.dev/<filename>.pdf`. The filename must match the Release asset exactly.
- **Backward-compatible URLs:** The Worker also supports `/docs/credentials/<type>/<filename>.pdf`, where `<type>` is `certificates`, `certifications`, or `courses`.
- **Asset organization:** GitHub Release assets are stored as individual files without subdirectories. The `<type>` segment is used for URL organization only.
- **JSON URLs:** Always reference the canonical portfolio domain (`https://ixchelone.dev/`), not the direct GitHub Release download URL. Use the temporary Pages domain (`https://ixchelone.pages.dev/`) for deployment diagnostics and direct testing only; production data must always reference the canonical domain.
- **Dates:** Use ISO 8601 format (`YYYY-MM-DD`) for dates.
- **Optional metadata:** Additional fields such as `id`, `expires`, `notes`, and `subtitle` can be used where applicable.
- **Rendering:** Credential entries are read from `data/*.json` and displayed through the corresponding Hugo shortcodes and partials.

## Commit Conventions

- Follow [Conventional Commits](https://www.conventionalcommits.org/) style.
- Use a **type** and a **scope** in round brackets (e.g., `feat(credentials)`).
- Scope = logical area of change (e.g., `credentials`, `styles`, `config`).
- Do **not** use filenames or file paths in scope.
- **Title line**: short, concise, must fit on one line (no wrapping).
- **Commit body**: optional; when used, written in bullet-point format.
- A commit message template is provided in [`.gitmessage.txt`](./.gitmessage.txt).
  - To enable it, run:

    ```bash
    git config commit.template .gitmessage.txt
    ```

  - After setup, simply run `git commit` (without `-m`) and the template will preload in your editor.

## License

*Dual-license: MIT (code) + CC BY-NC-ND 4.0 (content).*   
Please refer to each license file for the full terms.

### Code

- **Source code, scripts, and configuration files** are licensed under the [MIT License](./LICENSE).  
- **Includes (non-exhaustive):** [`config.toml`](./config.toml), `.github/`, `.vscode/`, `assets/` (CSS/JS), `layouts/`, `static/js/`, `cloudflare/`, and other build/config files.  
- **Excludes:** submodules (e.g., `themes/resume/`), generated output such as `public/` and `resources/_gen/`.

### Content

- **Original content:** Original written content and materials created for this project are licensed under [CC BY-NC-ND 4.0](./LICENSE-CC).
- **Includes (non-exhaustive):** Original texts in `content/`, original portfolio descriptions and data entries in `data/`, and original visual assets in `static/images/` and `static/icons/`.
- **Third-party documents:** Certificates, credentials, and other documents issued by third parties and hosted in GitHub Releases are provided for verification purposes only. They are **not covered by this project's CC BY-NC-ND 4.0 license** and remain subject to the applicable rights and terms of their respective issuers and other rights holders.

### Third-Party Components

This project uses third-party components that are subject to their own licenses. For details on those components (e.g., fonts, Hugo Resume theme) and a full breakdown of licensing scopes, see the [NOTICE](./NOTICE) file.
