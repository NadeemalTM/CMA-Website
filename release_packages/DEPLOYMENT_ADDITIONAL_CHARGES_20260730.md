# CMA Additional Charges & Tax Configuration (SST & VAT) — cPanel Deployment

## Packages

- `CMA_backend_api_additional_charges_20260730.zip`
  Extract directly into `public_html/api.condominium.lk` (the folder that contains `artisan`).
- `CMA_frontend_additional_charges_20260730.zip`
  Extract directly into `public_html`.

Back up the website files and database before replacing files. Do not replace or delete the live backend `.env` file. The backend ZIP intentionally does not contain `.env`, uploaded files, cache files, or `vendor`.

## What changed

1. **Tax Configuration Relocation**:
   - Removed global tax rate configuration from `/cma/bookings`.
   - Added per-room SST & VAT rate configuration in `/cma/bungalow-rooms` edit modal section.

2. **Compound Tax Calculation Logic**:
   - **SST**: `Room Price * (sst_rate / 100)` (default 2.25%)
   - **VAT**: `(Room Price + SST) * (vat_rate / 100)` (default 18.00%)
   - **Additional Charges** (e.g. Laundry Fee): Fixed one-time fee per room per stay (not subject to tax).
   - **Final Room Price**: `(Room Price + SST + VAT) * Nights + Additional Charge`

   *Example (Room 03):*
   - Room Price = Rs. 1,500.00
   - SST (2.25%) = Rs. 37.50
   - VAT (18% on Rs. 1,537.50) = Rs. 276.75
   - Total Room Rate (Inc. Tax) = Rs. 1,814.25 / night
   - Additional Charge (e.g., Laundry Fee = Rs. 180.00)
   - Final Total = **Rs. 1,994.25**

3. **Database Migrations**:
   - `2026_07_30_000002_add_additional_charge_to_bungalow_rooms.php`: Adds `additional_charge` and `additional_charge_label` columns.
   - `2026_07_30_000003_add_sst_and_vat_rates_to_bungalow_rooms.php`: Adds `sst_rate` (default 2.25) and `vat_rate` (default 18.00) columns.

## Deployment order

1. Put the website in a short maintenance window and create a database backup.
2. Upload and extract the backend ZIP in `public_html/api.condominium.lk`.
3. In cPanel Terminal, change into the backend directory and run:

```bash
cd ~/public_html/api.condominium.lk
php artisan optimize:clear
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

4. Upload and extract the frontend ZIP in `public_html`. Allow it to overwrite the generated frontend files.
5. Clear the browser cache or test in a private window.

## Required checks

1. Open `/cma/bungalow-rooms` in the admin panel.
2. Edit a room and verify **Room Tax Configuration** section is visible (SST default 2.25%, VAT default 18.00%).
3. Edit Room 03: Set Price = 1500, SST = 2.25, VAT = 18, Additional Charge Label = Laundry Fee, Amount = 180.
4. Save and confirm the Datatable shows the rates and charges.
5. Open `/booking/kataragama` in a private window.
6. Check Room 03 breakdown:
   - Booking Price: Rs. 1,500
   - SST (2.25%): Rs. 37.50
   - VAT (18%): Rs. 276.75
   - Laundry Fee (One-time): Rs. 180
   - Rate (Inc. Tax): Rs. 1,814.25 / night
7. Select Room 03 for 1 night stay. Sidebar summary shows Final Price: **Rs. 1,994.25**.
8. Submit a test request to verify the booking is recorded accurately.
