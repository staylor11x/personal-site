> **Version:** 1.0
> **Status:** Living document — updated when the GCS or Cloudflare configuration changes
> **Related:** [Architecture](architecture.md) | [CI/CD pipeline](ci-cd-pipeline.md)

# Hosting setup

Documents the end-to-end configuration for hosting the static site on Google Cloud Storage with Cloudflare handling DNS, HTTPS, and CDN.

## Table of contents

1. [GCS bucket setup](#1-gcs-bucket-setup)
2. [Cloudflare setup](#2-cloudflare-setup)
3. [DNS records](#3-dns-records)
4. [Apex redirect rule](#4-apex-redirect-rule)
5. [HTTPS](#5-https)
6. [Reference commands](#6-reference-commands)
7. [Verification checklist](#7-verification-checklist)

---

## 1. GCS bucket setup

The bucket must be named exactly after the domain it serves (`www.scott-taylor11.com`). GCS uses the incoming `Host` header to identify which bucket to serve, so the name must match precisely.

### Create the bucket

```bash
gcloud storage buckets create gs://www.scott-taylor11.com \
    --default-storage-class=STANDARD \
    --location=EUROPE-WEST2 \
    --uniform-bucket-level-access
```

### Make it publicly readable

```bash
gcloud storage buckets add-iam-policy-binding gs://www.scott-taylor11.com \
    --member=allUsers \
    --role=roles/storage.objectViewer
```

### Configure static website hosting

```bash
gcloud storage buckets update gs://www.scott-taylor11.com \
    --web-main-page-suffix=index.html \
    --web-error-page=404.html
```

---

## 2. Cloudflare setup

### Add the domain

1. Create a free account at [cloudflare.com](https://cloudflare.com).
2. Click **Add a site** and enter `scott-taylor11.com`.
3. Select the **Free** plan.
4. Cloudflare scans existing DNS records — these can be ignored or cleared.
5. Cloudflare displays two nameserver addresses (e.g. `nina.ns.cloudflare.com`).

### Update nameservers at your registrar

Replace the existing nameservers at the domain registrar with the two Cloudflare nameservers. This delegates all DNS control to Cloudflare. Propagation is usually minutes but can take up to 24 hours.

---

## 3. DNS records

Navigate to the domain → **DNS → Records**.

### `www` subdomain

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

> The apex CNAME chains DNS resolution but does not change the `Host` header GCS receives. Without the redirect rule in [section 4](#4-apex-redirect-rule), a request to `scott-taylor11.com` reaches GCS with `Host: scott-taylor11.com`, causing a `NoSuchBucket` error. The DNS record is required so Cloudflare can intercept the request, but the redirect rule is also required.

---

## 4. Apex redirect rule

Navigate to the domain → **Rules → Redirect Rules → Create rule**.

| Field | Value |
|---|---|
| Rule name | `Apex to www` |
| When (filter expression) | `Hostname` `equals` `scott-taylor11.com` |
| Then | **Static** redirect |
| Redirect URL | `https://www.scott-taylor11.com` |
| Status code | `301` |
| Preserve URL path | **On** |

With this rule in place, any request to `scott-taylor11.com` is redirected by Cloudflare to `https://www.scott-taylor11.com` before the request reaches GCS.

---

## 5. HTTPS

Cloudflare issues and renews SSL certificates for `scott-taylor11.com` and `www.scott-taylor11.com` automatically in Proxied mode. No certificate configuration is needed on the GCS side.

To enforce HTTPS:

1. Go to **SSL/TLS → Edge Certificates**.
2. Enable **Always Use HTTPS**.

---

## 6. Reference commands

These commands are used for ongoing maintenance. For initial setup, follow sections 1–5 in order.

### Sync static export to bucket

```bash
gcloud storage rsync -r --delete-unmatched-destination-objects out/ gs://www.scott-taylor11.com
```

The `--delete-unmatched-destination-objects` flag removes stale files no longer present in `out/`.

### Grant service account write access

```bash
gcloud storage buckets add-iam-policy-binding gs://www.scott-taylor11.com \
    --member="serviceAccount:github-actions-deploy@personal-site-497615.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"
```

### Re-apply website configuration (if lost)

```bash
gcloud storage buckets update gs://www.scott-taylor11.com \
    --web-main-page-suffix=index.html \
    --web-error-page=404.html
```

---

## 7. Verification checklist

- [ ] `https://www.scott-taylor11.com` loads the site with styles and JS
- [ ] `http://scott-taylor11.com` redirects to `https://www.scott-taylor11.com` (301)
- [ ] `https://scott-taylor11.com` redirects to `https://www.scott-taylor11.com` (301)
- [ ] Assets (`_next/static/`) load without 404s (check browser DevTools Network tab)
- [ ] No mixed-content warnings in the browser console
