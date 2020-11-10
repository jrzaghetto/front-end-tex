<script>
  let src = "images/logo.svg";

  function alerta() {
    alert("Não implementei a pesquisa :(");
  }
</script>

<style>
  * {
    box-sizing: border-box;
  }

  .topnav {
    overflow: hidden;
    background-color: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .topnav img {
    justify-items: start;
    padding-left: 10px;
    padding-top: 6px;
  }

  .topnav .search-container {
    float: right;
    background-color: #abcdfa;
  }

  .topnav input[type="text"] {
    padding: 6px;
    margin-top: 8px;
    font-size: 17px;
    border: none;
    background: transparent;
    color: white;
    float: left;
    margin-left: 10px;
    letter-spacing: 0.3px;
    font-weight: 300;
    width: 85%;
  }

  .topnav .search-container button {
    float: left;
    padding: 13px 13px;
    margin-top: 10px;
    margin-left: 20px;
    background: transparent;
    font-size: 17px;
    border: none;
    cursor: pointer;
    filter: invert(1);
    background-image: url("/images/search.svg");
  }

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: white;
    opacity: 1; /* Firefox */
  }

  :focus {
    outline: none;
  }
</style>

<div class="topnav">
  <img {src} alt="asd" width="80px" />
  <div class="search-container">
    <form on:click={alerta}>
      <button type="submit" />
      <input
        class="effect-1"
        type="text"
        placeholder="Pesquise um PokeMão..."
        name="search" />
    </form>
  </div>
</div>
