import React, { createContext, useContext, useMemo, useState } from "react";

type SortBy = "name" | "id";
type Order = "asc" | "desc";

interface SearchState {
  query: string;
  sortBy: SortBy;
  order: Order;
  resultIds: number[]; // current filtered+sorted set
}

interface Ctx extends SearchState {
  setQuery: (q: string) => void;
  setSortBy: (s: SortBy) => void;
  setOrder: (o: Order) => void;
  setResultIds: (ids: number[]) => void;
}

const defaultState: SearchState = { query: "", sortBy: "name", order: "asc", resultIds: [] };

const SearchCtx = createContext<Ctx | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState(defaultState.query);
  const [sortBy, setSortBy] = useState<SortBy>(defaultState.sortBy);
  const [order, setOrder] = useState<Order>(defaultState.order);
  const [resultIds, setResultIds] = useState<number[]>(defaultState.resultIds);

  const value = useMemo(() => ({ query, sortBy, order, resultIds, setQuery, setSortBy, setOrder, setResultIds }), [query, sortBy, order, resultIds]);

  return <SearchCtx.Provider value={value}>{children}</SearchCtx.Provider>;
}

export function useSearchCtx() {
  const v = useContext(SearchCtx);
  if (!v) throw new Error("useSearchCtx must be used inside <SearchProvider>");
  return v;
}
