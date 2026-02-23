export function InfoBlocks() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Block 1 — horizontal rectangle */}
            <div className="w-full aspect-[2/1] rounded-2xl border border-border bg-card" />
            {/* Blocks 2 & 3 — two squares */}
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square rounded-2xl border border-border bg-card" />
              <div className="aspect-square rounded-2xl border border-border bg-card" />
            </div>
          </div>
          {/* Block 4 — large square on the right */}
          <div className="aspect-square rounded-2xl border border-border bg-card" />
        </div>
      </div>
    </section>
  );
}
