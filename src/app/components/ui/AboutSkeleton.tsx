const shimmerBackground = `linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.10) 75%)`

export function AboutSkeleton() {
  return (
    <section aria-hidden="true" style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="sk" style={{ height: 14, width: 120, borderRadius: 20, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
          <div className="sk" style={{ height: 36, width: '90%', borderRadius: 12, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
          <div className="sk" style={{ height: 16, width: '100%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '0.1s' }} />
          <div className="sk" style={{ height: 16, width: '95%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '0.15s' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div className="sk" style={{ height: 36, width: 36, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.1}s` }} />
                <div className="sk" style={{ height: 14, width: '70%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.1 + 0.05}s` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="sk" style={{ height: 340, borderRadius: 16, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
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
