
# Cloudflare Pages Worker (PDF Proxy)

Serves **GitHub Release** PDF assets inline under the same domain as the Hugo portfolio.

- **Source:** [`cloudflare/_worker.js`](./_worker.js)
- **Pages project:** `ixchelone`
- **Production domain:** `https://ixchelone.dev`
- **Temporary deployment domain:** `https://ixchelone.pages.dev`

## Architecture

The project uses Cloudflare Pages Advanced Mode with a custom `_worker.js`.

The Worker handles two types of requests:

1. **PDF requests:** Fetches PDF assets from GitHub Releases and serves them inline.
2. **All other requests:** Forwards requests to Cloudflare Pages static assets using `env.ASSETS.fetch(request)`, serving the generated Hugo website.

GitHub Releases remain the single source of truth for PDF documents.

### Upstream

PDF files are fetched from:

`https://github.com/ixchelone/resume/releases/download/credentials/<file>.pdf`

### Public URLs

**Preferred short URLs:**

`https://ixchelone.dev/<file>.pdf`

**Backward-compatible URLs:**

`https://ixchelone.dev/docs/credentials/<type>/<file>.pdf`

The `<type>` segment can be `certifications`, `certificates`, or `courses`.

It is used for URL organization only. All PDF assets are stored directly in the GitHub Release, without subdirectories.

During setup and testing, the temporary Pages domain can also be used:

`https://ixchelone.pages.dev/<file>.pdf`

## Deployment

The Worker is deployed together with the Hugo website through GitHub Actions.

1. Hugo builds the website into the generated `public/` directory.
2. The workflow copies `cloudflare/_worker.js` into `public/_worker.js`.
3. Wrangler deploys the complete `public/` directory to the Cloudflare Pages project `ixchelone`.

**Deployment workflow:** [`/.github/workflows/hugo.yaml`](../.github/workflows/hugo.yaml)

**GitHub Actions secrets required:**

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Routine deployments are automated. Manual ZIP uploads through the Cloudflare Dashboard are not required.

The generated `public/` directory remains excluded from Git version control. The tracked source of the Worker remains `cloudflare/_worker.js`.

## Response headers

For PDF responses, the Worker sets:

- `Content-Disposition: inline`
- `Content-Type: application/pdf`
- `Cache-Control: public, max-age=3600`

## Add a new PDF

1. Upload the PDF as an asset to the GitHub Release named `credentials` in [`ixchelone/resume`](https://github.com/ixchelone/resume/releases/tag/credentials).

2. Use a unique, lowercase kebab-case filename with the `.pdf` extension.

   Example: `prince2-agile-practitioner.pdf`

   The filename must exactly match the Release asset name.

3. In the appropriate Hugo data JSON file, reference the public URL:

   ```json
   {
     "url": "https://ixchelone.dev/prince2-agile-practitioner.pdf"
   }
   ```

4. Verify that the URL opens and renders the PDF inline in the browser.

The data schema is documented in the main project README under [Data & Content Structure](../README.md#data--content-structure).

## Cache behavior

The Worker sets `Cache-Control: public, max-age=3600`, allowing browsers to reuse PDF responses for approximately one hour.

If you replace a PDF using the same filename, users may need a hard refresh or a cache-busting query parameter.

For immediate updates, prefer versioned filenames, for example:

`my-cert-2026-11.pdf`
