<script>
  export let nomeModal;

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
  border-radius: 15px;
}

h2 {
  color: white;
}

a {
  text-decoration:none; 
}

</style>

<div id="Loading" class="modal">
  <div class="tes">
  <h2>Carregando...</h2>
  <img src="images/pokemon.webp" alt="loading"/>
</div>
</div>