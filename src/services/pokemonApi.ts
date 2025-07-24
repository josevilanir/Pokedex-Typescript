import {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
} from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  // Buscar lista de pokémon
  async getPokemonList(offset = 0, limit = 20): Promise<PokemonListResponse> {
    const response = await fetch(
      `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return response.json();
  },

  // Buscar pokémon específico
  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${nameOrId}`);
    }
    return response.json();
  },

  // Buscar espécie do pokémon (para descrição e cadeia evolutiva)
  async getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon species: ${nameOrId}`);
    }
    return response.json();
  },

  // Buscar cadeia evolutiva
  async getEvolutionChain(id: number): Promise<EvolutionChain> {
    const response = await fetch(`${BASE_URL}/evolution-chain/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch evolution chain: ${id}`);
    }
    return response.json();
  },

  // Extrair ID da URL
  extractIdFromUrl(url: string): number {
    const match = url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1], 10) : 0;
  },
};