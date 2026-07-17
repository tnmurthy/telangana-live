export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in text-text-muted">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-xl text-white font-bold mt-8 mb-4">1. Information We Collect</h2>
      <p className="mb-4">We collect information to provide better services to all our users. The types of information we collect include:</p>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Information you provide to us (e.g., when signing up for newsletters).</li>
        <li>Information we get from your use of our services (e.g., IP addresses, device information, browser type).</li>
        <li>Cookies and similar technologies used for analytics and personalized advertising.</li>
      </ul>

      <h2 className="text-xl text-white font-bold mt-8 mb-4">2. How We Use Information</h2>
      <p className="mb-4">We use the information we collect to provide, maintain, protect, and improve our services, as well as to develop new ones. We also use this information to offer you tailored content – like giving you more relevant search results and ads.</p>

      <h2 className="text-xl text-white font-bold mt-8 mb-4">3. Third-Party Advertisers (Google AdSense)</h2>
      <p className="mb-4">We use third-party advertising companies to serve ads when you visit our Website. These companies may use aggregated information (not including your name, address, email address or telephone number) about your visits to this and other Web sites in order to provide advertisements about goods and services of interest to you.</p>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Google, as a third party vendor, uses cookies to serve ads on our site.</li>
        <li>Google's use of the DART cookie enables it to serve ads to our users based on their visit to our sites and other sites on the Internet.</li>
        <li>Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</li>
      </ul>

      <h2 className="text-xl text-white font-bold mt-8 mb-4">4. Contact Us</h2>
      <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at privacy@telangana.live.</p>
    </div>
  );
}
