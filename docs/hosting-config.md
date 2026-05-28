# Hosting Configuration: GCS + Cloudflare

Documents the full end-to-end process for hosting the static site on Google Cloud Storage with Cloudflare handling DNS, HTTPS, and CDN.

---

## Architecture

```
Browser
  └── Cloudflare (DNS + SSL + CDN)
        └── Google Cloud Storage bucket (www.scott-taylor11.com)
```

Cloudflare proxies all traffic. GCS is never accessed directly by the browser. This means Cloudflare provides the SSL certificate — GCS does not need one.

---

## 1. GCS Bucket Setup

The bucket **must be named exactly after the domain it will serve** (`www.scott-taylor11.com`). GCS uses the incoming `Host` header to identify which bucket to serve, so the name must match precisely.

### Create the bucket

```bash
gcloud storage buckets create gs://www.scott-taylor11.com \
    --default-storage-class=STANDARD \
    --location=EUROPE-WEST2 \
    --uniform-bucket-level-access
```

### Make it publicly readable

```bash
gsutil iam ch allUsers:objectViewer gs://www.scott-taylor11.com
```

### Configure static website hosting

```bash
gcloud storage buckets update gs://www.scott-taylor11.com \
    --web-index-page=index.html \
    --web-error-page=404.html
```

### Upload the static export

```bash
gcloud storage rsync -r --delete-unmatched-destination-objects out/ gs://www.scott-taylor11.com
```

> The `--delete-unmatched-destination-objects` flag removes stale files from the bucket that no longer exist in `out/`, equivalent to `aws s3 sync --delete`.

---

## 2. Cloudflare Setup

### Add the domain

1. Create a free account at [cloudflare.com](https://cloudflare.com).
2. Click **Add a site** and enter `scott-taylor11.com`.
3. Select the **Free** plan.
4. Cloudflare will scan existing DNS records — these can be ignored or cleared.
5. Cloudflare will display **two nameserver addresses** (e.g. `nina.ns.cloudflare.com`).

### Update nameservers at your registrar

Log in to wherever you bought the domain and replace the existing nameservers with the two Cloudflare ones. This delegates all DNS control to Cloudflare. Propagation is usually minutes but can take up to 24 hours.

---

## 3. Cloudflare DNS Records

Navigate to your domain → **DNS → Records**.

### `www` subdomain → GCS

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `www` |
| Target | `c.storage.googleapis.com` |
| Proxy status | **Proxied** (orange cloud) |

### Apex domain (`scott-taylor11.com`)

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `@` |
| Target | `www.scott-taylor11.com` |
| Proxy status | **Proxied** (orange cloud) |

> **Why is the apex CNAME not enough?** A CNAME only chains DNS resolution — it does not change the `Host` header that GCS receives. Without the redirect rule below, a request to `scott-taylor11.com` reaches GCS with `Host: scott-taylor11.com`, which causes a `NoSuchBucket` error because the bucket is named `www.scott-taylor11.com`. The DNS record is still needed so Cloudflare can intercept the request, but a redirect rule is required to rewrite the destination.

---

## 4. Cloudflare Redirect Rule (Apex → www)

Navigate to your domain → **Rules → Redirect Rules → Create rule**.

| Field | Value |
|---|---|
| Rule name | `Apex to www` |
| When (filter expression) | `Hostname` `equals` `scott-taylor11.com` |
| Then | **Static** redirect |
| Redirect URL | `https://www.scott-taylor11.com` |
| Status code | `301` |
| Preserve URL path | **On** |

Save and deploy the rule.

With this in place, any request to `scott-taylor11.com` (or `http://scott-taylor11.com/some/path`) is redirected by Cloudflare to `https://www.scott-taylor11.com/some/path` before the request ever reaches GCS.

---

## 5. HTTPS

HTTPS is provided automatically by Cloudflare in Proxied mode — no certificate configuration is needed on the GCS side. Cloudflare issues and renews the certificate for `scott-taylor11.com` and `www.scott-taylor11.com`.

To enforce HTTPS (prevent HTTP access):

1. Go to **SSL/TLS → Edge Certificates**.
2. Enable **Always Use HTTPS**.

---

## Verification Checklist

- [ ] `https://www.scott-taylor11.com` loads the site correctly with styles and JS
- [ ] `http://scott-taylor11.com` redirects to `https://www.scott-taylor11.com` (301)
- [ ] `https://scott-taylor11.com` redirects to `https://www.scott-taylor11.com` (301)
- [ ] Assets (`_next/static/`) load without 404s (check browser DevTools Network tab)
- [ ] No mixed-content warnings in the browser console
