<script setup lang="ts">
import { onMounted, ref } from 'vue'
import down from './components/down.vue'
import { provinceData } from './utils/province.ts'
import { fillSelect, setTitleText } from "./utils/format.ts";
import type { AreaData, ExtendedHTMLElement } from './type/index'


const props = defineProps({
  areaDataList: {
    type: Array as () => AreaData[],
    default: provinceData
  }
})

const provinceRef = ref<ExtendedHTMLElement>()
const cityRef = ref<ExtendedHTMLElement>()
const areaRef = ref<ExtendedHTMLElement>()

function init () {
  fillSelect(provinceRef.value!, props.areaDataList)
  fillSelect(cityRef.value!, [])
  fillSelect(areaRef.value!, [])

  regCommonEvent(provinceRef.value!)
  regCommonEvent(cityRef.value!)
  regCommonEvent(areaRef.value!)

  regProvinceEvent()
  regCityEvent()
}

onMounted(() => {
  init()
})

/**
 * 注册公共的事件处理
 * @param {HTMLElement} select 下拉框dom元素
 */
function regCommonEvent (select: HTMLElement) {
  // 1.title点击事件 - 打开下拉框
  const titleDom = select.querySelector('.title')
  if(!titleDom) {
    console.error('titleDom is null')
    return
  }
  titleDom.addEventListener('click', () => {
    // 禁用状态下无法操作
    if(select.classList.contains('disabled')) return

    // 清除所有下拉框的下拉状态
    const selectDomList = document.querySelectorAll('.select.expand')
    for (const sel of selectDomList) {
      if(sel !== select) {
        sel.classList.remove('expand')
      }
    }
    // 切换当前的下拉状态即可
    select.classList.toggle('expand')
  })

  // 2.ul点击事件 - 下拉框内容选择
  const ulDom = select.querySelector('.options')
  if(!ulDom) {
    console.error('ulDom is null')
    return;
  }

  ulDom.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if(!target) return;
    if(target.tagName !== 'LI') return

    // 获取到之前选中的li元素
    const beforeActiveLi = select.querySelector('li.active')
    // 当刚打开下拉框的时候 此前都未选中 所以得做一个判定
    beforeActiveLi && beforeActiveLi.classList.remove('active')
    target.classList.add('active')

    // 设置当前选中的值
    setTitleText(select, target.textContent || '')
    select.classList.remove('expand')
  })
}

/**
 * 注册省份的特殊点击事件
 */
function regProvinceEvent () {
  const ul = provinceRef.value!.querySelector('.options')
  if(!ul) {
    console.error('ulDom is null')
    return;
  }
  ul.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if(target?.tagName !== 'LI') return

    // 填充城市
    const pr = provinceRef.value?.datas?.find((item: AreaData) => item.label === target.textContent)
    if (pr) {
      fillSelect(cityRef.value!, pr.children || [])
      // 填充地区
      fillSelect(areaRef.value!, [])
    }
  })
}

/**
 * 注册城市的特殊点击事件
 */
function regCityEvent () {
  const ul = cityRef.value!.querySelector('.options')
  if(!ul) {
    console.error('ulDom is null')
    return;
  }
  ul.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if(target?.tagName !== 'LI') return

    // 填充城市
    const city = cityRef.value?.datas?.find((item: AreaData) => item.label === target.textContent)
    if (city) {
      fillSelect(areaRef.value!, city.children || [])
    }
  })
}

</script>

<template>
  <div>
    <!-- expand 展开类名 -->
    <!-- disabled 禁用框类名 -->
    <div
        class="select"
        id="selProvince"
        data-tip="省份"
        ref="provinceRef"
    >
      <div class="title">
        <span>请选择省份</span>
        <down />
      </div>
      <ul class="options"></ul>
    </div>

    <div
        class="select"
        id="selCity"
        data-tip="市区"
        ref="cityRef"
    >
      <div class="title">
        <span>请选择市区</span>
        <down />
      </div>
      <ul class="options"></ul>
    </div>

    <div
        class="select"
        id="selArea"
        data-tip="区县"
        ref="areaRef"
    >
      <div class="title">
        <span>请选择区县</span>
        <down />
      </div>
      <ul class="options"></ul>
    </div>
  </div>
</template>

<style scoped>
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
