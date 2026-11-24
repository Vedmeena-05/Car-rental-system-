# RaahRent - Self-drive car rental (India)

A front-end prototype for a car rental system aimed at Indian users.

## Run
Open `index.html` in any modern browser. No build step or server needed.
(An internet connection is needed only to load the Google Fonts.)

## Files
- `index.html` - page structure (customer view and admin view)
- `style.css`  - styling, light and dark themes, responsive layout
- `script.js`  - fleet data, search, filters, booking flow, GST calculation, admin dashboard

## Features
- Customer: city and date search, filter by car type, sort, booking form with
  Indian mobile validation, extras, UPI/Card/Pay at pickup, 18% GST, booking reference
- Admin (Ved Meena): bookings with status updates, fleet price edit, show/hide, add and remove cars, summary stats

## Limitations
- No backend or authentication. Data is stored in the browser with localStorage,
  so it is not shared between devices and the Admin tab is not protected.
- Cars, prices and bookings are sample data.

## Possible next steps
Node + Express + MongoDB API, admin login (JWT), real availability by date, payment gateway.
