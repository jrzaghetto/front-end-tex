<style>
	* {box-sizing: border-box;}

.pesquisa {
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
}

.pesquisa .search-container {
  margin-top: 40px;
  color: #bee3db;
}

.pesquisa input[type=text] {
  padding: 6px;
  margin-top: 8px;
  font-size: 20px;
  border: none;
  background: transparent;
  color: black;
  float: left;
  margin-left: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  width: 100%;
  font-weight: 300;
}

.pesquisa .search-container button {
  background: transparent;
  font-size: 17px;
  border: none;
  cursor: pointer;
  padding: 0px;
  position: absolute;
  margin-left: -50px;
}

svg {
  height: 35px;
  width: 35px;
}

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #c5c5c5;
  opacity: 1; /* Firefox */
}

:focus{
  outline: none;
}

@media screen and (max-width: 600px) {
  .pesquisa .search-container {
    float: none;
  }
  .pesquisa input[type=text], .pesquisa .search-container button {
    float: none;
    display: block;
    text-align: left;
    width: 100%;
    margin: 0;
    padding: 14px;
  }
  .pesquisa input[type=text] {
    border: 1px solid #ccc;  
  }

}
</style>

<script>
</script>



<div class="pesquisa">
  <div class="search-container">
    <form on:submit|preventDefault>
      <input id="pesquisa" class="effect-1" type="text" placeholder="Adicione um PokeMão..." name="search">
      <button type="submit"><svg>
        <use xlink:href="#bike" />
      </svg>
    </button>
    </form>
  </div>
</div>

<div>
  
</div>


<svg display="none">
  <symbol width="40" height="40" fill="#ff9f1c" viewBox="0 0 24 24" id="bike">
<path d="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"/>
</symbol>
</svg>