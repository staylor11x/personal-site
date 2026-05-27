# Commands used to create GCP Infrastructure


### Creating the bucket

```bash
gcloud storage buckets create gs://scott-taylor11.com \
    --default-storage-class=STANDARD \
    --location=EUROPE-WEST2 \
    --uniform-bucket-level-access
```

### Configuring the site for web access
```
gcloud storage buckets update gs://<sitename> --web-index-page=index.html --web-error-page=404.html
```