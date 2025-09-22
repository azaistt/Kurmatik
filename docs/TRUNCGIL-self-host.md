Self-host Truncgil Finance (laravel-truncgil-finance)

This guide shows how to run the `truncgil/laravel-truncgil-finance` package as a simple service to expose Truncgil finance data from your own server. This is useful to avoid upstream changes, add caching, or provide a stable internal API for your app.

Prereqs
- PHP 8.1+ (match package requirements)
- Composer
- A webserver (Nginx/Apache) or PHP built-in server for testing
- Optional: a small VPS (DigitalOcean, Linode, AWS EC2)

Steps (quick)
1. Clone the repository on your server:

```bash
git clone https://github.com/truncgil/laravel-truncgil-finance.git
cd laravel-truncgil-finance
```

2. Install deps:

```bash
composer install
```

3. Create config file

Create `config/finance.php` with appropriate settings (example below). Make sure `api_url` points to the upstream Truncgil JSON or your configured source.

4. Serve (development):

```bash
php -S 0.0.0.0:8000 -t public
```

Use a proper process manager (systemd) and webserver for production.

Security
- Protect the endpoint with IP allowlist or simple token authentication if you will serve internal clients only.
- Use HTTPS in production.

Caching
- Package supports caching; tune `cache_duration` in config.

Add to systemd (optional)
- Create service that runs PHP-FPM + Nginx or use `php artisan serve` wrapped by supervisord.

Example `config/finance.php` (see next file)


Troubleshooting
- If API returns empty, check upstream `api_url`.
- Check logs for exceptions (Laravel log path).

Contact
- For more help I can prepare Dockerfile + systemd example.
