<script setup lang="ts">
  import down from './components/down.vue'
</script>

<template>
  <div>
    <!-- expand 展开类名 -->
    <!-- disabled 禁用框类名 -->
    <div class="select" id="selProvince" data-tip="省份">
      <div class="title">
        <span>请选择省份</span>
        <down />
      </div>
      <ul class="options"></ul>
    </div>

    <div class="select" id="selCity" data-tip="市区">
      <div class="title">
        <span>请选择市区</span>
        <down />
      </div>
      <ul class="options"></ul>
    </div>

    <div class="select" id="selArea" data-tip="区县">
      <div class="title">
        <span>请选择区县</span>
        <down />
      </div>
      <ul class="options"></ul>
    </div>
  </div>
</template>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
}

.select {
  display: inline-block;
  margin: 0 5px;
  position: relative;
  white-space: nowrap;

  color: #666;
}

.title {
  min-width: 150px;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.title .iconfont {
  font-size: 10px;
  transition: all .25s;
}

.options {
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-height: 300px;
  min-width: 100%;
  position: absolute;
  padding: 10px;
  top: 50px;
  background-color: #fff;

  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(auto-fit, 20px);
  /* 行间距 */
  row-gap: 6px;
  column-gap: 26px;
  /* 每一项左对齐 默认拉伸 */
  justify-items: left;
  box-shadow: 0 0 3px rgba(0, 0, 0, .5);

  transform: scaleY(0);
  opacity: 0;
  transition: all .23s;
  transform-origin: 10px -10px;
}

.options li {
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 5px;
}

.options li.active {
  background-color: #eec05a;
}

.options::before {
  content: "";
  width: 10px;
  height: 10px;
  position: absolute;
  left: 70px;
  top: -6px;
  border: 1px solid #ccc;
  transform: rotate(45deg);
  border-bottom: none;
  border-right: none;
  background-color: #fff;
}

.select.expand .options {
  transform: scaleY(1);
  opacity: 1;
}

.select.expand .iconfont {
  transform: rotate(180deg);
}

.select.disabled {
  color: #ccc;
}

.select.disabled .title {
  cursor: not-allowed;
}
</style>