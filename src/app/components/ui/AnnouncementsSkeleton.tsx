const shimmerBackground = `linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.10) 75%)`

export function AnnouncementsSkeleton() {
  return (
    <div aria-hidden="true" style={{ padding: 'clamp(48px, 7vw, 80px) 24px', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <div className="sk" style={{ height: 14, width: 120, borderRadius: 20, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', marginBottom: 12 }} />
          <div className="sk" style={{ height: 28, width: 200, borderRadius: 12, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ backgroundColor: '#F8F8F8', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="sk" style={{ height: 12, width: 100, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
              <div className="sk" style={{ height: 16, width: '90%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '0.1s' }} />
              <div className="sk" style={{ height: 14, width: '100%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '0.2s' }} />
              <div className="sk" style={{ height: 14, width: '60%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '0.3s' }} />
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
    </div>
  )
}
