# PCPlayground — Cloudflare Full-Stack Starter

This package turns the UI prototype into a deployable Cloudflare Pages + Workers + D1 app.

## What is real
- Static frontend on Cloudflare Pages
- Worker API under `/api/*`
- Cloudflare D1 persistent database
- Game catalog API
- PC build CRUD API
- Community post API
- Simple account registration/login/session API
- Server-side validation and password hashing with Web Crypto
- Local guest build fallback until a user logs in

## Cloudflare deployment
1. Create a D1 database in the Cloudflare dashboard named `pcplayground`.
2. Run `schema/schema.sql` against the D1 database.
3. Deploy the `worker/` folder as a Worker and bind the D1 database as `DB`.
4. Deploy `public/` as a Cloudflare Pages site.
5. In Pages project settings, add an environment variable `API_BASE` pointing to the Worker URL, or edit `public/app.js` to use `/api` when the Worker is attached to the same domain.

This package avoids GitHub and Wrangler for the intended dashboard-based deployment path.

## Important
A website can be "24/7" once hosted on Cloudflare; nothing needs to run on your PC continuously. The included code is production-oriented, but you still need to create the Cloudflare resources and deploy them in your account.
