<script>
  export let nomeModal;
  export let nomePokemon;

</script>

<style>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: rgba(0,0,0,0.8);
  z-index: 99999;
  opacity:0;
  -webkit-transition: opacity 400ms ease-in;
  -moz-transition: opacity 400ms ease-in;
  transition: opacity 400ms ease-in;
  pointer-events: none;
  cursor: auto;
}

.modal:target {
  opacity: 1;
  pointer-events: auto;
}

.tes {
  width: 400px;
  margin: 10% auto;
  padding: 15px 20px;
  background: #fff;
  border-radius: 15px;
}

a {
  text-decoration:none; 
}

.nomePokemon {
  text-transform: capitalize;
}

</style>

<a href="#Close{nomeModal}"><slot name="linkModal"></slot></a>

<div id="Close{nomeModal}" class="modal">
  <div class="tes">
  <h2>Quer mesmo excluir <span class="nomePokemon">{nomePokemon}</span>?</h2>
  <button on:click><a href="#fecharModal" title="Fechar" class="fecharModal">Sim</a></button>
  <button><a href="#fecharModal" title="Fechar" class="fecharModal">Não</a></button>
</div>
</div>