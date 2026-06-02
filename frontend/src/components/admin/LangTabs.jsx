/**
 * LangTabs — language tab switcher for multilingual form fields
 *
 * Props:
 *   activeTab   {'en'|'si'|'ta'}
 *   onTabChange {(tab: string) => void}
 *   children    {ReactNode}  — rendered content for the active language
 *
 * Usage:
 *   <LangTabs activeTab={lang} onTabChange={setLang}>
 *     {lang === 'en' && <FormField ... />}
 *     {lang === 'si' && <FormField ... />}
 *     {lang === 'ta' && <FormField ... />}
 *   </LangTabs>
 */

const TABS = [
  { id: 'en', label: 'EN', full: 'English' },
  { id: 'si', label: 'SI', full: 'සිංහල' },
  { id: 'ta', label: 'TA', full: 'தமிழ்' },
];

export default function LangTabs({ activeTab = 'en', onTabChange, children }) {
  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: 'inline-flex',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1.5px solid var(--mid-gray)',
        marginBottom: '1.25rem',
        background: 'var(--light-gray)',
      }}>
        {TABS.map((tab, i) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              title={tab.full}
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.5px',
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive ? 'var(--crimson)' : 'transparent',
                border: 'none',
                borderRight: i < TABS.length - 1 ? '1.5px solid var(--mid-gray)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                lineHeight: 1.4,
              }}
            >
              {tab.label}
              {isActive && (
                <span style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: 400,
                  opacity: 0.85,
                  lineHeight: 1,
                  marginTop: 1,
                }}>
                  {tab.full}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active language content */}
      <div style={{ position: 'relative' }}>
        {/* Language indicator strip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginBottom: '0.875rem',
          fontSize: '0.78rem', color: 'var(--text-muted)',
        }}>
          <span style={{
            display: 'inline-block',
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--crimson)',
          }} />
          <span>
            Editing <strong style={{ color: 'var(--text-body)' }}>
              {TABS.find(t => t.id === activeTab)?.full}
            </strong> content
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
