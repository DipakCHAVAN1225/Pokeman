import "../components/pokemon.css";
import { useEffect, useState } from "react";
import Pokecard from "./pokecard";

function Pokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=600";

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

  // search functionality here

  const searchPokemon = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(search.toLowerCase())
  );
  console.log(searchPokemon);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-center m-4 font-bold">Loading............</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }
  return (
    <div className="main">
      {/* this is a nav section */}
      <div className="nav h-40 p-2">
        <h1 className="font-sans font-semibold text-center ">
          Lets Catch Pokémon
        </h1>
        <span className="search">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <input
          type="text"
          placeholder="Search Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input "
        ></input>
      </div>
      {/* this is main page where card are shows */}

      <div className="py-5 flex items-center justify-center gap-5 flex-wrap">
        {/* card are shows here */}
        {searchPokemon.map((poke) => {
          return <Pokecard key={poke.id} pokemonda={poke}></Pokecard>;
        })}
      </div>
    </div>
  );
}

export default Pokemon;
