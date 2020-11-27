<script context="module">
	import ky from "ky";

	export async function getPokemon(qq) {
		const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${qq}/`;

		const pokemonGeneral = await ky.get(pokemonURL).json();

		const {
			id,
			name,
			types,
			sprites,
			abilities,
			stats,
			height,
			weight,
			species
		} = pokemonGeneral;

		const pokemonSpecie = await ky.get(species.url).json();

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

		return {
			nationalN: id,
			name: name,
			hp: hp,
			attack: attack,
			defense: defense,
			specialAttack: specialAttack,
			specialDefense: specialDefense,
			speed: speed,
			type1: typesTratado[0],
			type2: typesTratado[1],
			type: typesTratado,
			species: speciesTratado,
			sprites: sprites,
			spriteGrande: spriteGrande,
			spriteAnimado: spriteAnimado,
			abilities: abilitiesTratado,
			height: heightTratado,
			weight: weightTratado,
		};
	}
</script>
