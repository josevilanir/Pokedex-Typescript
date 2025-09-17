import { useState, useEffect, useRef, useMemo } from 'react';
import { PokemonCard } from './PokemonCard';
import { PokemonDetails } from './PokemonDetails';
import { PokemonTypeFilter } from './PokemonTypeFilter';
import { usePokemonList } from '@/hooks/usePokemon';
import { pokemonApi } from '@/services/pokemonApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';

interface PokemonListProps {
  generationFilter?: number;
  startRange?: number;
  endRange?: number;
}

export function PokemonList({ generationFilter, startRange, endRange }: PokemonListProps = {}) {
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  // ESTADO DA BUSCA
  const [searchTerm, setSearchTerm] = useState('');

  // (mantido) filtro por tipo
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

  useEffect(() => {
    pokemonDataRef.current = pokemonData;
  }, [pokemonData]);

  // Carrega detalhes dos pokémon conforme paginação
  useEffect(() => {
    if (data?.pages) {
      let allPokemon = data.pages.flatMap(page => page.results);

      if (startRange && endRange) {
        allPokemon = allPokemon.filter(pokemon => {
          const pokemonId = parseInt(pokemon.url.split('/').slice(-2, -1)[0]);
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

  // Autocarregar todos de uma geração (quando aplicável)
  useEffect(() => {
    if (generationFilter && startRange && endRange) {
      const totalPokemonNeeded = endRange - startRange + 1;
      const currentPokemonCount = pokemonData.filter(
        p => p.id >= startRange && p.id <= endRange
      ).length;

      if (currentPokemonCount < totalPokemonNeeded && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [generationFilter, startRange, endRange, pokemonData.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // LISTA BÁSICA (nome + id) DIRETO DA API PAGINADA — ideal para busca por nome/número
  const basicList = useMemo(() => {
    const results =
      data?.pages?.flatMap(page =>
        page.results.map((r: { name: string; url: string }) => ({
          name: r.name,
          id: parseInt(r.url.split('/').slice(-2, -1)[0]),
        }))
      ) ?? [];

    // Respeita faixa (geração) se existir
    return results.filter(item => {
      if (startRange && endRange) {
        return item.id >= startRange && item.id <= endRange;
      }
      return true;
    });
  }, [data?.pages, startRange, endRange]);

  // BUSCA: filtra apenas por nome OU número (id) e mostra SOMENTE nomes quando houver termo
  const query = searchTerm.trim().toLowerCase();
  const nameResults = useMemo(() => {
    if (!query) return [];
    return basicList
      .filter(p => p.name.toLowerCase().includes(query) || p.id.toString().includes(query))
      .sort((a, b) => a.id - b.id);
  }, [basicList, query]);

  // Filtro completo (quando não há termo de busca — mantém grid original + filtro por tipo)
  const filteredPokemon = useMemo(() => {
    if (query) return []; // quando pesquisando, não exibimos grid de cards
    return pokemonData.filter(pokemon => {
      if (startRange && endRange) {
        if (pokemon.id < startRange || pokemon.id > endRange) return false;
      }
      const matchesType =
        selectedType === 'all' ||
        pokemon.types.some(t => t.type.name === selectedType);
      return matchesType;
    });
  }, [pokemonData, query, selectedType, startRange, endRange]);

  // Navegação no modal
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
      {/* Barra de busca + filtro por tipo */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8 p-4 bg-card/50 rounded-lg border">
        <div className="relative max-w-md w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou número…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
            aria-label="Campo de busca de Pokémon"
          />
        </div>

        {/* Quando há busca, escondemos o filtro de tipo (foco: nomes) */}
        {!query && (
          <PokemonTypeFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        )}

        {(query || (!query && selectedType !== 'all')) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
            }}
          >
            Limpar
          </Button>
        )}
      </div>

      {/* QUANDO HÁ TERMO: MOSTRAR APENAS A LISTA DE NOMES */}
      {query && (
        <div className="max-w-xl mx-auto">
          {nameResults.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum Pokémon encontrado para “{searchTerm}”.
            </p>
          ) : (
            <ul className="divide-y rounded-md border overflow-hidden">
              {nameResults.map(p => (
                <li
                  key={p.id}
                  className="px-4 py-3 hover:bg-accent cursor-pointer flex items-center justify-between"
                  onClick={() => handlePokemonClick(p.name)}
                >
                  <span className="capitalize">{p.name}</span>
                  <span className="text-muted-foreground">#{p.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* SEM TERMO: GRID ORIGINAL DE CARDS */}
      {!query && (
        <>
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

      {/* Modal de detalhes (abre ao clicar num nome da lista ou num card) */}
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
