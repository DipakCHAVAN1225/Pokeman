import "./pokemon.css";
function Pokecard({ pokemonda }) {
  return (
    <div className="card-container w-1/5  bg-white">
      <div className="card">
        <img src={pokemonda.sprites.other.dream_world.front_default}></img>
      </div>
      <div className="text flex items-center justify-center flex-col">
        <h2 className="font-bold text-2xl mb-2">{pokemonda.name}</h2>
        <p className="bg-green-500 text-white w-40 text-center font-bold rounded-full">
          {pokemonda.types.map((currType) => currType.type.name).join(", ")}
        </p>
      </div>
      <div className="data mx-2 my-4">
        <div className="info">
          <span>
            <strong>Height: </strong>
            {pokemonda.height}
          </span>
          <span>
            <strong>Weight: </strong>
            {pokemonda.weight}
          </span>
          <span
            className={
              pokemonda.stats[5].base_stat > 70
                ? "text-red-600"
                : "text-green-700"
            }
          >
            <strong>Speed: </strong>
            {pokemonda.stats[5].base_stat}
          </span>
        </div>
        <div className="info">
          <span>
            <strong>Experience: </strong>
            {pokemonda.base_experience}
          </span>
          <span>
            <strong>Attack: </strong>
            {pokemonda.stats[3].base_stat}
          </span>
          <span>
            <strong>Abilities: </strong>
            {pokemonda.abilities[0].ability.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Pokecard;
