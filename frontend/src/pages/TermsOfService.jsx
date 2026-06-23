export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in text-text-muted">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Terms of Service</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-xl text-white font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4">By accessing and using telangana.live ("the Website"), you accept and agree to be bound by the terms and provision of this agreement.</p>

      <h2 className="text-xl text-white font-bold mt-8 mb-4">2. Description of Service</h2>
      <p className="mb-4">The Website provides users with access to a rich collection of civic resources, news, weather updates, and market rates (the "Service"). You understand and agree that the Service is provided "AS-IS" and that the Website assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.</p>

      <h2 className="text-xl text-white font-bold mt-8 mb-4">3. Monetization and Advertising</h2>
      <p className="mb-4">The Website displays advertisements, which may be targeted to the content of information on the Service, queries made through the Service, or other information. The types and extent of advertising by the Website are subject to change. In consideration for granting you access to and use of the Service, you agree that the Website and its third party providers and partners may place such advertising on the Service.</p>

      <h2 className="text-xl text-white font-bold mt-8 mb-4">4. Limitation of Liability</h2>
      <p className="mb-4">In no event shall telangana.live be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.</p>

      <h2 className="text-xl text-white font-bold mt-8 mb-4">5. Contact</h2>
      <p className="mb-4">For questions regarding these Terms, please contact us at legal@telangana.live.</p>
    </div>
  );
}
