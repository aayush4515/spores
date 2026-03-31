function PageSkeleton({ cards = 4 }) {
  return (
    <section className="stack-list">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-subtitle" />
      <div className="card-grid">
        {Array.from({ length: cards }).map((_, index) => (
          <article className="card" key={index}>
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line" />
          </article>
        ))}
      </div>
    </section>
  );
}

export default PageSkeleton;
