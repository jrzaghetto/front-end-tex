<script>
  import ky from "ky";
  import PokemonBox from "./PokemonBox.svelte";

  let id = 1;
  let pokemon = {};
  $: getPokemon(id);

  export let pokes = [1];

  async function getPokemon(id) {
    const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const pokemonSpecieURL = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;

    const pokemonGeneral = await ky.get(pokemonURL).json();
    const pokemonSpecie = await ky.get(pokemonSpecieURL).json();

    const {
      // id,
      name,
      types,
      sprites,
      abilities,
      stats,
      height,
      weight,
    } = pokemonGeneral;

    const { genera } = pokemonSpecie;

    const typesTratado = [];
    for (var i = 0; i < types.length; i++) {
      typesTratado.push(types[i].type["name"]);
    }

    const abilitiesTratado = [];
    for (var i = 0; i < abilities.length; i++) {
      abilitiesTratado.push(abilities[i].ability["name"]);
    }

    const statsTratado = {};
    for (var i = 0; i < stats.length; i++) {
      statsTratado[stats[i].stat["name"]] = stats[i].base_stat;
    }

    const speciesTratado = [genera[7].genus];

    const heightTratado = height / 10;

    const weightTratado = weight / 10;

    const spriteGrande = sprites.other.dream_world.front_default;

    const spriteAnimado =
      sprites.versions["generation-v"]["black-white"].animated.front_default;

    const hp = statsTratado.hp;
    const attack = statsTratado.attack;
    const defense = statsTratado.defense;
    const specialAttack = statsTratado["special-attack"];
    const specialDefense = statsTratado["special-defense"];
    const speed = statsTratado.speed;

    return (pokemon = {
      nationalN: id,
      name: name,
      hp: hp,
      attack: attack,
      defense: defense,
      specialAttack: specialAttack,
      specialDefense: specialDefense,
      speed: speed,
      type: typesTratado,
      species: speciesTratado,
      sprites: sprites,
      spriteGrande: spriteGrande,
      spriteAnimado: spriteAnimado,
      abilities: abilitiesTratado,
      height: heightTratado,
      weight: weightTratado,
    });
  }
</script>

<style>
  .conteudo {
    display: grid;
    grid-template-columns: 1fr 2fr;
    margin: 10px 0px 0px 10px;
    justify-items: start;
  }

  .conteudo h5 {
    justify-items: start;
    text-align: left;
    font-weight: 300;
  }

  .grid-inline {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid #ccc;
    padding: 5px 0px 5px 0px;
    margin-left: 20px;
  }

  .grid-inline-tres {
    display: grid;
    grid-template-columns: 2fr 1fr 6fr;
    border-top: 1px solid #ccc;
    padding: 5px 0px 5px 0px;
    margin-left: 20px;
    align-items: center;
  }

  .pokemon-detalhes {
    display: grid;
    grid-template-areas:
      "imagem-pokemon detalhes-pokemon"
      "status-pokemon status-pokemon";
    margin: 10px 0px 0px 0px;
    justify-items: start;
    width: 100%;
  }

  .detalhes-pokemon {
    grid-area: detalhes-pokemon;
    width: 100%;
  }

  .infos {
    display: grid;
    flex-direction: row;
  }

  .titulos {
    color: #737373;
    font-size: 0.875rem;
    font-weight: normal;
    text-align: right;
  }

  .titulos-status {
    color: #737373;
    font-size: 0.875rem;
    font-weight: normal;
    text-align: center;
  }

  .textos {
    text-align: left;
    margin-left: 20px;
  }

  .textos-status {
    text-align: center;
  }

  .imagem-pokemon {
    grid-area: imagem-pokemon;
    min-width: 240px;
  }

  .status-pokemon {
    grid-area: status-pokemon;
    width: 100%;
  }

  .status-pokemon h2 {
    margin-bottom: 5px;
  }

  .barra {
    background-color: #ff7f0f !important;
    height: 0.75rem;
    border-radius: 4px;
    background-color: #a3a3a3;
    border: 1px solid #737373;
    border-color: rgba(0, 0, 0, 0.15);
    margin-left: 15px;
  }

  .capitalize {
    text-transform: capitalize;
  }
</style>

<div class="conteudo">
  <div>
    <h5>Lista de Pokemãos</h5>
    {#each pokes as poke}
      <PokemonBox id={poke} on:click={() => getPokemon(poke)} />
    {/each}
  </div>

  <div>
    <h5>Detalhes</h5>
    <div class="pokemon-detalhes">
      <div class="imagem-pokemon">
        <img
          src={pokemon.spriteGrande}
          alt="bulbasaur"
          height="230"
          style="max-width: 230px;" />
      </div>
      <div class="detalhes-pokemon">
        <div class="titulo-pokemon capitalize">
          <h2>{pokemon.name}</h2>
        </div>
        <div class="infos">
          <div class="grid-inline">
            <div class="titulos"><span>National N</span></div>
            <div class="textos"><span>{pokemon.nationalN}</span></div>
          </div>
          <div class="grid-inline">
            <div class="titulos"><span>Type</span></div>
            <div class="textos capitalize"><span>{pokemon.type}</span></div>
          </div>
          <div class="grid-inline">
            <div class="titulos"><span>Species</span></div>
            <div class="textos"><span>{pokemon.species}</span></div>
          </div>
          <div class="grid-inline">
            <div class="titulos"><span>Height</span></div>
            <div class="textos"><span>{pokemon.height} m</span></div>
          </div>
          <div class="grid-inline">
            <div class="titulos"><span>Weight</span></div>
            <div class="textos"><span>{pokemon.weight} kg</span></div>
          </div>
        </div>
      </div>
      <div class="status-pokemon">
        <div class="titulo-pokemon">
          <h2>Status Básicos</h2>
        </div>
        <div class="infos">
          <div class="grid-inline-tres">
            <div class="titulos-status"><span>HP</span></div>
            <div class="textos-status"><span>{pokemon.hp}</span></div>
            <div class="barra" style="width: {(pokemon.hp / 180) * 100}%">
              <span />
            </div>
          </div>
          <div class="grid-inline-tres">
            <div class="titulos-status"><span>Attack</span></div>
            <div class="textos-status"><span>{pokemon.attack}</span></div>
            <div class="barra" style="width: {(pokemon.attack / 180) * 100}%">
              <span />
            </div>
          </div>
          <div class="grid-inline-tres">
            <div class="titulos-status"><span>Defense</span></div>
            <div class="textos-status"><span>{pokemon.defense}</span></div>
            <div class="barra" style="width: {(pokemon.defense / 180) * 100}%">
              <span />
            </div>
          </div>
          <div class="grid-inline-tres">
            <div class="titulos-status"><span>Special-Attack</span></div>
            <div class="textos-status">
              <span>{pokemon.specialAttack}</span>
            </div>
            <div
              class="barra"
              style="width: {(pokemon.specialAttack / 180) * 100}%">
              <span />
            </div>
          </div>
          <div class="grid-inline-tres">
            <div class="titulos-status"><span>Special-Defense</span></div>
            <div class="textos-status">
              <span>{pokemon.specialDefense}</span>
            </div>
            <div
              class="barra"
              style="width: {(pokemon.specialDefense / 180) * 100}%">
              <span />
            </div>
          </div>
          <div class="grid-inline-tres">
            <div class="titulos-status"><span>Speed</span></div>
            <div class="textos-status"><span>{pokemon.speed}</span></div>
            <div class="barra" style="width: {(pokemon.speed / 180) * 100}%">
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
