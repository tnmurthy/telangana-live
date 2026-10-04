import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AD_SLOTS, submitAdEnquiry } from '../services/adEnquiryService';

// Sponsorship slots and an enquiry form. Enquiries are stored privately in
// telangana.ad_enquiries. No audience figures are claimed here: they are
// shared on request from the site's analytics.

const SLOT_DETAILS = [
    {
        key: 'top_banner',
        title: 'Top banner',
        where: 'One line above every page on desktop.',
    },
    {
        key: 'sidebar',
        title: 'Sidebar card',
        where: 'Beside daily rates, weather and mandi prices.',
    },
    {
        key: 'area_spotlight',
        title: 'Area page spotlight',
        where: 'On the page for your district or locality, e.g. Kukatpally or Warangal.',
    },
];

const EMPTY = { name: '', business: '', contact: '', interest: 'area_spotlight', area: '', message: '', website: '' };

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="block text-xs font-bold text-text-secondary mb-1.5">{label}</span>
            {children}
            {error && <span className="block text-xs text-red-300 mt-1">{error}</span>}
        </label>
    );
}

const inputClass = 'w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-heritage-gold/60';

export default function AdvertisePage() {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [state, setState] = useState('idle'); // idle | sending | sent

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setState('sending');
        const result = await submitAdEnquiry(form);
        if (result.ok) {
            setState('sent');
            setForm(EMPTY);
            setErrors({});
        } else {
            setState('idle');
            setErrors(result.errors);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            <Helmet>
                <title>Advertise on Telangana.live</title>
                <meta name="description" content="Reach Telangana residents who check Telangana.live for power, water, rates and local news. Sponsor a banner, sidebar card or area page." />
            </Helmet>

            <header>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Advertise on Telangana.live</h1>
                <p className="text-text-secondary mt-3 max-w-2xl">
                    People across Telangana use this site to check power and water updates, gold and fuel rates,
                    weather and local news. Put your business in front of them, in the area you serve.
                </p>
            </header>

            <section aria-labelledby="slots" className="grid gap-4 md:grid-cols-3">
                <h2 id="slots" className="sr-only">Available slots</h2>
                {SLOT_DETAILS.map((slot) => (
                    <div key={slot.key} className="glass-card p-5">
                        <h3 className="text-white font-bold">{slot.title}</h3>
                        <p className="text-sm text-text-secondary mt-2">{slot.where}</p>
                    </div>
                ))}
            </section>

            <section className="glass-card p-5 text-sm text-text-secondary space-y-2">
                <h2 className="text-white font-bold text-base">How sponsorship works here</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Every paid placement is labelled <strong className="text-white">Sponsored</strong>.</li>
                    <li>We share current visitor figures for the pages you are interested in before you pay.</li>
                    <li>No ads on emergency pages, and no ads made to look like government notices.</li>
                </ul>
            </section>

            <section aria-labelledby="enquiry" className="glass-card p-6">
                <h2 id="enquiry" className="text-xl font-bold text-white">Send an enquiry</h2>
                {state === 'sent' ? (
                    <p role="status" className="mt-4 text-sm text-emerald-300">
                        Thank you. We have your enquiry and will contact you shortly.
                    </p>
                ) : (
                    <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2" noValidate>
                        <Field label="Your name" error={errors.name}>
                            <input className={inputClass} value={form.name} onChange={set('name')} autoComplete="name" />
                        </Field>
                        <Field label="Business" error={errors.business}>
                            <input className={inputClass} value={form.business} onChange={set('business')} autoComplete="organization" />
                        </Field>
                        <Field label="Phone or email" error={errors.contact}>
                            <input className={inputClass} value={form.contact} onChange={set('contact')} />
                        </Field>
                        <Field label="Slot" error={errors.interest}>
                            <select className={inputClass} value={form.interest} onChange={set('interest')}>
                                {Object.entries(AD_SLOTS).map(([key, label]) => (
                                    <option key={key} value={key} className="bg-slate-900">{label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Area you serve (optional)" error={errors.area}>
                            <input className={inputClass} value={form.area} onChange={set('area')} placeholder="e.g. Kukatpally" />
                        </Field>
                        <Field label="Message (optional)" error={errors.message}>
                            <input className={inputClass} value={form.message} onChange={set('message')} />
                        </Field>
                        {/* Honeypot: hidden from people, filled by bots. */}
                        <input
                            type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                            className="hidden" value={form.website} onChange={set('website')}
                        />
                        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-text-muted">
                                We use these details only to reply to you. See our <Link to="/privacy" className="underline">privacy policy</Link>.
                            </p>
                            <button
                                type="submit" disabled={state === 'sending'}
                                className="rounded-xl bg-heritage-gold text-slate-950 font-bold px-6 py-3 text-sm hover:brightness-110 disabled:opacity-60"
                            >
                                {state === 'sending' ? 'Sending…' : 'Send enquiry'}
                            </button>
                        </div>
                        {errors.form && <p role="alert" className="md:col-span-2 text-sm text-red-300">{errors.form}</p>}
                    </form>
                )}
            </section>
        </div>
    );
}
