import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { pokemonApi } from '@/services/pokemonApi';
import { Pokemon, PokemonSpecies, EvolutionChain } from '@/types/pokemon';

// Hook para buscar lista de pokémon com paginação infinita
export function usePokemonList(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['pokemon-list', limit],
    queryFn: ({ pageParam = 0 }) => pokemonApi.getPokemonList(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return parseInt(url.searchParams.get('offset') || '0');
    },
    initialPageParam: 0,
  });
}

// Hook para buscar um pokémon específico
export function usePokemon(nameOrId: string | number) {
  return useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => pokemonApi.getPokemon(nameOrId),
    enabled: !!nameOrId,
  });
}

// Hook para buscar espécie do pokémon
export function usePokemonSpecies(nameOrId: string | number) {
  return useQuery({
    queryKey: ['pokemon-species', nameOrId],
    queryFn: () => pokemonApi.getPokemonSpecies(nameOrId),
    enabled: !!nameOrId,
  });
}

// Hook para buscar cadeia evolutiva
export function useEvolutionChain(chainId: number) {
  return useQuery({
    queryKey: ['evolution-chain', chainId],
    queryFn: () => pokemonApi.getEvolutionChain(chainId),
    enabled: !!chainId,
  });
}

// Hook combinado para obter pokémon com detalhes completos
export function usePokemonDetails(nameOrId: string | number) {
  const pokemonQuery = usePokemon(nameOrId);
  const speciesQuery = usePokemonSpecies(nameOrId);
  
  const chainId = speciesQuery.data?.evolution_chain?.url 
    ? pokemonApi.extractIdFromUrl(speciesQuery.data.evolution_chain.url)
    : 0;
    
  const evolutionQuery = useEvolutionChain(chainId);

  return {
    pokemon: pokemonQuery.data,
    species: speciesQuery.data,
    evolutionChain: evolutionQuery.data,
    isLoading: pokemonQuery.isLoading || speciesQuery.isLoading,
    error: pokemonQuery.error || speciesQuery.error || evolutionQuery.error,
  };
}