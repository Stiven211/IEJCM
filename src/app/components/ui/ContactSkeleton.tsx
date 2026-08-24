const shimmerBackground = `linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.10) 75%)`

export function ContactSkeleton() {
  return (
    <section aria-hidden="true" style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#F8F8F8' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="sk" style={{ height: 14, width: 80, margin: '0 auto 12px', borderRadius: 20, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
          <div className="sk" style={{ height: 32, width: 260, margin: '0 auto', borderRadius: 12, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="sk" style={{ height: 20, width: 140, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div className="sk" style={{ height: 42, width: 42, borderRadius: 10, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.1}s` }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="sk" style={{ height: 14, width: 80, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.1 + 0.05}s` }} />
                  <div className="sk" style={{ height: 12, width: '90%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.1 + 0.1}s` }} />
                </div>
              </div>
            ))}
            <div className="sk" style={{ height: 250, borderRadius: 12, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
          </div>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '36px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="sk" style={{ height: 20, width: 160, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
            <div className="sk" style={{ height: 14, width: '100%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '0.1s' }} />
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="sk" style={{ height: 14, width: 100, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.1}s` }} />
                <div className="sk" style={{ height: 38, width: '100%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.1 + 0.05}s` }} />
              </div>
            ))}
            <div className="sk" style={{ height: 46, width: '100%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '0.4s' }} />
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    </section>
  )
}
