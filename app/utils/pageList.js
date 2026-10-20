// Page buttons for a pager: first two, last two, and the current page ±1, with "…" for gaps.
// pageList(5, 10) -> [1, 2, "…", 4, 5, 6, "…", 9, 10]
export const pageList = (page, count) => {
  const keep = [1, 2, page - 1, page, page + 1, count - 1, count];
  const pages = [...new Set(keep)]
    .filter((p) => p >= 1 && p <= count)
    .sort((a, b) => a - b);
  // a gap of exactly one page shows that page instead of "…"
  return pages.flatMap((p, i) =>
    i === 0 || p - pages[i - 1] === 1
      ? [p]
      : p - pages[i - 1] === 2
        ? [p - 1, p]
        : ["…", p],
  );
};
