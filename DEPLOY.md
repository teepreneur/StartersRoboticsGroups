# Deploying roboticsgroups.starterstech.com (HostGator cPanel)

starterstech.com's DNS is on HostGator (ns4007/ns4008.hostgator.com), so the subdomain is created in cPanel and DNS is added for you automatically.

1. Log in to HostGator → cPanel → **Domains** (or **Subdomains**) → **Create A New Domain**.
2. Domain: `roboticsgroups.starterstech.com`. Untick "Share document root" and set the document root to `roboticsgroups.starterstech.com` (or `public_html/roboticsgroups`). Submit.
3. **File Manager** → open that folder → **Upload** → upload `roboticsgroups-site.zip` → right-click it → **Extract**. `index.html` must sit directly in the folder (not in a sub-folder). Delete the zip afterwards.
4. cPanel → **SSL/TLS Status** → run **AutoSSL** for the new subdomain (takes a few minutes). The `.htaccess` redirects to HTTPS once the certificate exists.
5. Visit https://roboticsgroups.starterstech.com and check: trailer plays, all pages open, "ENROL" opens WhatsApp.

## Before it goes live
- `data.js` → `SITE.SHOW_STUDENTS` is `false`: the Students pages use SAMPLE profiles from the design. Replace them with real, parent-consented profiles before switching it to `true`.
- Add the real Starters Robotics Group logo vector when you have it (the wordmark is a typeset reconstruction).
