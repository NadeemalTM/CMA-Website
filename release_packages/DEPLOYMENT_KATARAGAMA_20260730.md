# CMA Kataragama Booking Update — cPanel Deployment

## Packages

- `CMA_frontend_public_html_kataragama_multi_room_20260730.zip`
  Extract directly into `public_html`.
- `CMA_backend_api_kataragama_multi_room_20260730.zip`
  Extract directly into `public_html/api.condominium.lk` (the folder that contains `artisan`).

Back up the website files and database before replacing files. Do not replace or delete the live backend `.env` file. The backend ZIP intentionally does not contain `.env`, uploaded files, cache files, or `vendor`.

## Deployment order

1. Put the website in a short maintenance window and create a database backup.
2. Upload and extract the backend ZIP in `public_html/api.condominium.lk`.
3. In cPanel Terminal, change into the backend directory. Running Artisan from `~` produces `Could not open input file: artisan`.

```bash
cd ~/public_html/api.condominium.lk
pwd
ls -la artisan
php artisan optimize:clear
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan storage:link
```

If `storage:link` reports that the link already exists, that is normal. If `ls -la artisan` says it cannot find the file, use cPanel File Manager to locate `artisan`, then `cd` to that exact directory before running the commands.

4. Upload and extract the frontend ZIP in `public_html`. Allow it to overwrite the generated frontend files. Do not delete unrelated subdomain folders such as `api.condominium.lk`.
5. Clear the browser cache or test in a private window.

## Required checks

1. Open `/booking/kataragama` without signing in.
2. Select dates and confirm each room card displays its own red/green dates.
3. Select two available rooms and confirm the summary shows booking price, tax, and final price.
4. Submit the guest form and confirm one `KTGB######` reference is shown.
5. Open `/cma/bookings`, mark the payment Paid, then approve the booking.
6. Check the public reference tracker and confirm it reports Booking Successful.
7. Confirm only the approved rooms are red for those dates; other rooms must remain available.
8. In `/cma/bookings`, upload a Reference Number Banner, set the tax rate, and save. Submit a test request to verify the banner appears above its reference.

## Rollback

Restore the file and database backups together. The update adds booking columns and the `bungalow_booking_settings` table, so rolling back only files while keeping the migrated database is not recommended.
