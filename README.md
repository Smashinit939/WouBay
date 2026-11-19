# WouBay — Woxsen Student Marketplace

A responsive front-end prototype for the WouBay campus marketplace. Built with HTML, CSS and vanilla JavaScript. It does not require a build step or a server for the demo.

## Run it

1. Unzip the project (if you downloaded the ZIP).
2. Open `index.html` in a modern browser.
3. Use the navigation to explore Home, Explore, Requests and Admin Preview.

For the most reliable local testing, you can also run a simple local server from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## What's included

- WouBay landing page, campus marketplace story, how-it-works steps, feature sections and creator cards.
- Buy and Rent browsing with search and category filtering.
- Request board with an add-request form.
- Listing form for selling or offering an item for rent.
- Rental return date/time selection.
- Light/dark mode switch using the supplied cream/sage/taupe and navy/blue-grey palette.
- Demo admin view for removing listings, resolving reports, editing the homepage tagline and managing categories.
- Browser-local persistence through `localStorage`.

## Important prototype limitations

This is a presentation-ready front-end prototype, not a live marketplace backend. Items and requests are stored only in the browser where they are created. There is no real login, Woxsen email verification, cross-device database, private messaging, payment processing, booking confirmation, or secure admin authentication. The Admin Preview is deliberately labelled as a demo.

For privacy, phone numbers, personal email addresses and room numbers are not displayed publicly. A production version should use verified university sign-in, private messaging and controlled contact sharing, alongside public campus meetup points.

## Editing

You can edit sample content and add/remove demo listings and requests through the page. Homepage tagline and categories can be changed in Admin Preview. For layout, animations, colours or new product features, edit `index.html`, `styles.css` and `app.js` — or describe the changes and the project files can be revised.
