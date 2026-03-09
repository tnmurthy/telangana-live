import { useState } from 'react';
import { reportCategories, detectCorporation } from '../data/reportingData';

export default function ReportForm({ lat, lng, onSubmit, onClose }) {
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);

    const detected = detectCorporation(lat, lng);

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category || !description) return;
        onSubmit({
            lat,
            lng,
            category,
            description,
            photo,
            ward: Math.floor(Math.random() * 50) + (detected.key === 'cmc' ? 101 : detected.key === 'mmc' ? 201 : 1),
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-lg p-6 sm:p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="section-title text-xl">📌 Report an Issue</h3>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-all text-text-muted">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Auto-detected corporation */}
                <div className="detail-box mb-6 flex items-center gap-3" style={{ borderColor: `${detected.color}40` }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: detected.color }}></div>
                    <div>
                        <p className="text-xs text-white font-bold">Auto-detected: {detected.shortName}</p>
                        <p className="text-[10px] text-text-muted">{detected.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Location */}
                    <div>
                        <label className="label-xs mb-2 block">📍 Location</label>
                        <p className="text-sm text-text-secondary">{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</p>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="label-xs mb-3 block">Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {reportCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`p-3 rounded-xl text-left flex items-center gap-3 transition-all border ${category === cat.id ? 'bg-white/10 border-white/30 text-white' : 'bg-white/[0.02] border-white/5 text-text-muted hover:bg-white/5'}`}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="text-xs font-bold">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label-xs mb-2 block">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-muted focus:border-heritage-gold/50 focus:outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="label-xs mb-2 block">📷 Photo (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhoto}
                            className="text-xs text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 file:transition-all"
                        />
                        {photo && (
                            <img src={photo} alt="Preview" className="mt-3 w-full h-32 object-cover rounded-xl border border-white/10" />
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!category || !description}
                        className="w-full py-4 rounded-2xl bg-white text-dark-bg text-xs font-black uppercase tracking-[0.2em] hover:bg-heritage-gold transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        Submit Report to {detected.shortName}
                    </button>
                </form>
            </div>
        </div>
    );
}
