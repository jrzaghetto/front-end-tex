<script>
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
  .grid-inline {
    display: grid;
    grid-template-columns: 1fr 3fr;
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
    "status-pokemon status-pokemon"
    ;
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
    font-size: .875rem;
    font-weight: normal;
    text-align: right;
  }

  .titulos-status {
    color: #737373;
    font-size: .875rem;
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
    min-width: 230px;
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
    height: .75rem;
    border-radius: 4px;
    background-color: #a3a3a3;
    border: 1px solid #737373;
    border-color: rgba(0,0,0,0.15);
    margin-left: 15px;
  }

  .capitalize {
    text-transform: capitalize;
  }
</style>

<div class="pokemon-detalhes">
  <div class="imagem-pokemon">
    <img 
    src={pokemonSriteGrande}
    alt={pokemonName}
    height="230"
    style="max-width: 230px;"/>
  </div>
  <div class="detalhes-pokemon">
    <div class="titulo-pokemon capitalize">
      <h2>{pokemonName}</h2>
    </div>
    <div class="infos">
      <div class="grid-inline">
        <div class="titulos">
          <span>National N</span>
        </div>
        <div class="textos">
          <span>{pokemonNationalN}</span>
        </div>
      </div>
      <div class="grid-inline">
        <div class="titulos">
          <span>Type</span>
        </div>
        <div class="textos capitalize">
          <span>{pokemonType}</span>
        </div>
      </div>
      <div class="grid-inline">
        <div class="titulos">
          <span>Species</span>
        </div>
        <div class="textos">
          <span>{pokemonSpecies}</span>
        </div>
      </div>
      <div class="grid-inline">
        <div class="titulos">
          <span>Height</span>
        </div>
        <div class="textos">
          <span>{pokemonHeight} m</span>
        </div>
      </div>
      <div class="grid-inline">
        <div class="titulos">
          <span>Weight</span>
        </div>
        <div class="textos">
          <span>{pokemonWeight} kg</span>
        </div>
      </div>
    </div>
  </div>
  <div class="status-pokemon">
    <div class="titulo-pokemon">
      <h2>Status Básicos</h2>
    </div>
    <div class="infos">
      <div class="grid-inline-tres">
        <div class="titulos-status">
          <span>HP</span>
        </div>
        <div class="textos-status">
          <span>{pokemonHp}</span>
        </div>
        <div class="barra" style="width: {(pokemonHp / 180) * 100}%">
          <span></span>
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status">
          <span>Attack</span>
        </div>
        <div class="textos-status">
          <span>{pokemonAttack}</span>
        </div>
        <div class="barra" style="width: {(pokemonAttack / 180) * 100}%">
          <span></span>
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status">
          <span>Defense</span>
        </div>
        <div class="textos-status">
          <span>{pokemonDefense}</span>
        </div>
        <div class="barra" style="width: {(pokemonDefense / 180) * 100}%">
          <span></span>
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status">
          <span>Special-Attack</span>
        </div>
        <div class="textos-status">
          <span>{pokemonSpecialAttack}</span>
        </div>
        <div class="barra" style="width: {(pokemonSpecialAttack / 180) * 100}%">
          <span></span>
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status">
          <span>Special-Defense</span>
        </div>
        <div class="textos-status">
          <span>{pokemonSpecialDefense}</span>
        </div>
        <div class="barra" style="width: {(pokemonSpecialDefense / 180) * 100}%">
          <span></span>
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status">
          <span>Speed</span>
        </div>
        <div class="textos-status">
          <span>{pokemonSpeed}</span>
        </div>
        <div class="barra" style="width: {(pokemonSpeed / 180) * 100}%">
          <span></span>
        </div>
      </div>
    </div>
  </div>
</div>
