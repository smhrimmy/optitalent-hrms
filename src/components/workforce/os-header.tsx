export function OsHeader({
  kicker,
  title,
  lede,
}: {
  kicker?: string;
  title: string;
  lede: string;
}) {
  return (
    <div className="space-y-2 max-w-3xl">
      {kicker ? (
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{kicker}</p>
      ) : null}
      <h1 className="text-3xl font-bold font-headline">{title}</h1>
      <p className="text-muted-foreground">{lede}</p>
    </div>
  );
}
