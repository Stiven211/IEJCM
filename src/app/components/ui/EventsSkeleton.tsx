const shimmerBackground = `linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.10) 75%)`

export function EventsSkeleton() {
  return (
    <div aria-hidden="true" style={{ padding: '36px 24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
        <div className="sk" style={{ height: 40, width: 280, borderRadius: 10, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        <div className="sk" style={{ height: 40, width: 180, borderRadius: 10, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="sk" style={{ height: 210, width: '100%', backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.12}s` }} />
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="sk" style={{ height: 16, width: '80%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
              <div className="sk" style={{ height: 14, width: '60%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '0.1s' }} />
              <div className="sk" style={{ height: 38, width: '100%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '0.2s' }} />
            </div>
          </div>
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
