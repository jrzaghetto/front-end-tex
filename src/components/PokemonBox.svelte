<script>
  import ky from 'ky'
  import DetalhesPokemaos from './DetalhesPokemaos.svelte'

  export let id = 12
  export let pokemon = {}
  $: getPokemon(id)
  export let current = 'bar'

  async function getPokemon(id) {
    const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${id}/`
    const pokemonSpecieURL = `https://pokeapi.co/api/v2/pokemon-species/${id}/`

    const pokemonGeneral = await ky.get(pokemonURL).json()
    const pokemonSpecie = await ky.get(pokemonSpecieURL).json()

    const {
        // id,
        name,
        types,
        sprites,
        abilities,
        stats,
        height,
        weight
      } = pokemonGeneral

      const {
        genera
      } = pokemonSpecie

    const typesTratado = []
    for(var i = 0; i < types.length; i++) {
      typesTratado.push(types[i].type["name"])
    }

    const abilitiesTratado = []
    for(var i = 0; i < abilities.length; i++) {
      abilitiesTratado.push(abilities[i].ability["name"])
    }

    const statsTratado = {}
    for(var i = 0; i < stats.length; i++) {
      statsTratado[stats[i].stat["name"]] = stats[i].base_stat
    }

    const speciesTratado = [genera[7].genus]

    const heightTratado = height / 10

    const weightTratado = weight / 10

    const spriteGrande = sprites.other.dream_world.front_default

    const spriteAnimado = sprites.versions["generation-v"]["black-white"].animated.front_default

    const hp = statsTratado.hp
    const attack = statsTratado.attack
    const defense = statsTratado.defense
    const specialAttack = statsTratado["special-attack"]
    const specialDefense = statsTratado["special-defense"]
    const speed = statsTratado.speed

    
    return pokemon = {
      "nationalN": id,
      "name": name, 
      "hp": hp,
      "attack": attack,
      "defense": defense,
      "specialAttack": specialAttack,
      "specialDefense": specialDefense,
      "speed": speed,
      "type1": typesTratado[0],
      "type2": typesTratado[1],
      "species": speciesTratado, 
      "sprites": sprites,
      "spriteGrande": spriteGrande,
      "spriteAnimado": spriteAnimado,
      "abilities": abilitiesTratado,
      "height": heightTratado,
      "weight": weightTratado
    }
  }
</script>

<style>
  .pokemon-box {
    position: relative;
    display: grid;
    grid-template-areas: 
    "texto-box texto-box imagem-box"
    "tipos-pokemon tipos-pokemon imagem-box"
    ;
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
    cursor:pointer;
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
  }

  .id-pokemon {
    grid-area: id-pokemon;
    margin-left: 5px;
    margin-top:10px;
    font-size: .75em;
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
    background-color:#f42 !important;
  }


  .water {
    background-color:#39f !important;
  }

  .electric {
    background-color:#fc3 !important;
  }

  .grass {
    background-color:#7c5 !important;
  }

  .ice {
    background-color:#6cf !important;
  }

  .fighting {
    background-color:#b54 !important;
  }

  .poison {
    background-color:#a59 !important;
  }

  .ground {
    background-color:#db5 !important;
  }

  .flying {
    background-color:#89f !important;
  }

  .psychic {
    background-color:#f59 !important;
  }

  .bug {
    background-color:#ab2 !important;
  }

  .rock {
    background-color:#ba6 !important;
  }

  .ghost {
    background-color:#66b !important;
  }

  .dragon {
    background-color:#76e !important;
  }

  .dark {
    background-color:#754 !important;
  }

  .steel {
    background-color:#aab !important;
  }

  .fairy {
    background-color:#e9e !important;
  }

  .tipos-pokemon span{
    margin-left: 5px;
    margin-bottom: 10px;
    display: inline-block;
    width: 55px;
    height: 20px;
    margin-bottom: 4px;
    background: #dbdbdb;
    border: 1px solid #a3a3a3;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.2);
    color: #fff;
    font-size: .65rem;
    font-weight: normal;
    line-height: 1.5rem;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    text-transform: uppercase;
    transition: opacity .4s;
  }

</style>


<div class="pokemon-box {current}" on:click>
  <div class="texto-box">
    <span class="id-pokemon">N° {id}</span>
    <span class="nome-pokemon">{pokemon["name"]}</span>
  </div>
  <div class="tipos-pokemon">
    <!-- {#each pokemonTypes as type} -->
    <span class={pokemon.type1}>{pokemon.type1}</span>
    {#if pokemon.type2 != undefined}
    <span class={pokemon.type2}>{pokemon.type2}</span>
    {/if}
    <!-- {/each} -->
  </div>
  <div class="imagem-box">
    <img 
    src={pokemon.spriteAnimado}
    alt={pokemon["name"]}
    height="40px"
    />
  </div>
</div>