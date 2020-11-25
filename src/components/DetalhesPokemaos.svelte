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

  let calculaValor = function (valor) {
    return (valor / 180) * 100;
  };

  let calculaNv = function (valor) {
    if (valor < 33) {
      return 1;
    } else if (valor < 49) {
      return 2;
    } else if (valor < 65) {
      return 3;
    } else if (valor < 89) {
      return 4;
    } else {
      return 5;
    }
  };
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
    min-width: 230px;
  }

  .status-pokemon {
    grid-area: status-pokemon;
    width: 100%;
  }

  .status-pokemon h2 {
    margin-bottom: 5px;
  }

  .nv1 {
    background-color: #ff7f0f !important;
    height: 0.75rem;
    border-radius: 4px;
    background-color: #a3a3a3;
    border: 1px solid #737373;
    border-color: rgba(0, 0, 0, 0.15);
    margin-left: 15px;
  }

  .nv1 > span {
    display: block;
    height: 100%;
    -webkit-border-top-right-radius: 8px;
    -webkit-border-bottom-right-radius: 8px;
    -moz-border-radius-topright: 8px;
    -moz-border-radius-bottomright: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    -webkit-border-top-left-radius: 20px;
    -webkit-border-bottom-left-radius: 20px;
    -moz-border-radius-topleft: 20px;
    -moz-border-radius-bottomleft: 20px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: #ff7f0f;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0, #ff7f0f),
      color-stop(1, #ff7f0f)
    );
    background-image: -moz-linear-gradient(
      center bottom,
      #ff7f0f 37%,
      #ff7f0f 69%
    );
    -webkit-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
  }

  .nv2 {
    background-color: #ffdd57 !important;
    height: 0.75rem;
    border-radius: 4px;
    background-color: #a3a3a3;
    border: 1px solid #737373;
    border-color: rgba(0, 0, 0, 0.15);
    margin-left: 15px;
  }

  .nv2 > span {
    display: block;
    height: 100%;
    -webkit-border-top-right-radius: 8px;
    -webkit-border-bottom-right-radius: 8px;
    -moz-border-radius-topright: 8px;
    -moz-border-radius-bottomright: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    -webkit-border-top-left-radius: 20px;
    -webkit-border-bottom-left-radius: 20px;
    -moz-border-radius-topleft: 20px;
    -moz-border-radius-bottomleft: 20px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: #ffdd57;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0, #ffdd57),
      color-stop(1, #ffdd57)
    );
    background-image: -moz-linear-gradient(
      center bottom,
      #ffdd57 37%,
      #ffdd57 69%
    );
    -webkit-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
  }

  .nv3 {
    background-color: #a0e515 !important;
    height: 0.75rem;
    border-radius: 4px;
    background-color: #a3a3a3;
    border: 1px solid #737373;
    border-color: rgba(0, 0, 0, 0.15);
    margin-left: 15px;
  }

  .nv3 > span {
    display: block;
    height: 100%;
    -webkit-border-top-right-radius: 8px;
    -webkit-border-bottom-right-radius: 8px;
    -moz-border-radius-topright: 8px;
    -moz-border-radius-bottomright: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    -webkit-border-top-left-radius: 20px;
    -webkit-border-bottom-left-radius: 20px;
    -moz-border-radius-topleft: 20px;
    -moz-border-radius-bottomleft: 20px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: #a0e515;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0, #a0e515),
      color-stop(1, #a0e515)
    );
    background-image: -moz-linear-gradient(
      center bottom,
      #a0e515 37%,
      #a0e515 69%
    );
    -webkit-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
  }

  .nv4 {
    background-color: #23cd5e !important;
    height: 0.75rem;
    border-radius: 4px;
    background-color: #a3a3a3;
    border: 1px solid #737373;
    border-color: rgba(0, 0, 0, 0.15);
    margin-left: 15px;
  }

  .nv4 > span {
    display: block;
    height: 100%;
    -webkit-border-top-right-radius: 8px;
    -webkit-border-bottom-right-radius: 8px;
    -moz-border-radius-topright: 8px;
    -moz-border-radius-bottomright: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    -webkit-border-top-left-radius: 20px;
    -webkit-border-bottom-left-radius: 20px;
    -moz-border-radius-topleft: 20px;
    -moz-border-radius-bottomleft: 20px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: #23cd5e;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0, #23cd5e),
      color-stop(1, #23cd5e)
    );
    background-image: -moz-linear-gradient(
      center bottom,
      #23cd5e 37%,
      #23cd5e 69%
    );
    -webkit-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
  }

  .nv5 {
    background-color: #00c2b8 !important;
    height: 0.75rem;
    border-radius: 4px;
    background-color: #a3a3a3;
    border: 1px solid #737373;
    border-color: rgba(0, 0, 0, 0.15);
    margin-left: 15px;
  }

  .nv5 > span {
    display: block;
    height: 100%;
    -webkit-border-top-right-radius: 8px;
    -webkit-border-bottom-right-radius: 8px;
    -moz-border-radius-topright: 8px;
    -moz-border-radius-bottomright: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    -webkit-border-top-left-radius: 20px;
    -webkit-border-bottom-left-radius: 20px;
    -moz-border-radius-topleft: 20px;
    -moz-border-radius-bottomleft: 20px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: #00c2b8;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0, #00c2b8),
      color-stop(1, #00c2b8)
    );
    background-image: -moz-linear-gradient(
      center bottom,
      #00c2b8 37%,
      #00c2b8 69%
    );
    -webkit-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
  }

  .barra > span:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: -webkit-gradient(
      linear,
      0 0,
      100% 100%,
      color-stop(0.25, rgba(255, 255, 255, 0.2)),
      color-stop(0.25, transparent),
      color-stop(0.5, transparent),
      color-stop(0.5, rgba(255, 255, 255, 0.2)),
      color-stop(0.75, rgba(255, 255, 255, 0.2)),
      color-stop(0.75, transparent),
      to(transparent)
    );

    background-image: -moz-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );

    z-index: 1;
    -webkit-background-size: 50px 50px;
    -moz-background-size: 50px 50px;
    -webkit-animation: move 6s linear infinite;
    -webkit-border-top-right-radius: 8px;
    -webkit-border-bottom-right-radius: 8px;
    -moz-border-radius-topright: 8px;
    -moz-border-radius-bottomright: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    -webkit-border-top-left-radius: 20px;
    -webkit-border-bottom-left-radius: 20px;
    -moz-border-radius-topleft: 20px;
    -moz-border-radius-bottomleft: 20px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    overflow: hidden;
  }

  @-webkit-keyframes move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 50px 50px;
    }
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
      style="max-width: 230px;" />
  </div>
  <div class="detalhes-pokemon">
    <div class="titulo-pokemon capitalize">
      <h2>{pokemonName}</h2>
    </div>
    <div class="infos">
      <div class="grid-inline">
        <div class="titulos"><span>National N</span></div>
        <div class="textos"><span>{pokemonNationalN}</span></div>
      </div>
      <div class="grid-inline">
        <div class="titulos"><span>Type</span></div>
        <div class="textos capitalize"><span>{pokemonType}</span></div>
      </div>
      <div class="grid-inline">
        <div class="titulos"><span>Species</span></div>
        <div class="textos"><span>{pokemonSpecies}</span></div>
      </div>
      <div class="grid-inline">
        <div class="titulos"><span>Height</span></div>
        <div class="textos"><span>{pokemonHeight} m</span></div>
      </div>
      <div class="grid-inline">
        <div class="titulos"><span>Weight</span></div>
        <div class="textos"><span>{pokemonWeight} kg</span></div>
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
        <div class="textos-status"><span>{pokemonHp}</span></div>
        <div
          class="barra nv{calculaNv(calculaValor(pokemonHp))}"
          style="width: {(pokemonHp / 180) * 100}%">
          <span />
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status"><span>Attack</span></div>
        <div class="textos-status"><span>{pokemonAttack}</span></div>
        <div
          class="barra nv{calculaNv(calculaValor(pokemonAttack))}"
          style="width: {(pokemonAttack / 180) * 100}%">
          <span />
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status"><span>Defense</span></div>
        <div class="textos-status"><span>{pokemonDefense}</span></div>
        <div
          class="barra nv{calculaNv(calculaValor(pokemonDefense))}"
          style="width: {(pokemonDefense / 180) * 100}%">
          <span />
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status"><span>Special-Attack</span></div>
        <div class="textos-status"><span>{pokemonSpecialAttack}</span></div>
        <div
          class="barra nv{calculaNv(calculaValor(pokemonSpecialAttack))}"
          style="width: {(pokemonSpecialAttack / 180) * 100}%">
          <span />
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status"><span>Special-Defense</span></div>
        <div class="textos-status"><span>{pokemonSpecialDefense}</span></div>
        <div
          class="barra nv{calculaNv(calculaValor(pokemonSpecialDefense))}"
          style="width: {(pokemonSpecialDefense / 180) * 100}%">
          <span />
        </div>
      </div>
      <div class="grid-inline-tres">
        <div class="titulos-status"><span>Speed</span></div>
        <div class="textos-status"><span>{pokemonSpeed}</span></div>
        <div
          class="barra nv{calculaNv(calculaValor(pokemonSpeed))}"
          style="width: {(pokemonSpeed / 180) * 100}%">
          <span />
        </div>
      </div>
    </div>
  </div>
</div>
