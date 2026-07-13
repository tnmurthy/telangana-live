# HTML & JS Technical Integration Guide for Telangana.live

This document outlines the precise steps, file structures, and code implementations required to connect a custom-coded HTML/JS website to Google Search Console and Google AdSense.

---

## Part 1: Google Search Console Verification

To ensure Google indexes your site and tracks performance, you must verify your domain ownership.

1. Navigate to [Google Search Console](https://google.com).
2. Log in with your primary Gmail account and select **URL prefix**.
3. Input: `https://telangana.live`
4. Choose the **HTML file** verification option and download the provided file (e.g., `google123456789.html`).
5. Upload this file directly to your site's root server directory.
6. Return to Search Console and click **Verify**.

---

## Part 2: HTML Global Layout Integration

Open your `index.html` file and any other custom page template files (e.g., news pages, category pages). Inject the AdSense tag directly into the `<head>` section.

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
</head>
<body>

    <!-- Main Content Area -->
    <main>
        <h1>Welcome to Telangana Live</h1>
    </main>

    <!-- Global Footer Component -->
    <footer>
        <p>&copy; 2026 Telangana Live. All Rights Reserved.</p>
        <nav>
            <a href="/privacy-policy.html">Privacy Policy</a>
        </nav>
    </footer>

</body>
</html>
```
*Note: Make sure to replace `ca-pub-YOUR_ACTUAL_ID_HERE` with the unique ID provided in your AdSense Dashboard.*

---

## Part 3: Deploying the `ads.txt` File

AdSense requires an authorized seller file at your root directory to prevent layout spoofing and secure your ad inventory bids.

1. Create a blank plaintext file on your computer and name it exactly `ads.txt`.
2. Paste the following exact line inside it:

```text
google.com, pub-YOUR_ACTUAL_ID_HERE, DIRECT, f08c47fec0942fa0
```

3. Replace `YOUR_ACTUAL_ID_HERE` with your publisher ID string.
4. Upload this file to your public root folder. 
5. Confirm deployment by ensuring `https://telangana.liveads.txt` resolves successfully in a public browser tab.

---

## Part 4: Privacy Policy HTML Generation

Create a dedicated page named `privacy-policy.html` in your directory structure so Google's review crawler can find it via your footer menu link.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Privacy Policy - Telangana Live</title>
</head>
<body>
    <h1>Privacy Policy for Telangana Live</h1>
    <p><strong>Last Updated: May 2026</strong></p>
    
    <p>At Telangana Live, accessible from https://telangana.live, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Telangana Live and how we use it.</p>
    
    <h2>Cookies and Web Beacons</h2>
    <p>Like any other website, Telangana Live uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.</p>

    <h2>Google DoubleClick DART Cookie</h2>
    <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.telangana.live and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://google.com">https://google.com</a></p>

    <h2>Consent</h2>
    <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
</body>
</html>
```
