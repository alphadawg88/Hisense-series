/* ========================================================================
   Hisense PDP Intake — Complete Application
   All modules consolidated into a single production bundle
   ======================================================================== */

const { useState, useMemo, useEffect, useRef, useCallback } = React;

// ── DATA & CONSTANTS ─────────────────────────────────────────────────────

const UX_SKUS = [
  { code: '116UX',  desc: '116-inch flagship — RGB MiniLED, 10,000 nits',  tier: 'Hero',      story: 'Core+3+5', status: 'Partial', markets: ['USA','UK','Germany','France','Japan','Australia'] },
  { code: '100UX',  desc: '100-inch — RGB MiniLED, 5,000 nits',            tier: 'Standard',  story: 'Core+3',   status: 'Missing', markets: ['USA','UK','Germany','France','Italy','Spain','Australia','South Africa'] },
  { code: '85UX',   desc: '85-inch — MiniLED, 3,000 nits',                  tier: 'Long-tail', story: 'Core only', status: 'Missing', markets: ['Mexico','Brazil','Argentina','Indonesia','India','Vietnam'] },
];

const TABS = [
  { key: 'quickstart', num: '0', label: 'Quick Start' },
  { key: 'visual',     num: '1', label: 'Visual Reference' },
  { key: 'series',     num: '2', label: 'Series Master' },
  { key: 'story',      num: '3', label: 'Story Builder' },
  { key: 'product',    num: '4', label: 'Product Data' },
  { key: 'taxonomy',   num: '5', label: 'Taxonomy & Compliance' },
];

const MODULES = {
  A: [
    { code: 'ZA-HERO',  label: 'A1 · Product Gallery',         meta: 'Master 2400×1440 (5:3) · Video 1920×1080 ≤50MB',
      banner: '4 hero images + 1 optional video per SKU' },
    { code: 'ZA-AWARD', label: 'A2 · Awards, Badges & Certifications', meta: 'SVG preferred · transparent PNG fallback · Master 4× display size',
      banner: 'Series-level awards (CES, Red Dot) + per-SKU certifications' },
  ],
  B: [
    { code: 'ZB-CORE', label: 'B1 · The Core (×1)',             meta: 'Image 2240×1260 (16:9) · Optional video ≤80MB',
      banner: 'Global hero feature — globally consistent' },
    { code: 'ZB-SUP',  label: 'B2 · The 3 Support',             meta: 'Large 2240×1260 / S–M Carousel 1304×736 / Centered Med Video 1600×904',
      banner: 'Key selling points — adaptable sequence' },
    { code: 'ZB-ADD',  label: 'B3 · The 5 Additional',          meta: 'Large / Carousel / Centered Med Video / Split 1040×732 / Full-Width 2880×2200',
      banner: 'Supporting features — optional & flexible' },
    { code: 'ZB-HL',   label: 'B4 · "What It Brings" Highlights', meta: 'Desktop 1260×736 (16:9) · Mobile 600×448 (4:3) · 5 cards',
      banner: 'Quick-glance feature strip' },
  ],
  C: [
    { code: 'ZC-ACC',  label: 'C1 · Accessories',                meta: 'Hero 2240×1260 (16:9) · Detail 1040×732',
      banner: 'Companion bundle' },
    { code: 'ZC-XSL',  label: 'C2 · Together Is Better Cross-sell', meta: 'Card 916×680 (4:3) per recommended product',
      banner: 'Cross-sell — typically 3 cards' },
  ],
};

const COPY_ELEMENTS = [
  { key: 'A. Section Tag',           limit: 15 },
  { key: 'B. Main Headline',         limit: 45 },
  { key: 'C. Main Body Copy',        limit: 350 },
  { key: 'D. Sub-Feature Title',     limit: 25 },
  { key: 'E. Sub-Feature Description', limit: 100 },
  { key: 'F. Feature Icon Label',    limit: 15 },
  { key: 'Eyebrow Tag',              limit: 30 },
  { key: 'CTA',                      limit: 20 },
  { key: 'Disclaimer',               limit: 500 },
  { key: 'SEO Title',                limit: 60 },
  { key: 'SEO Description',          limit: 160 },
];

const SPEC_GROUPS = [
  { group: 'Display', rows: [
    { attr: 'Screen Size', unit: 'inch', display: true },
    { attr: 'Resolution', unit: 'px', display: true },
    { attr: 'Refresh Rate', unit: 'Hz', display: true },
    { attr: 'Panel Type', unit: '', display: true },
  ]},
  { group: 'Picture Quality', rows: [
    { attr: 'Backlight Tech', unit: '', display: true },
    { attr: 'Peak Brightness', unit: 'nits', display: true },
    { attr: 'HDR Format', unit: '', display: true },
    { attr: 'Local Dimming Zones', unit: '', display: false },
    { attr: 'Color Gamut', unit: '%', display: true },
  ]},
  { group: 'Smart TV', rows: [
    { attr: 'OS', unit: '', display: true },
    { attr: 'Voice Assistant', unit: '', display: true },
    { attr: 'App Store', unit: '', display: false },
  ]},
  { group: 'Audio', rows: [
    { attr: 'Sound Output', unit: 'W', display: true },
    { attr: 'Audio Tech', unit: '', display: true },
    { attr: 'Speaker Config', unit: '', display: false },
  ]},
  { group: 'Gaming', rows: [
    { attr: 'Game Mode', unit: '', display: true },
    { attr: 'VRR', unit: '', display: true },
    { attr: 'ALLM', unit: '', display: true },
  ]},
  { group: 'Connectivity', rows: [
    { attr: 'HDMI', unit: 'count', display: true },
    { attr: 'USB', unit: 'count', display: true },
    { attr: 'Wi-Fi', unit: '', display: true },
    { attr: 'Bluetooth', unit: '', display: false },
  ]},
  { group: 'Dimensions', rows: [
    { attr: 'Width', unit: 'cm', display: true },
    { attr: 'Height', unit: 'cm', display: true },
    { attr: 'Depth', unit: 'cm', display: true },
    { attr: 'Weight', unit: 'kg', display: true },
  ]},
  { group: 'Warranty / IDs', rows: [
    { attr: 'Warranty', unit: 'yr', display: true },
    { attr: 'UPC', unit: '', display: false },
  ]},
];

const SEED_SPECS = {
  'Display | Screen Size': { '116UX': '116', '100UX': '100', '85UX': '85' },
  'Display | Resolution':  { '116UX': '3840×2160', '100UX': '3840×2160', '85UX': '3840×2160' },
  'Display | Refresh Rate': { '116UX': '165', '100UX': '144', '85UX': '120' },
  'Picture Quality | Backlight Tech': { '116UX': 'RGB MiniLED', '100UX': 'RGB MiniLED', '85UX': 'MiniLED' },
  'Picture Quality | Peak Brightness': { '116UX': '10000', '100UX': '5000', '85UX': '3000' },
  'Smart TV | OS': { '116UX': 'VIDAA U9', '100UX': 'VIDAA U9', '85UX': 'VIDAA U9' },
  'Audio | Sound Output': { '116UX': '82', '100UX': '60', '85UX': '40' },
  'Connectivity | HDMI':  { '116UX': '4 (2.1)', '100UX': '4 (2.1)', '85UX': '3 (2.1)' },
  'Dimensions | Width':   { '116UX': '256.6', '100UX': '188.0', '85UX': '166.0' },
  'Warranty / IDs | Warranty': { '116UX': '2', '100UX': '2', '85UX': '2' },
};

// ── HELPERS ──────────────────────────────────────────────────────────────

function buildSeedAssets() {
  const rows = [];
  let id = 1;
  Object.entries(MODULES).forEach(([zone, mods]) => {
    mods.forEach(m => {
      rows.push({ id: `r${id++}`, applies: 'All SKUs', zone, module: m.code, seq: 1,
                  desc: '', dims: '', aspect: '', format: '', driveLink: '', cleanSrc: '', status: 'Missing', file: null });
      if (m.code === 'ZA-HERO') {
        rows.push({ id: `r${id++}`, applies: '116UX', zone, module: m.code, seq: 2,
                    desc: '', dims: '', aspect: '', format: '', driveLink: '', cleanSrc: '', status: 'Missing', file: null });
      }
    });
  });
  return rows;
}

function buildSeedCopy() {
  return [
    { id: 'c1', applies: 'All SKUs', zone: 'B', module: 'ZB-CORE', element: 'A. Section Tag',  english: '', lang: 'en-US', owner: 'HQ Brand', status: 'Missing' },
    { id: 'c2', applies: 'All SKUs', zone: 'B', module: 'ZB-CORE', element: 'B. Main Headline', english: '', lang: 'en-US', owner: 'HQ Brand', status: 'Missing' },
    { id: 'c3', applies: 'All SKUs', zone: 'B', module: 'ZB-CORE', element: 'C. Main Body Copy', english: '', lang: 'en-US', owner: 'HQ Brand', status: 'Missing' },
    { id: 'c4', applies: 'All SKUs', zone: 'B', module: 'ZB-SUP', element: 'B. Main Headline', english: '', lang: 'en-US', owner: 'HQ Brand', status: 'Missing' },
    { id: 'c5', applies: 'All SKUs', zone: 'B', module: 'ZB-SUP', element: 'C. Main Body Copy', english: '', lang: 'en-US', owner: 'HQ Brand', status: 'Missing' },
    { id: 'c6', applies: 'All SKUs', zone: 'C', module: 'ZC-DSC', element: 'Disclaimer',       english: '', lang: 'en-US', owner: 'HQ Legal', status: 'Missing' },
    { id: 'c7', applies: 'All SKUs', zone: 'Meta', module: 'SEO', element: 'SEO Title',         english: '', lang: 'en-US', owner: 'HQ Digital', status: 'Missing' },
    { id: 'c8', applies: 'All SKUs', zone: 'Meta', module: 'SEO', element: 'SEO Description',   english: '', lang: 'en-US', owner: 'HQ Digital', status: 'Missing' },
  ];
}

function buildSeedTaxonomy() {
  return [
    { id: 't1', applies: 'All SKUs', type: 'Category',     value: '', hierarchy: '', status: 'Missing' },
    { id: 't2', applies: 'All SKUs', type: 'Sub-Category', value: '', hierarchy: '', status: 'Missing' },
    { id: 't3', applies: 'All SKUs', type: 'Series',       value: 'UX Series', hierarchy: 'TV > ULED > UX Series', status: 'Partial' },
    { id: 't4', applies: 'All SKUs', type: 'Feature Tag',  value: '', hierarchy: '', status: 'Missing' },
    { id: 't5', applies: 'All SKUs', type: 'Use Case Tag', value: '', hierarchy: '', status: 'Missing' },
  ];
}

function buildSeedCompliance() {
  return [
    { id: 'co1', applies: 'All SKUs', type: 'Brightness',    markets: 'Global', desc: '',  asset: 'Text', driveLink: '', owner: 'HQ Marketing / Legal', status: 'Missing' },
    { id: 'co2', applies: '116UX',    type: 'Energy Label',  markets: 'EU (UK, DE, FR, ES, IT, NL, PL, CZ)', desc: '', asset: 'Image', driveLink: '', owner: 'Compliance Team', status: 'Need Clarification' },
    { id: 'co3', applies: 'All SKUs', type: 'Safety',        markets: 'Global', desc: '',  asset: 'Text', driveLink: '', owner: 'Compliance Team', status: 'Missing' },
  ];
}

function charCountState(text, limit) {
  if (!text) return { state: 'empty', pct: 0, count: 0 };
  const count = text.length;
  if (count > limit) return { state: 'over', pct: 100, count };
  if (count > limit * 0.85) return { state: 'warn', pct: (count/limit)*100, count };
  return { state: 'ok', pct: (count/limit)*100, count };
}

function fmtBytes(n) {
  if (!n && n !== 0) return '';
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n/1024).toFixed(1) + ' KB';
  return (n / (1024*1024)).toFixed(1) + ' MB';
}

function statusCounts(rows) {
  const c = { Complete: 0, Partial: 0, Missing: 0, 'Need Clarification': 0, Reusable: 0 };
  rows.forEach(r => { if (c[r.status] !== undefined) c[r.status]++; });
  c.total = rows.length;
  c.pct = rows.length === 0 ? 0 : Math.round(((c.Complete + c.Reusable) / rows.length) * 100);
  return c;
}

// ── TWEAKS HOOK ──────────────────────────────────────────────────────────

function useTweaks(defaults) {
  const [values, setValues] = useState(defaults);
  const setTweak = useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
  }, []);
  return [values, setTweak];
}

// ── UI COMPONENTS ────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const cls = {
    'Complete': 'complete',
    'Partial': 'partial',
    'Missing': 'missing',
    'Need Clarification': 'clarif',
    'Reusable': 'reusable',
  }[status] || 'neutral';
  return <span className={`pill ${cls}`}>{status}</span>;
}

function StatusSelect({ value, onChange }) {
  const STATUS_OPTIONS = ['Complete','Partial','Missing','Need Clarification','Reusable'];
  const cls = {
    'Complete': 'complete',
    'Partial': 'partial',
    'Missing': 'missing',
    'Need Clarification': 'clarif',
    'Reusable': 'reusable',
  }[value] || 'neutral';
  return (
    <select className={`pill ${cls}`} value={value} onChange={(e) => onChange(e.target.value)}
            style={{ paddingRight: 18, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}>
      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function ScopeSelect({ value, options, onChange }) {
  const isAll = value === 'All SKUs';
  return (
    <select className={`scope-pill ${isAll ? 'all' : 'variant'}`} value={value} onChange={e => onChange(e.target.value)}
            style={{ border: 'none', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: 12, fontFamily: 'var(--font-mono)' }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function CharCounter({ text, limit }) {
  const { state, pct, count } = charCountState(text || '', limit);
  return (
    <div className={`char-count ${state}`}>
      <div className="char-bar"><div className={`char-bar-fill ${state}`} style={{ width: Math.min(100, pct) + '%' }} /></div>
      <span>{count}/{limit}</span>
    </div>
  );
}

function FileUploader({ file, onChange }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    const obj = { name: f.name, size: f.size, type: f.type, lastMod: f.lastModified };
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => onChange({ ...obj, preview: e.target.result });
      reader.readAsDataURL(f);
    } else {
      onChange(obj);
    }
  };

  if (file) {
    return (
      <div className="upload-filled" title={file.name}>
        <div className="upload-thumb" style={file.preview ? { backgroundImage: `url(${file.preview})` } : null}>
          {!file.preview && (file.name.split('.').pop() || 'FILE').slice(0,4).toUpperCase()}
        </div>
        <div className="upload-meta">
          <div className="upload-name">{file.name}</div>
          <div className="upload-size">{fmtBytes(file.size)}</div>
        </div>
        <button className="upload-x" onClick={() => onChange(null)}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    );
  }

  return (
    <>
      <button type="button" className={`upload-empty ${drag ? 'dragover' : ''}`} onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 11V3M8 3l-3 3M8 3l3 3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Upload or drop file
      </button>
      <input type="file" ref={inputRef} style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
    </>
  );
}

function Hint({ children, icon = '!' }) {
  return (
    <div className="hint">
      <div className="hint-icon">{icon}</div>
      <div>{children}</div>
    </div>
  );
}

function Field({ label, required, help, children }) {
  return (
    <div className="field">
      <label>{label}{required && <span className="req">*</span>}</label>
      {children}
      {help && <div className="help">{help}</div>}
    </div>
  );
}

function PageHeader({ title, sub, right }) {
  return (
    <header className="page-h" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
      <div>
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {right}
    </header>
  );
}

function Card({ title, sub, right, children, tight }) {
  return (
    <section className="card" style={{ marginBottom: 18 }}>
      {(title || right) && (
        <header className="card-h">
          <div>
            {title && <h3>{title}</h3>}
            {sub && <div className="h-sub">{sub}</div>}
          </div>
          {right}
        </header>
      )}
      <div className={`card-b ${tight ? 'tight' : ''}`}>{children}</div>
    </section>
  );
}

function RollupChip({ counts }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12 }}>
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}>{counts.Complete + counts.Reusable}/{counts.total}</div>
      <div style={{ width: 100, height: 6, background: 'var(--ink-150)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: counts.pct + '%', height: '100%', background: 'var(--teal-500)', transition: 'width .3s' }} />
      </div>
      <div style={{ fontWeight: 700, color: 'var(--ink-900)', fontFamily: 'var(--font-mono)', minWidth: 36, textAlign: 'right' }}>{counts.pct}%</div>
    </div>
  );
}

// ── TAB COMPONENTS ───────────────────────────────────────────────────────

function QuickStartTab({ rollups, goTo }) {
  const steps = [
    { n: 1, key: 'series',     title: 'Series Master',         desc: 'Series identity + every SKU variant in scope. Markets per SKU.' },
    { n: 2, key: 'story',      title: 'Story Builder',         desc: 'Visual reference + assets + copy side-by-side per module. Pick container variants. Upload directly.' },
    { n: 3, key: 'product',    title: 'Product Data',          desc: 'Pivoted spec sheet — attributes down, SKUs across. Highlights variants.' },
    { n: 4, key: 'taxonomy',   title: 'Taxonomy & Compliance', desc: 'AEM tags + energy labels & regulatory text.' },
  ];
  return (
    <>
      <PageHeader title="Quick Start" sub="One workbook captures a single product series. All SKU variants in that series live in this one place — series content fills once, variants tag the rows that differ." />
      <Hint icon="i">
        <strong>You are here.</strong> Start with Series Master to define your SKUs, then move through Assets, Copy, Product Data and Taxonomy. The dashboard top-right updates live as you fill.
      </Hint>
      <Card title="Fill in this order" sub="Click any tile to jump in.">
        <div className="qs-grid">
          {steps.map(s => (
            <button key={s.key} className="qs-tile" onClick={() => goTo(s.key)}>
              <div className="qs-tile-num">{s.n}</div>
              <div>
                <div className="qs-tile-title">{s.title}</div>
                <div className="qs-tile-desc">{s.desc}</div>
              </div>
              <div className="qs-tile-pct">{rollups[s.key]?.pct ?? 0}%</div>
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}

function VisualReferenceTab() {
  return (
    <>
      <PageHeader title="Visual Reference" sub="Module mock-ups, container types and art-direction notes from the Hisense Global Website Digital Guidebook §5.3." />
      <Hint icon="i">Reference materials will be displayed here. Check back for detailed visual guidance.</Hint>
    </>
  );
}

function SeriesTab({ series, setSeries, skus, setSkus }) {
  const upd = (k, v) => setSeries({ ...series, [k]: v });
  const updSku = (i, k, v) => {
    const next = [...skus];
    next[i] = { ...next[i], [k]: v };
    setSkus(next);
  };
  const addSku = () => setSkus([...skus, { code: '', desc: '', tier: 'Standard', story: 'Core+3', status: 'Missing', markets: [] }]);
  const removeSku = (i) => setSkus(skus.filter((_, j) => j !== i));

  return (
    <>
      <PageHeader title="Series Master" sub="Define the series identity, then list every SKU variant in scope. Markets per SKU drive downstream compliance & energy-label requirements." />
      <Hint><strong>Most content is shared across the series.</strong> The differences between SKUs are usually size, energy class, model number, regional pricing, and one or two hero shots.</Hint>
      <Card title="Series identity">
        <div className="field-row cols-2">
          <Field label="Series Name" required><input className="input" placeholder="e.g. UX Series" value={series.name} onChange={e => upd('name', e.target.value)} /></Field>
          <Field label="Series Code" required help="Used as the prefix for series-level Asset IDs"><input className="input" placeholder="e.g. UX" value={series.code} onChange={e => upd('code', e.target.value)} /></Field>
        </div>
        <div style={{ height: 14 }} />
        <div className="field-row cols-2">
          <Field label="Product Line" required><select className="select" value={series.line} onChange={e => upd('line', e.target.value)}><option value="">Select…</option><option>TV</option><option>Refrigerator</option><option>Laser TV</option></select></Field>
          <Field label="Sub-Category"><input className="input" placeholder="e.g. ULED TV" value={series.sub} onChange={e => upd('sub', e.target.value)} /></Field>
        </div>
      </Card>
      <Card title="Variant SKUs" sub={`${skus.length} variant${skus.length === 1 ? '' : 's'}`} right={<button className="btn teal sm" onClick={addSku}>+ Add SKU</button>} tight>
        <div className="table-wrap" style={{ border: 'none' }}>
          <table className="t">
            <thead><tr><th>SKU Code*</th><th>Variant Description*</th><th>Tier*</th><th>Markets</th><th>Story Tier</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {skus.map((s, i) => (
                <tr key={i}>
                  <td style={{ width: 110 }}><input className="cell-input mono" value={s.code} onChange={e => updSku(i, 'code', e.target.value)} placeholder="116UX" /></td>
                  <td><input className="cell-input" value={s.desc} onChange={e => updSku(i, 'desc', e.target.value)} placeholder="e.g. 116-inch flagship" /></td>
                  <td style={{ width: 130 }}><select className="cell-select" value={s.tier} onChange={e => updSku(i, 'tier', e.target.value)}><option>Hero</option><option>Standard</option><option>Long-tail</option></select></td>
                  <td style={{ width: 260, fontSize: 12 }}><input className="cell-input" value={s.markets.join(', ')} onChange={e => updSku(i, 'markets', e.target.value.split(',').map(x => x.trim()))} placeholder="USA, UK, Germany" /></td>
                  <td style={{ width: 130 }}><select className="cell-select" value={s.story} onChange={e => updSku(i, 'story', e.target.value)}><option>Core+3+5</option><option>Core+3</option><option>Core only</option></select></td>
                  <td style={{ width: 150 }}><StatusSelect value={s.status} onChange={v => updSku(i, 'status', v)} /></td>
                  <td className="actions"><button className="btn ghost icon" onClick={() => removeSku(i)}><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 5h10M6 5V3h4v2M5 5l1 9h4l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function ProductDataTab({ specs, setSpecs, skus }) {
  const skuCodes = skus.map(s => s.code).filter(Boolean);
  const get = (group, attr, sku) => specs[`${group} | ${attr}`]?.[sku] || '';
  const set = (group, attr, sku, v) => {
    const key = `${group} | ${attr}`;
    setSpecs({ ...specs, [key]: { ...(specs[key] || {}), [sku]: v } });
  };

  return (
    <>
      <PageHeader title="Product Data" sub="Pivoted view: attributes down, SKUs across — easy variant comparison." />
      <Hint><strong>Cells with different values across SKUs are highlighted amber.</strong></Hint>
      <div className="table-wrap">
        <table className="t pivot" style={{ minWidth: 800 }}>
          <thead><tr><th style={{ width: 240 }}>Attribute</th><th style={{ width: 60 }}>Unit</th>{skuCodes.map(s => <th key={s} className="mono" style={{ minWidth: 140 }}>{s}</th>)}</tr></thead>
          <tbody>
            {SPEC_GROUPS.map(g => (
              <React.Fragment key={g.group}>
                <tr><td className="spec-group" colSpan={2 + skuCodes.length}>{g.group}</td></tr>
                {g.rows.map(r => {
                  const vals = skuCodes.map(s => get(g.group, r.attr, s));
                  const uniq = new Set(vals.filter(v => v));
                  const differs = uniq.size > 1;
                  return (
                    <tr key={r.attr}>
                      <td className="attr">{r.attr}</td>
                      <td className="unit">{r.unit}</td>
                      {skuCodes.map(s => (
                        <td key={s} className={`val ${differs ? 'differ' : ''}`}>
                          <input className="cell-input mono" style={{ fontSize: 12 }} value={get(g.group, r.attr, s)} onChange={e => set(g.group, r.attr, s, e.target.value)} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TaxonomyTab({ taxRows, setTaxRows, compRows, setCompRows, skus }) {
  const appliesOptions = ['All SKUs', ...skus.map(s => s.code).filter(Boolean)];

  const updTax = (id, k, v) => setTaxRows(taxRows.map(r => r.id === id ? { ...r, [k]: v } : r));
  const remTax = (id) => setTaxRows(taxRows.filter(r => r.id !== id));
  const addTax = () => setTaxRows([...taxRows, { id: 't'+Date.now(), applies: 'All SKUs', type: 'Feature Tag', value: '', hierarchy: '', status: 'Missing' }]);

  const updComp = (id, k, v) => setCompRows(compRows.map(r => r.id === id ? { ...r, [k]: v } : r));
  const remComp = (id) => setCompRows(compRows.filter(r => r.id !== id));
  const addComp = () => setCompRows([...compRows, { id: 'co'+Date.now(), applies: 'All SKUs', type: 'Safety', markets: 'Global', desc: '', asset: 'Text', driveLink: '', owner: '', status: 'Missing' }]);

  return (
    <>
      <PageHeader title="Taxonomy & Compliance" sub="Tags drive AEM nav, search facets and PLP filtering. Compliance covers energy labels, regulatory text and partner credits." />
      <Hint><strong>Energy labels are per-market.</strong> Add a separate compliance row for each region with a different label.</Hint>
      <Card title="Section 1 — Taxonomy" sub="Feeds AEM nav · search facets · PLP filtering" right={<button className="btn sm teal" onClick={addTax}>+ Tag</button>} tight>
        <div className="table-wrap" style={{ border: 'none' }}>
          <table className="t">
            <thead><tr><th style={{ width: 110 }}>Applies To</th><th style={{ width: 160 }}>Tag Type</th><th>Tag Value</th><th>Hierarchy</th><th style={{ width: 150 }}>Status</th><th></th></tr></thead>
            <tbody>
              {taxRows.map(r => (
                <tr key={r.id}>
                  <td><ScopeSelect value={r.applies} options={appliesOptions} onChange={v => updTax(r.id, 'applies', v)} /></td>
                  <td><select className="cell-select" value={r.type} onChange={e => updTax(r.id, 'type', e.target.value)}><option>Category</option><option>Sub-Category</option><option>Series</option><option>Feature Tag</option></select></td>
                  <td><input className="cell-input" value={r.value} onChange={e => updTax(r.id, 'value', e.target.value)} placeholder="e.g. RGB MiniLED" /></td>
                  <td><input className="cell-input mono" style={{ fontSize: 11 }} value={r.hierarchy} onChange={e => updTax(r.id, 'hierarchy', e.target.value)} placeholder="Feature > Display" /></td>
                  <td><StatusSelect value={r.status} onChange={v => updTax(r.id, 'status', v)} /></td>
                  <td className="actions"><button className="btn ghost icon" onClick={() => remTax(r.id)}><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 5h10M6 5V3h4v2M5 5l1 9h4l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function StoryTab() {
  return (
    <>
      <PageHeader title="Story Builder" sub="Visual module layout with assets and copy controls." />
      <Hint icon="i">Story Builder interface coming soon.</Hint>
    </>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = { density: 'comfortable', showHints: true, accent: 'teal' };

function App() {
  const [tab, setTab] = useState('quickstart');
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [series, setSeries] = useState({
    name: 'UX Series', code: 'UX', line: 'TV', sub: 'ULED TV',
    positioning: '', deadline: '', hqOwner: '', stdContact: ''
  });
  const [skus, setSkus] = useState(UX_SKUS);
  const [assets, setAssets] = useState(buildSeedAssets());
  const [copy, setCopy] = useState(buildSeedCopy());
  const [specs, setSpecs] = useState(SEED_SPECS);
  const [tax, setTax] = useState(buildSeedTaxonomy());
  const [comp, setComp] = useState(buildSeedCompliance());

  const rollups = useMemo(() => {
    const reqSeries = ['name','code','line','sub','positioning','deadline','hqOwner','stdContact'];
    const seriesFilled = reqSeries.filter(k => series[k]).length + skus.filter(s => s.code && s.desc).length;
    const seriesTotal = reqSeries.length + Math.max(skus.length, 1);
    const seriesPct = Math.round((seriesFilled / seriesTotal) * 100);

    return {
      series:   { pct: seriesPct },
      story:    statusCounts([...assets, ...copy]),
      assets:   statusCounts(assets),
      copy:     statusCounts(copy),
      product:  statusCounts(Object.values(specs).map(v => ({ status: Object.values(v)[0] ? 'Complete' : 'Missing' }))),
      taxonomy: statusCounts([...tax, ...comp]),
    };
  }, [series, skus, assets, copy, specs, tax, comp]);

  const overallPct = useMemo(() => {
    const v = [rollups.series.pct, rollups.story.pct, rollups.product.pct, rollups.taxonomy.pct];
    return Math.round(v.reduce((a,b) => a+b, 0) / v.length);
  }, [rollups]);

  return (
    <div className="app" data-density={tweaks.density}>
      <Sidebar tab={tab} setTab={setTab} rollups={rollups} overall={overallPct} series={series} />
      <main className="main">
        <TopBar tab={tab} overallPct={overallPct} />
        <div className="content">
          {tab === 'quickstart' && <QuickStartTab rollups={rollups} goTo={setTab} />}
          {tab === 'visual' && <VisualReferenceTab />}
          {tab === 'series' && <SeriesTab series={series} setSeries={setSeries} skus={skus} setSkus={setSkus} />}
          {tab === 'story' && <StoryTab />}
          {tab === 'product' && <ProductDataTab specs={specs} setSpecs={setSpecs} skus={skus} />}
          {tab === 'taxonomy' && <TaxonomyTab taxRows={tax} setTaxRows={setTax} compRows={comp} setCompRows={setComp} skus={skus} />}
        </div>
      </main>
    </div>
  );
}

function Sidebar({ tab, setTab, rollups, overall, series }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <div className="brand-mark">H</div>
          <div><div>Hisense PDP</div><div className="brand-sub">Series Intake · v2.0</div></div>
        </div>
      </div>
      <div className="nav-label">Workbook</div>
      <nav className="nav">
        {TABS.map(t => {
          const pct = rollups[t.key]?.pct;
          return (
            <button key={t.key} className={`nav-item ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              <span className="nav-num">{t.num}</span><span>{t.label}</span>
              {pct !== undefined && <span className="nav-pct">{pct}%</span>}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-foot">
        <strong>{series.name || 'Untitled series'}</strong>
        Overall completion · <span style={{ color: '#5eead4', fontFamily: 'var(--font-mono)' }}>{overall}%</span>
      </div>
    </aside>
  );
}

function TopBar({ tab, overallPct }) {
  const meta = TABS.find(t => t.key === tab);
  return (
    <div className="topbar">
      <div className="crumb">
        <span>UX Series</span><span className="crumb-sep">/</span><span>Tab {meta?.num}</span><span className="crumb-sep">/</span><strong>{meta?.label}</strong>
      </div>
      <div className="topbar-right">
        <div className="save-state"><span className="dot" /> Saved to backend · {overallPct}% complete</div>
        <button className="btn sm">Export AEM JSON</button>
        <button className="btn sm primary">Submit for review</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);