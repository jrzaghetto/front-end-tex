<script>
	import { onMount } from "svelte";
	import AddPoke from "./components/AddPoke.svelte";
	import Nav from "./components/Nav.svelte";
	import Conteudo from "./components/Conteudo.svelte";
	import DetalhesPokemaos from "./components/DetalhesPokemaos.svelte";
	import PokemonBox from "./components/PokemonBox.svelte";
	import { getPokemon } from "./components/GetPokemonFunction.svelte";
	import Loading from "./components/Loading.svelte";

	function excluirPokemon(nPoke) {
		pokesSelecionados.splice(nPoke, 1);
		pokesSelecionados = [...pokesSelecionados];
	}

	async function addPoke() {
		if (pokesSelecionados.length > 4) {
			alert("É permitido no máximo 5 PokeMãos na Seleção. Exclua algum!");
			document.getElementById("pesquisa").value = "";
		} else {
		console.log(pokesSelecionados)
		pokesSelecionados = [...pokesSelecionados, await getPokemon(document.getElementById("test").value)]
		return pokesSelecionados
	}
	}

	function checarPokemon() {
		if (pokesSelecionados.length == 0) {
			return (pokemon = {
				spriteGrande: "images/pergunta.png",
				name: "Quem é este Pokemon?",
				nationalN: "???",
				type: "???",
				species: "???",
				height: "???",
				weight: "???",
				hp: "10",
				attack: "10",
				defense: "10",
				specialAttack: "10",
				specialDefense: "10",
				speed: "170",
			});
		}
	}

	let pokemon = getPokemon(1);

	async function changePokes() {
		if (pokesSelecionados.length > 4) {
			alert("É permitido no máximo 5 PokeMãos na Seleção. Exclua algum!");
			document.getElementById("pesquisa").value = "";
		} else if (document.getElementById("pesquisa").value > 649) {
			alert("Acima do 649 os pokemons estão com problemas nas imagens");
			document.getElementById("pesquisa").value = "";
		} else if (document.getElementById("pesquisa").value < 1) {
			alert("Coloque números entre 1 e 649");
			document.getElementById("pesquisa").value = "";
		} else if (
			Number.isInteger(parseInt(document.getElementById("pesquisa").value)) !=
			true
		) {
			alert("Coloque apenas o número, não implementei com string :)");
			document.getElementById("pesquisa").value = "";
		} else {
			window.location.href = "#Loading";
			let novoPoke = await getPokemon(
				document.getElementById("pesquisa").value
			);
			document.getElementById("pesquisa").value = "";
			pokesSelecionados = [...pokesSelecionados, novoPoke];
			pokemon = novoPoke;
			window.location.href = "#";
			return pokesSelecionados;
		}
	}

	let pokesSelecionados = [];

	onMount(async () => {
		pokesSelecionados = [await getPokemon(1)];
	});
</script>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	#container {
		max-width: 780px;
		margin: 0 auto;
	}

	h5 {
		justify-items: start;
		text-align: left;
		font-weight: 300;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<main>
	<!-- <h1>PokeMãos!</h1> -->
	<img src="images/pokemaos.png" alt="logo" />
	<p>--</p>

	<div id="container">
		<Nav on:click={addPoke}/>

		<AddPoke on:submit={changePokes} />

		<Conteudo>
			<div>
				<h5>Lista de Pokemãos</h5>
				{#each pokesSelecionados as poke, index}
					<PokemonBox
						pokemonId={`PokePos ` + index}
						idPokemonBox={poke.nationalN}
						pokemonNameBox={poke.name}
						pokemonTypeBox1={poke.type1}
						pokemonTypeBox2={poke.type2}
						pokemonSpriteAnimadoBox={poke.spriteAnimado}
						on:click={async () => (pokemon = await getPokemon(poke.nationalN))}
						excluirPokemon={() => (excluirPokemon(index), checarPokemon())}
						nomeModal={poke.name} />
				{/each}
			</div>

			<div>
				<h5>Detalhes</h5>
				{#await pokemon}
					<h1>Loading ...</h1>
				{:then pokemon}
					<DetalhesPokemaos
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
			</div>
		</Conteudo>
		<Loading />
	</div>
</main>
