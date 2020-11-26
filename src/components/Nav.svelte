<script>
  import ModalBoxDetalhesPokemon from "./ModalBoxDetalhesPokemon.svelte";
  import { pokemonsList } from "./PesquisaDinamica.svelte";
  let src = "images/logo.svg";

  import { getPokemon } from "./GetPokemonFunction.svelte";

  let pokemon = getPokemon(1);

  function setData() {
    var data = document.getElementById("pokemonPesquisa");
    var dataValor = document.getElementById("pokemonPesquisa").value;
    if (dataValor.length > 1) {
      data.setAttribute("list", "pokemaos");
    } else {
      document.getElementById("pokemonPesquisa").removeAttribute("list");
    }
  }

  function tiraDataList() {
    document.getElementById("pokemonPesquisa").removeAttribute("list");
  }

  async function abrirDetalhes() {
    if (pokemonsList.indexOf(document.getElementById("pokemonPesquisa").value) == -1) {
      document.getElementById("pokemonPesquisa").value = ""
    } else {
    window.location.href = "#Loading";
    pokemon = await getPokemon(document.getElementById("pokemonPesquisa").value);
    window.location.href = "#PokemonDetalhes";
    
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
  }

  .topnav {
    overflow: hidden;
    background-color: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .topnav img {
    justify-items: start;
    padding-left: 10px;
    padding-top: 6px;
  }

  .topnav .search-container {
    float: right;
    background-color: #abcdfa;
  }

  .topnav input[type="text"] {
    padding: 6px;
    margin-top: 8px;
    font-size: 17px;
    border: none;
    background: transparent;
    color: white;
    float: left;
    margin-left: 10px;
    letter-spacing: 0.3px;
    font-weight: 300;
    width: 85%;
  }

  .topnav .search-container button {
    float: left;
    padding: 13px 13px;
    margin-top: 10px;
    margin-left: 20px;
    background: transparent;
    font-size: 17px;
    border: none;
    cursor: pointer;
    filter: invert(1);
    background-image: url("/images/search.svg");
  }

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: white;
    opacity: 1; /* Firefox */
  }

  :focus {
    outline: none;
  }
</style>

<div class="topnav">
  <img {src} alt="asd" width="80px" />
  <div class="search-container">
    <form>
      <button type="submit" />
      <input
        class="effect-1"
        type="text"
        placeholder="Pesquise um PokeMão..."
        name="pokemonPesquisa"
        id="pokemonPesquisa"
        on:click={setData}
        on:keypress={setData}
        on:blur={tiraDataList}
        on:change={abrirDetalhes} />

      <datalist id="pokemaos">
        {#each pokemonsList as poke}
          <option value={poke} />
        {/each}
      </datalist>
    </form>
  </div>
</div>

{#await pokemon}
  <h1>Loading ...</h1>
{:then pokemon}
  <ModalBoxDetalhesPokemon
    on:click
    pokemonSriteGrande={pokemon.spriteGrande}
    pokemonName={pokemon.name}
    pokemonNationalN={pokemon.nationalN}
    pokemonType={pokemon.type}
    pokemonSpecies={pokemon.species}
    pokemonHeight={pokemon.height}
    pokemonWeight={pokemon.weight}
    pokemonHp={pokemon.hp}
    pokemonAttack={pokemon.attack}
    pokemonDefense={pokemon.defense}
    pokemonSpecialAttack={pokemon.specialAttack}
    pokemonSpecialDefense={pokemon.specialDefense}
    pokemonSpeed={pokemon.speed} />
{/await}