# About The HTML Files In `public/`

This folder contains four HTML files. Each one has a different role in the app flow.

## `index.html`

`index.html` is the main application shell. It is the page that loads the main UI, including:

- the top navigation
- the topic/lesson area
- the compiler/editor panel
- the visualizer and memory view
- the chat interface
- the account and language controls

It also normalizes the language and route on page load, then loads `index.css` and `index.js` to run the actual app.

## `login.html`

`login.html` is the sign-in launcher page. It fetches auth configuration from the backend, builds the sign-in and sign-up links for Cognito, supports demo mode, and keeps track of the safe `next` page the user should return to after logging in.

## `callback.html`

`callback.html` is the authentication callback page. After the user signs in with Cognito, this page receives the authorization code, sends it to the backend for token exchange, stores the returned tokens in `localStorage`, and redirects the user back to the intended app page.

## `regional.html`

`regional.html` is a lightweight language redirect page. It checks the requested language or the language saved in `localStorage`, normalizes it, and redirects the browser to the main app route with the correct language parameter.

## Important Note

The app routes such as `/`, `/compiler`, and `/visualize` do not each have their own separate HTML file. The server uses `index.html` as the shared shell, and the frontend changes the mode of the page based on the current route.
