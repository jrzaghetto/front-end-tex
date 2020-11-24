<script>
  export let current = "bar";
  export let pokemonId;
  export let idPokemonBox;
  export let pokemonNameBox;
  export let pokemonTypeBox1;
  export let pokemonTypeBox2;
  export let pokemonSpriteAnimadoBox;
  export let excluirPokemon;  
</script>

<style>
  .pokemon-box {
    position: relative;
    display: grid;
    grid-template-areas:
      "texto-box texto-box imagem-box"
      "tipos-pokemon tipos-pokemon imagem-box";
    grid-template-columns: 9fr 1fr;
    justify-items: start;
    height: 80px;
    width: 220px;
    border-radius: 10px;
    background: #fff;
    color: #333;
    box-shadow: 0px 4px 3px -3px rgba(2, 1, 5, 0.2);
    margin-bottom: 15px;
  }

  .pokemon-box:hover {
    cursor: pointer;
  }

  .selecionado {
    background: #000;
  }

  .texto-box {
    grid-area: texto-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .imagem-box {
    grid-area: imagem-box;
    display: flex;
    float: right;
    justify-self: end;
    align-items: center;
    margin-right: 15px;
    width: 47px;
  }

  .id-pokemon {
    grid-area: id-pokemon;
    margin-left: 5px;
    margin-top: 10px;
    font-size: 0.75em;
    font-style: italic;
  }

  .nome-pokemon {
    margin-left: 5px;
    text-transform: capitalize;
    color: #636a9d;
  }

  .normal {
    background-color: #aa9 !important;
  }

  .fire {
    background-color: #f42 !important;
  }

  .water {
    background-color: #39f !important;
  }

  .electric {
    background-color: #fc3 !important;
  }

  .grass {
    background-color: #7c5 !important;
  }

  .ice {
    background-color: #6cf !important;
  }

  .fighting {
    background-color: #b54 !important;
  }

  .poison {
    background-color: #a59 !important;
  }

  .ground {
    background-color: #db5 !important;
  }

  .flying {
    background-color: #89f !important;
  }

  .psychic {
    background-color: #f59 !important;
  }

  .bug {
    background-color: #ab2 !important;
  }

  .rock {
    background-color: #ba6 !important;
  }

  .ghost {
    background-color: #66b !important;
  }

  .dragon {
    background-color: #76e !important;
  }

  .dark {
    background-color: #754 !important;
  }

  .steel {
    background-color: #aab !important;
  }

  .fairy {
    background-color: #e9e !important;
  }

  .tipos-pokemon span {
    margin-left: 5px;
    margin-bottom: 10px;
    display: inline-block;
    width: 55px;
    height: 20px;
    margin-bottom: 4px;
    background: #dbdbdb;
    border: 1px solid #a3a3a3;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 0.65rem;
    font-weight: normal;
    line-height: 1.5rem;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    text-transform: uppercase;
    transition: opacity 0.4s;
  }

  #excluirPokemon {
    margin-top: -38px;
    padding-left: 49px;
    position: absolute;
  }

  .closePokemon:hover {
    color: #000;
    text-decoration: none;
    border: 1px solid rgb(255, 159, 28);;
    background-color: rgb(255, 159, 28);;
  }

  .closePokemon {
    width: 18px;
    cursor: pointer;
    padding-left: 2px;
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    /* text-shadow: 0 1px 0 #fff; */
    opacity: 0.5;
    border: 1px solid rgb(255, 159, 28);;
    border-radius: 50%;
    padding-right: 1px;
    padding-bottom: 2px;
    background-color: rgb(255, 159, 28);;
  }
</style>

<div class="pokemon-box {current}" id={pokemonId} on:click>
  <div class="texto-box">
    <span class="id-pokemon">N° {idPokemonBox}</span>
    <span class="nome-pokemon">{pokemonNameBox}</span>
  </div>
  <div class="tipos-pokemon">
    <span class={pokemonTypeBox1}>{pokemonTypeBox1}</span>
    {#if pokemonTypeBox2 != undefined}
      <span class={pokemonTypeBox2}>{pokemonTypeBox2}</span>
    {/if}
  </div>
  <div class="imagem-box">
    <img src={pokemonSpriteAnimadoBox} alt={pokemonNameBox} height="40px" />
    <div id="excluirPokemon">
      <div class="closePokemon" on:click={excluirPokemon}>x</div>
    </div>
  </div>
</div>
