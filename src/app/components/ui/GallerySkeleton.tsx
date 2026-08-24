const shimmerBackground = `linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.10) 75%)`

export function GallerySkeleton() {
  return (
    <div aria-hidden="true" style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px' }}>
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div className="sk" style={{ height: 14, width: 100, margin: '0 auto 12px', borderRadius: 20, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        <div className="sk" style={{ height: 36, width: 280, margin: '0 auto', borderRadius: 12, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="sk" style={{ height: 220, borderRadius: 12, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.08}s` }} />
        ))}
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
