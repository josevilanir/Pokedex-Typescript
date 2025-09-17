import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { BasicPokemon } from '@/hooks/usePokemonSearch';

interface PokemonSearchProps {
  query: string;
  setQuery: (v: string) => void;
  clear: () => void;
  results: BasicPokemon[];
  onSelect: (name: string) => void;
}

export function PokemonSearch({
  query,
  setQuery,
  clear,
  results,
  onSelect,
}: PokemonSearchProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center p-4 bg-card/50 rounded-lg border">
        <div className="relative max-w-md w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou número…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 w-full"
            aria-label="Campo de busca de Pokémon"
          />
        </div>

        {(query.length > 0) && (
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
          >
            Limpar
          </Button>
        )}
      </div>

      {query.length > 0 && (
        <div className="max-w-xl mx-auto">
          {results.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum Pokémon encontrado para “{query}”.
            </p>
          ) : (
            <ul className="divide-y rounded-md border overflow-hidden">
              {results.map(p => (
                <li
                  key={p.id}
                  className="px-4 py-3 hover:bg-accent cursor-pointer flex items-center justify-between"
                  onClick={() => onSelect(p.name)}
                >
                  <span className="capitalize">{p.name}</span>
                  <span className="text-muted-foreground">#{p.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
