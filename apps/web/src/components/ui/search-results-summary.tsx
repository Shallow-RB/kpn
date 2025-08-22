interface SearchResultsSummaryProps {
  filteredCount: number;
  totalCount: number;
  searchQuery?: string;
  className?: string;
}

export function SearchResultsSummary({
  filteredCount,
  totalCount,
  searchQuery,
  className,
}: SearchResultsSummaryProps) {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground">
        {filteredCount} van {totalCount} klanten
        {searchQuery && ` gevonden voor "${searchQuery}"`}
      </p>
    </div>
  );
}
