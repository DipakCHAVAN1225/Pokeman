import "./pokemon.css";
import { useEffect, useState } from "react";
import Pokecard from "./pokecard";

function Pokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [searchFocused, setSearchFocused] = useState(false);

  const API = "https://pokeapi.co/api/v2/pokemon?limit=150";

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const detailedPokemonData = data.results.map(async (curPokemon) => {
        const res = await fetch(curPokemon.url);
        const data = await res.json();
        return data;
      });

      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  // All unique types from fetched pokemon
  const allTypes = [
    "all",
    ...Array.from(
      new Set(pokemon.flatMap((p) => p.types.map((t) => t.type.name)))
    ).sort(),
  ];

  // Search + type filter
  const searchPokemon = pokemon.filter((poke) => {
    const matchName = poke.name.toLowerCase().includes(search.toLowerCase());
    const matchType =
      selectedType === "all" ||
      poke.types.some((t) => t.type.name === selectedType);
    return matchName && matchType;
  });

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="pokeball-loader">
          <div className="ball">
            <div className="ball-top"></div>
            <div className="ball-middle"></div>
            <div className="ball-bottom"></div>
            <div className="ball-center"></div>
          </div>
        </div>
        <h2 className="loading-text">Loading Pokédex...</h2>
        <p className="loading-sub">Catching them all...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-icon">⚠️</div>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <button onClick={fetchPokemon} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="main">

      {/* NAV SECTION */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <h1 className="nav-title">Pokédex</h1>
            <p className="nav-count">{searchPokemon.length} / {pokemon.length} Pokémon</p>
          </div>

          <div className={`search-wrapper ${searchFocused ? "focused" : ""}`}>
            <span className="search-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="input"
            />
          </div>
        </div>

        {/* TYPE FILTER PILLS */}
        <div className="type-filters">
          {allTypes.map((type) => (
            <button
              key={type}
              className={`type-pill type-pill--${type} ${selectedType === type ? "active" : ""}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </nav>

      {/* CARD GRID */}
      <div className="cards-grid">
        {searchPokemon.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p>No Pokémon found for <strong>"{search}"</strong></p>
          </div>
        ) : (
          searchPokemon.map((poke, index) => (
            <Pokecard key={poke.id} pokemonda={poke} index={index} />
          ))
        )}
      </div>
    </div>
  );
}

export default Pokemon;