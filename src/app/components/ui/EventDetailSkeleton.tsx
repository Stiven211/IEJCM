const shimmerBackground = `linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.10) 75%)`

export function EventDetailSkeleton() {
  return (
    <div aria-hidden="true" style={{ backgroundColor: '#F8F8F8', minHeight: '100vh' }}>
      <div style={{ position: 'relative', height: 'clamp(300px, 48vh, 520px)', overflow: 'hidden', backgroundColor: '#002200' }}>
        <div className="sk" style={{ width: '100%', height: '100%', backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        <div style={{ position: 'absolute', top: '24px', left: '24px', width: 140, height: 36, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        <div style={{ position: 'absolute', bottom: '32px', left: '24px', right: '24px', maxWidth: '1280px', margin: '0 auto' }}>
          <div className="sk" style={{ height: 14, width: 120, borderRadius: 20, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', marginBottom: 14 }} />
          <div className="sk" style={{ height: 'clamp(22px, 4.5vw, 46px)', width: '80%', maxWidth: 820, borderRadius: 12, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)', alignItems: 'flex-start' }}>
          <div>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: 'clamp(24px, 3vw, 40px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 14px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
              <div className="sk" style={{ height: 20, width: 160, borderRadius: 12, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', marginBottom: 22 }} />
              {[0.6, 0.8, 0.7, 0.9].map((w, i) => (
                <div key={i} className="sk" style={{ height: 16, width: `${Math.round(w * 100)}%`, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', marginBottom: 18, animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#5A7A5A', fontSize: '14px' }}>Compartir:</span>
              <div className="sk" style={{ height: 36, width: 130, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}>
              <div className="sk" style={{ height: 16, width: 160, borderRadius: 12, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', marginBottom: 22 }} />
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: 18, alignItems: 'flex-start' }}>
                  <div className="sk" style={{ width: 38, height: 38, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.08}s` }} />
                  <div style={{ flex: 1 }}>
                    <div className="sk" style={{ height: 10, width: 60, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', marginBottom: 6, animationDelay: `${i * 0.08 + 0.03}s` }} />
                    <div className="sk" style={{ height: 14, width: '80%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.08 + 0.05}s` }} />
                  </div>
                </div>
              ))}
              <div className="sk" style={{ height: 44, width: '100%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
