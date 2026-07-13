# Ad Injection Engine & DNS Propagation Verification for Telangana.live

This technical resource provides a production-grade JavaScript module to dynamically inject Google AdSense units into your HTML layout loops and outlines how to track global DNS propagation.

---

## Part 1: Reusable JavaScript Ad Engine (`ad-engine.js`)

To keep your custom HTML files clean, do not hardcode your Google AdSense code blocks repeatedly. Instead, save this reusable logic as `js/ad-engine.js`. It automatically injects responsive ad units wherever your news loop or civic cards render.

```javascript
/**
 * Telangana Live - Dynamic Ad Injection Engine
 * Automatically renders responsive AdSense units inside any target HTML container.
 */
const AdEngine = {
    // Replace with your real Google AdSense Publisher ID
    publisherId: "ca-pub-YOUR_ACTUAL_ID_HERE",

    /**
     * Injects an in-feed or responsive display ad into a specific DOM element
     * @param {string} containerId - The ID of the HTML element where the ad should appear
     * @param {string} adSlotId - The unique ad slot ID from your AdSense dashboard
     */
    injectAd: function(containerId, adSlotId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`AdEngine Error: Container #${containerId} not found.`);
            return;
        }

        // 1. Create the ins structural layout element required by Google
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.setAttribute('data-ad-client', this.publisherId);
        adElement.setAttribute('data-ad-slot', adSlotId);
        adElement.setAttribute('data-ad-format', 'auto');
        adElement.setAttribute('data-full-width-responsive', 'true');

        // 2. Append the ins component inside your target div layout container
        container.appendChild(adElement);

        // 3. Trigger the asynchronous AdSense push engine initialization
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error("AdEngine Engine Error: Script not loaded yet or blocked.", error);
        }
    }
};
```

### How to use this inside your HTML Layout templates:
1. Reference the scripts right before your closing `</body>` tag:
```html
<script src="js/ad-engine.js"></script>
<script>
    // Example: Dynamically injects an ad into a layout wrapper after your 3rd news card
    AdEngine.injectAd("news-feed-ad-wrapper", "1234567890");
</script>
```

---

## Part 2: Verifying Your Hostinger-to-Vercel DNS Propagation

Changing your Nameservers or adding A/CNAME records in Hostinger takes anywhere from **15 minutes to 24 hours** to update across global internet service providers. Follow these methods to check your real-time live connection status:

### Method A: Terminal/Command Line Check (Instant)
Run a diagnostic query inside your local or mobile command terminal to see which server IP currently answers for your domain:

```bash
# Check the root domain routing
nslookup telangana.live

# Or check the canonical alias routing
nslookup www.telangana.live
```
* **Success Output**: If the resolved IP addresses match Vercel’s official public edge routing IP (`76.76.21.21`), your local network has successfully updated [2].

### Method B: Global Web UI Validation (Recommended)
Because DNS propagates at different speeds across different countries, verify the worldwide update status visually:

1. Visit [WhatMyDNS.net](https://whatsmydns.net).
2. Enter your domain name: `telangana.live`
3. Select **A** from the dropdown menu and click **Search**.
   * Look for a sea of green checkmarks showing `76.76.21.21` across global server hubs [2].
4. Switch the dropdown menu to **NS** and click **Search**.
   * Confirm that your nameservers have completely updated from Hostinger over to Vercel's endpoints (`://vercel-dns.com` and `://vercel-dns.com`).

---

## Part 3: Troubleshooting Cache Delays
If the web UI checks confirm your site is pointed to Vercel but your browser still displays your old Hostinger holding page, your machine's DNS resolver cache is holding stale data. Run this terminal command to force-clear it:

```bash
# On Windows Terminal:
ipconfig /flushdns

# On macOS Terminal:
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```
