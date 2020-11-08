<script>
import AddPoke from "./components/AddPoke.svelte";
import ListaPokemaos from "./components/ListaPokemaos.svelte";
import Nav from "./components/Nav.svelte";
	let name = 'World';
	let pokesSelecionados = [1]

	function changePokes() {
		if (document.getElementById("pesquisa").value > 649) {
			alert('Acima do 649 os pokemons estão com problemas nas imagens')
			document.getElementById("pesquisa").value = ''
		} else if (document.getElementById("pesquisa").value < 1) {
			alert('Coloque números entre 1 e 649')
			document.getElementById("pesquisa").value = ''
		} else if (Number.isInteger(parseInt(document.getElementById("pesquisa").value)) != true) {
			alert('Coloque apenas o número, não implementei com string :)')
			document.getElementById("pesquisa").value = ''
		} else {
		pokesSelecionados = [...pokesSelecionados, document.getElementById("pesquisa").value]
		document.getElementById("pesquisa").value = ''
		return pokesSelecionados
		}
  }
</script>



<main>
	<!-- <h1>PokeMãos!</h1> -->
	<img src="images/pokemaos.png" alt="logo">
	<p>--</p>

	<div id="container">
		<Nav />
		<AddPoke on:submit={changePokes}/>
		<ListaPokemaos pokes={pokesSelecionados}/>
	</div>

</main>

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

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>