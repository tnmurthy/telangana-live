# Google Analytics 4 (GA4) Custom JS Integration Guide

This guide details how to provision a GA4 stream and integrate the script layout natively into your static HTML code structure without using heavy third-party plugins.

---

## Part 1: Provisioning the GA4 Tracking Stream

1. Navigate to the [Google Analytics Portal](https://google.com) and sign in with your primary developer Gmail account.
2. Click the **Admin** gear icon in the lower-left corner of the dashboard dashboard menu.
3. Click **Create Account**, name it `Telangana Live`, and click next.
4. Set your Property Name to `Telangana.live Portal`, choose **India** as your reporting time zone, and set your currency to **Indian Rupee (INR)**.
5. Choose **Web** as your platform collection data stream source.
6. Input your exact production domain URL: `telangana.live` and name the stream `Production Web Portal`.
7. Click **Create Stream** to generate your unique **Measurement ID** (formatted exactly as `G-XXXXXXXXXX`).

---

## Part 2: Native HTML Global Header Integration

Open your global layout file (`index.html`) and paste the unified tracking snippet directly below your AdSense code, inside the structural `<head>` component.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telangana Live - Civic Intelligence Portal</title>

    <!-- Google AdSense Verification Script -->
    <script async src="https://googlesyndication.com"
     crossorigin="anonymous"></script>

    <!-- Google Analytics 4 (GA4) Tracking Tag -->
    <script async src="https://googletagmanager.com"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      // Tells GA4 to automatically initialize and log basic pageviews
      gtag('config', 'G-YOUR_MEASUREMENT_ID', {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
      });
    </script>
</head>
<body>
    <!-- Main HTML Portal content structure goes here -->
</body>
</html>
```
*Note: Make sure to change `G-YOUR_MEASUREMENT_ID` in both lines of the tracking script with your real measurement identifier code string.*

---

## Part 3: Deploying & Live Event Verification

1. Commit your modified `index.html` file using your mobile IDE environment (AntiGravity) and push it directly to your GitHub repository branch.
2. Vercel will process the webhook update instantly and deploy the streaming tracking codes live within a few seconds.
3. Open a separate private browsing window and navigate to `https://telangana.live`.
4. Go back to your active Google Analytics Dashboard and look at the **Realtime Report** section.
5. Confirm that a real-time active user metric registers instantly, mapped specifically to your local access point location.
