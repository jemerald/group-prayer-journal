// a little function to help us with reordering the result
export function reorderArray<TElement>(
  list: TElement[],
  startIndex: number,
  endIndex: number
): TElement[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  if (removed) {
    result.splice(endIndex, 0, removed);
  }

  return result;
}
