import { supabase } from './supabaseClient';

// Advertising enquiries from /advertise, stored in telangana.ad_enquiries.
// The public key may insert but not read (RLS), so the row is not requested
// back. A hidden "website" field catches bots: if it is filled, nothing is
// stored but the visitor sees the normal thank-you.

export const AD_SLOTS = {
    top_banner: 'Top banner (desktop)',
    sidebar: 'Sidebar card',
    area_spotlight: 'Area page spotlight',
    other: 'Something else',
};

const LIMITS = { name: [2, 100], business: [2, 150], contact: [5, 150], area: [0, 100], message: [0, 1500] };

function clean(value) {
    return typeof value === 'string' ? value.trim() : '';
}

/** Field errors for an enquiry; an empty object means it is valid. */
export function validateAdEnquiry(form) {
    const errors = {};
    for (const [field, [min, max]] of Object.entries(LIMITS)) {
        const len = clean(form[field]).length;
        if (len < min || len > max) {
            errors[field] = min > 0 ? `Please enter ${field} (${min}–${max} characters).` : `Keep ${field} under ${max} characters.`;
        }
    }
    if (!Object.prototype.hasOwnProperty.call(AD_SLOTS, form.interest)) {
        errors.interest = 'Please choose a slot.';
    }
    return errors;
}

/** Submit an enquiry. Returns { ok: true } or { ok: false, errors }. */
export async function submitAdEnquiry(form) {
    if (clean(form.website)) return { ok: true };

    const errors = validateAdEnquiry(form);
    if (Object.keys(errors).length) return { ok: false, errors };

    const row = {
        name: clean(form.name),
        business: clean(form.business),
        contact: clean(form.contact),
        interest: form.interest,
        area: clean(form.area) || null,
        message: clean(form.message) || null,
    };
    const { error } = await supabase.from('ad_enquiries').insert([row]);
    if (error) {
        console.error('Ad enquiry failed:', error);
        return { ok: false, errors: { form: 'Your enquiry could not be sent. Please try again in a few minutes.' } };
    }
    return { ok: true };
}
