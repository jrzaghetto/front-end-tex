<script>
  import DetalhesPokemaos from "./DetalhesPokemaos.svelte";

  export let pokemon;

  export let pokemonSriteGrande;
  export let pokemonName;
  export let pokemonNationalN;
  export let pokemonType;
  export let pokemonSpecies;
  export let pokemonHeight;
  export let pokemonWeight;
  export let pokemonHp;
  export let pokemonAttack;
  export let pokemonDefense;
  export let pokemonSpecialAttack;
  export let pokemonSpecialDefense;
  export let pokemonSpeed;
</script>

<style>
  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: rgba(0, 0, 0, 0.8);
    z-index: 99999;
    opacity: 0;
    -webkit-transition: opacity 100ms ease-in;
    -moz-transition: opacity 100ms ease-in;
    transition: opacity 100ms ease-in;
    pointer-events: none;
    cursor: auto;
  }

  .modal:target {
    opacity: 1;
    pointer-events: auto;
  }

  .tes {
    width: 520px;
    margin: 10% auto;
    padding: 15px 20px;
    background: #fff;
    border-radius: 15px;
  }

  a {
    text-decoration: none;
  }
</style>

<div id="PokemonDetalhes" class="modal">
  <div class="tes">
    {#await pokemon}
      <h1>Loading ...</h1>
    {:then pokemon}
      <DetalhesPokemaos
        {pokemonSriteGrande}
        {pokemonName}
        {pokemonNationalN}
        {pokemonType}
        {pokemonSpecies}
        {pokemonHeight}
        {pokemonWeight}
        {pokemonHp}
        {pokemonAttack}
        {pokemonDefense}
        {pokemonSpecialAttack}
        {pokemonSpecialDefense}
        {pokemonSpeed} />
    {/await}

    <h1>Adicionar a sua lista?</h1>

    <button on:click><a
        href="#fecharModal"
        title="Fechar"
        class="fecharModal">Sim</a></button>
    <button><a
        href="#fecharModal"
        title="Fechar"
        class="fecharModal">Não</a></button>
  </div>
</div>
