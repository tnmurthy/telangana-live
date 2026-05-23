# Google AdSense Onboarding Plan for Telangana.live

This master document contains the complete structural setup, legally compliant policy text, and technical integration codes required to get your civic intelligence portal approved for Google AdSense monetization.

---

## Part 1: Step-by-Step Onboarding Process

### 1. Pre-Application Checklist
* Ensure you have at least 15–20 high-quality, original news articles or civic updates published.
* Verify that all navigation menu links work perfectly and do not lead to empty pages.
* Ensure your website loads quickly on mobile devices.

### 2. Formally Submit to Google AdSense
1. Navigate to [Google AdSense](https://google.com) and click **Get Started**.
2. Sign in with your primary Google/Gmail account.
3. Enter your site URL exactly: `https://telangana.live`
4. Select **India** as your payment country/territory.
5. Accept the terms and conditions, then click **Start using AdSense**.

### 3. Setup the Financial Verification
1. In your AdSense dashboard, go to **Payments > Payments info**.
2. Complete your tax profile. As an Indian creator, you will need to provide your **PAN Card number** and local banking details to receive direct monthly bank transfers once you cross the \$100 payout threshold.

---

## Part 2: Legally Compliant Privacy Policy Text

*Instructions: Create a new page on your website with the URL slug `/privacy-policy`. Copy the exact text below, replace the placeholder bracket `[Contact Email]`, and publish it.*

### Privacy Policy for Telangana Live

**Last Updated: May 2026**

At Telangana Live (accessible from https://telangana.live), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Telangana Live and how we use it.

If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.

#### Log Files
Telangana Live follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.

#### Cookies and Web Beacons
Like any other website, Telangana Live uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.

#### Google DoubleClick DART Cookie
Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.telangana.live and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://google.com

#### Our Advertising Partners
Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:
* **Google AdSense**

Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies above.

#### Third Party Privacy Policies
Telangana Live's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.

#### Children's Information
Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.

Telangana Live does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.

#### Consent
By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.

#### Contact Us
If you have any questions about this Privacy Policy, please contact us at: **[Insert Your Contact Email Here]**

---

## Part 3: Technical Integration Codes

### 1. AdSense Verification Script Tag
*Instructions: Copy the code block below. If you are using WordPress, paste this into the **Header** section of your theme using a plugin like "WPCode". If your site is custom-built, paste this code directly inside the `<head>` and `</head>` tags of your HTML architecture.*

```html
<!-- Begin Google AdSense Verification Code -->
<script async src="https://googlesyndication.com"
     crossorigin="anonymous"></script>
<!-- End Google AdSense Verification Code -->
```
*(Note: Replace `ca-pub-XXXXXXXXXXXXXXXX` with your exact publisher ID found inside your AdSense dashboard portal.)*

### 2. Authorized Digital Sellers (`ads.txt`) File
*Instructions: Create a completely blank text file named exactly `ads.txt`. Paste the line below into it, replace the placeholder ID with your real publisher ID, and upload it to your site's root directory so it can be seen publicly at `https://telangana.live/ads.txt`.*

```text
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

---
## Part 4: Review and Activation Strategy
* **Do Not Click Your Own Ads**: Clicking your own live advertisements to test them will trigger an immediate permanent account ban for invalid click activity.
* **Content Flow**: Keep posting active civic updates concerning Telangana while Google conducts its automated crawl to guarantee approval.
