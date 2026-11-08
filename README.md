# Positioned by 30 (P30) website

Static site with no build step. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 5530
```

## Structure

| Path | What it is |
|---|---|
| `index.html` | Home page |
| `coaching.html` | ARM 1, The Alignment Coaching Mastermind |
| `prayers.html` | ARM 2, The P30 Global Alignment Prayers |
| `css/styles.css` | Shared styles, including the Coming Soon dialog |
| `js/main.js` | Menu, parents panel, career tabs, reading bar, and action buttons |
| `images/` | Compressed WebP images and the favicon |

## Turning on applications

Buttons with `data-action="apply"` or `data-action="sponsor"` open the **Coming soon** dialog
while their link is empty. To go live, add the form URL in `js/main.js`:

```js
const P30_LINKS = {
  apply: 'https://your-application-form',
  sponsor: 'https://your-sponsorship-form',
  prayers: '…'
};
```

When a link is filled in, those buttons open the form in a new tab instead of the dialog.

## Search engines

The pages have no `noindex` tag, so search engines can list the site.
