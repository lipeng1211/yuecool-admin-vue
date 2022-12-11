<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
<style>
  /*  k_line  是不换行 */

  .k_line tr td .cell {
    -webkit-line-clamp: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    white-space: normal;
  }

  .back {
    margin-top: 25px;
  }

  .k_line tr td .cell:hover {
    -webkit-line-clamp: 2;
    overflow: auto;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    white-space: normal;
  }



  /* ------- */

  .k_mtp {
    margin-top: 20px;
  }

  .k_mtp>button {
    width: 120px;
  }

 .input {
    /* width: 60px; */
    padding: 0 5px;
    height: 28px;
    font-size: 12px
  }

.paySearch{
 color: #018EF8;
 font-size: 14px;
 margin-top: 20px;

}

</style>
