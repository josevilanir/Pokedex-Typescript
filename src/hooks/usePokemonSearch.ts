import { useMemo, useState } from 'react';

type PageResult = { name: string; url: string };

export interface BasicPokemon {
  id: number;
  name: string;
}

interface UsePokemonSearchParams {
  pages?: { results: PageResult[] }[];
  startRange?: number;
  endRange?: number;
}

export function usePokemonSearch({ pages, startRange, endRange }: UsePokemonSearchParams) {
  const [query, setQuery] = useState('');

  // lista básica (id + name) extraída da paginação
  const basicList: BasicPokemon[] = useMemo(() => {
    const flat = pages?.flatMap(page =>
      page.results.map((r) => ({
        name: r.name,
        id: parseInt(r.url.split('/').slice(-2, -1)[0], 10),
      }))
    ) ?? [];

    if (startRange && endRange) {
      return flat.filter(p => p.id >= startRange && p.id <= endRange);
    }
    return flat;
  }, [pages, startRange, endRange]);

  const trimmed = query.trim().toLowerCase();
  const hasQuery = trimmed.length > 0;

  const results = useMemo<BasicPokemon[]>(() => {
    if (!hasQuery) return [];
    return basicList
      .filter(p => p.name.toLowerCase().includes(trimmed) || p.id.toString().includes(trimmed))
      .sort((a, b) => a.id - b.id);
  }, [basicList, hasQuery, trimmed]);

  const clear = () => setQuery('');

  return {
    query,
    setQuery,
    clear,
    hasQuery,
    results,
    basicList, // exposto caso queira analytics/autocomplete depois
  };
}
