import { useEffect, useRef, useState, useMemo } from 'react';
import { PokemonCard } from './PokemonCard';
import { PokemonDetails } from './PokemonDetails';
import { PokemonTypeFilter } from './PokemonTypeFilter';
import { usePokemonList } from '@/hooks/usePokemon';
import { pokemonApi } from '@/services/pokemonApi';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { usePokemonSearch } from '@/hooks/usePokemonSearch';
import { PokemonSearch } from './PokemonSearch';

interface PokemonListProps {
  generationFilter?: number;
  startRange?: number;
  endRange?: number;
}

export function PokemonList({ generationFilter, startRange, endRange }: PokemonListProps = {}) {
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('all');

  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const pokemonDataRef = useRef<Pokemon[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = usePokemonList(20);

  // —— sincroniza ref
  useEffect(() => {
    pokemonDataRef.current = pokemonData;
  }, [pokemonData]);

  // —— busca detalhes conforme paginação
  useEffect(() => {
    if (data?.pages) {
      let allPokemon = data.pages.flatMap(page => page.results);

      if (startRange && endRange) {
        allPokemon = allPokemon.filter(pokemon => {
          const pokemonId = parseInt(pokemon.url.split('/').slice(-2, -1)[0], 10);
          return pokemonId >= startRange && pokemonId <= endRange;
        });
      }

      const newPokemon = allPokemon.filter(
        p => !pokemonDataRef.current.some(existing => existing.name === p.name)
      );

      if (newPokemon.length > 0) {
        Promise.all(newPokemon.map(p => pokemonApi.getPokemon(p.name)))
          .then(newPokemonDetails => setPokemonData(prev => [...prev, ...newPokemonDetails]));
      }
    }
  }, [data?.pages?.length, startRange, endRange]);

  // —— autoload para geração
  useEffect(() => {
    if (generationFilter && startRange && endRange) {
      const total = endRange - startRange + 1;
      const current = pokemonData.filter(p => p.id >= startRange && p.id <= endRange).length;

      if (current < total && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [generationFilter, startRange, endRange, pokemonData.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // —— HOOK DE BUSCA (estado + resultados)
  const { query, setQuery, clear, hasQuery, results } = usePokemonSearch({
    pages: data?.pages,
    startRange,
    endRange,
  });

  // —— filtragem por tipo apenas quando NÃO há busca
  const filteredPokemon = useMemo(() => {
    if (hasQuery) return [];
    return pokemonData.filter(pokemon => {
      if (startRange && endRange) {
        if (pokemon.id < startRange || pokemon.id > endRange) return false;
      }
      const matchesType =
        selectedType === 'all' ||
        pokemon.types.some(t => t.type.name === selectedType);
      return matchesType;
    });
  }, [pokemonData, hasQuery, selectedType, startRange, endRange]);

  // —— navegação modal
  const handlePokemonClick = (pokemonName: string) => setSelectedPokemon(pokemonName);

  const getCurrentPokemonIndex = () =>
    selectedPokemon ? filteredPokemon.findIndex(p => p.name === selectedPokemon) : -1;

  const handleNavigatePrevious = () => {
    const idx = getCurrentPokemonIndex();
    if (idx > 0) setSelectedPokemon(filteredPokemon[idx - 1].name);
  };

  const handleNavigateNext = () => {
    const idx = getCurrentPokemonIndex();
    if (idx >= 0 && idx < filteredPokemon.length - 1)
      setSelectedPokemon(filteredPokemon[idx + 1].name);
  };

  const canNavigatePrevious = getCurrentPokemonIndex() > 0;
  const canNavigateNext = (() => {
    const idx = getCurrentPokemonIndex();
    return idx >= 0 && idx < filteredPokemon.length - 1;
  })();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-lg text-red-500">Falha ao carregar a lista de Pokémon.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (isLoading && pokemonData.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando Pokémon...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Busca (quando há termo, ela própria exibe a lista de nomes) */}
      <PokemonSearch
        query={query}
        setQuery={setQuery}
        clear={clear}
        results={results}
        onSelect={handlePokemonClick}
      />

      {/* Sem termo de busca: filtro por tipo + grid */}
      {!hasQuery && (
        <>
          <div className="flex items-center justify-center mb-6">
            <PokemonTypeFilter
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => handlePokemonClick(pokemon.name)}
              />
            ))}
          </div>

          {!startRange && !endRange && hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Carregando…
                  </>
                ) : (
                  'Carregar mais'
                )}
              </Button>
            </div>
          )}

          {selectedType !== 'all' && filteredPokemon.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum Pokémon encontrado com os filtros aplicados.
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal de detalhes */}
      {selectedPokemon && (
        <PokemonDetails
          pokemonName={selectedPokemon}
          isOpen={!!selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onPokemonClick={handlePokemonClick}
          onNavigatePrevious={handleNavigatePrevious}
          onNavigateNext={handleNavigateNext}
          canNavigatePrevious={canNavigatePrevious}
          canNavigateNext={canNavigateNext}
        />
      )}
    </div>
  );
}
