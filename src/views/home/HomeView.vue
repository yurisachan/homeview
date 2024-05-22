<template>
  <div class="home">
    <div class="bg-filter" :class="{ active: panelActive }"></div>
    <div class="search-engine-list flex pt-[20%]">
      <div
        class="search-engine"
        v-for="engine in engineList"
        :key="engine.name"
        :class="{ active: activeEngine === engine.name }"
        @click="activeEngine = engine.name"
      >
        <div class="iconfont" v-html="engine.unicode"></div>
      </div>
    </div>

    <div @click="handleClick">
      <el-input
        ref="inputRef"
        class="searh-input"
        :class="{ active: foucsActive }"
        v-model="inputValue"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="setSearch()"
      ></el-input>
    </div>

    <div class="content-panel-wrapper">
      <div class="content-panel" :class="{ 'show-content': panelActive }">
        <div class="search-history-list">
          <div
            class="search-history-item"
            v-for="(item, index) in searchHistory"
            :key="index"
            :title="item"
            @click="setSearch(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <DateView v-show="!panelActive" />
  </div>
</template>

<script setup lang="ts">
import DateView from './components/DateView.vue'
import { computed, onMounted, ref } from 'vue'
import { useKeydown } from '@/hooks/useKeydown'
import { useLocalStorage } from '@/hooks/useStorage'
import type { ElInput } from 'element-plus'

const engineList = [
  {
    name: '谷歌',
    url: 'https://www.google.com/search?q=',
    unicode: '&#xe87a;'
  },
  {
    name: '必应',
    url: 'https://cn.bing.com/search?q=',
    unicode: '&#xe653;'
  },
  {
    name: 'duckduckgo',
    url: 'https://duckduckgo.com/?q=',
    unicode: '&#xeece;'
  },
  {
    name: '百度',
    url: 'https://www.baidu.com/s?wd=',
    unicode: '&#xe6e4;'
  }
]
const inputRef = ref<InstanceType<typeof ElInput>>()
const inputValue = ref('')
const foucsActive = ref(false)
const panelActive = ref(false)
const activeEngine = ref(engineList[0].name)

const [searchHistory, saveLocalSearchHistory] = useLocalStorage('searchHistory', [])

const activeEngineObj = computed(() => {
  return engineList.find((item) => item.name === activeEngine.value)
})
const handleFocus = (e: Event) => {
  console.log('handleFocus')
  foucsActive.value = true
  panelActive.value = true
}
const handleBlur = (e: Event) => {
  //点击输入框，点击面板都不需要收起面板
  console.log('handleBlur')
  // const target = document.querySelector('.show-content')
  // if (target) {
  //   e.preventDefault()
  //   return
  // }

  foucsActive.value = false
  panelActive.value = false
}
const handleClick = (e: Event) => {
  e.preventDefault()
  foucs()
}
const setHistory = (keyword: string) => {
  if (searchHistory.value.includes(keyword)) return
  searchHistory.value.push(keyword)
  saveLocalSearchHistory()
}
const setSearch = (keyword: string = inputValue.value) => {
  if (keyword) {
    setHistory(keyword)
    window.open(`${activeEngineObj.value?.url}${keyword}`)
  }
}
const foucs = async () => {
  await inputRef.value?.focus()
}
const nextEngine = () => {
  const index = engineList.findIndex((item) => item.name === activeEngine.value)
  if (index === engineList.length - 1) {
    activeEngine.value = engineList[0].name
  } else {
    activeEngine.value = engineList[index + 1].name
  }
}

useKeydown('Tab', () => {
  nextEngine()
  foucs()
})
onMounted(() => {
  foucs()
})
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  width: 100vw;
  background-image: url('@/assets/bg.jpg');
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .bg-filter {
    transition: all 0.3s linear;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    &.active {
      backdrop-filter: blur(15px);
    }
  }
  .search-engine-list {
    margin-bottom: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    .search-engine {
      margin-right: 6px;
      width: 52px;
      height: 28px;
      line-height: 28px;
      border-radius: 15px;
      text-align: center;
      cursor: pointer;
      transition: 0.5s;
      position: relative;
      .iconfont {
        overflow: hidden;
        background: hsla(0, 0%, 100%, 0.05);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        border-top: 1px solid hsla(0, 0%, 100%, 0.1);
        border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
        border-radius: 30px;
        color: #fff;
        z-index: 1;
        font-weight: 400;
        letter-spacing: 1px;
        text-align: center;
        text-decoration: none;
        backdrop-filter: blur(15px);
        font-family: iconfont !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.15));
          transform: skewX(30deg) translateX(0);
          transition: 0.5s;
        }
      }
      &.active {
        width: 80px;
        &::before,
        &::after {
          height: 50%;
          left: 10%;
          width: 80%;
          border-radius: 15px;
        }
        .iconfont::before {
          background: hsla(0, 0%, 100%, 0.15);
          transform: skewX(30deg) translateX(210%);
        }
      }
      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 40%;
        transform: translateX(0);
        width: 20%;
        height: 10px;
        background: #12c2e9;
        border-radius: 5px;
        box-shadow:
          0 0 5px #12c2e9,
          0 0 15px #12c2e9,
          0 0 30px #12c2e9,
          0 0 60px #12c2e9;
        transition-delay: 0.3s;
        transition: 0.5s;
        top: 0;
        z-index: -1;
      }
      &::before {
        top: auto;
        bottom: 0;
      }
      &:nth-child(2) {
        &::before,
        &::after {
          background: #c471ed;
          box-shadow:
            0 0 5px #c471ed,
            0 0 15px #c471ed,
            0 0 30px #c471ed,
            0 0 60px #c471ed;
        }
      }
      &:nth-child(3) {
        &::before,
        &::after {
          background: #ffb800;
          box-shadow:
            0 0 5px #ffb800,
            0 0 15px #ffb800,
            0 0 30px #ffb800,
            0 0 60px #ffb800;
        }
      }
      &:nth-child(4) {
        &::before,
        &::after {
          background: #f64f59;
          box-shadow:
            0 0 5px #f64f59,
            0 0 15px #f64f59,
            0 0 30px #f64f59,
            0 0 60px #f64f59;
        }
      }
    }
  }

  .searh-input {
    width: 420px;
    transition: all 0.3s ease;
    border-radius: 48px;
    position: relative;
    overflow: hidden;
    margin-bottom: 30px;
    font-size: 14px;

    &::after {
      filter: blur(20px);
      background: hsla(0, 0%, 100%, 0.3);
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
    ::v-deep .el-input__wrapper {
      background-color: transparent;
      box-shadow: none;
      .el-input__inner {
        position: relative;
        z-index: 1;
        text-align: center;
        font-size: 18px;
        color: hsla(0, 0%, 100%, 0.7);
        height: 48px;
        background: transparent;
        border: none;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
        border-radius: 4px;
      }
    }

    &:hover,
    &.active {
      cursor: text;
      width: 600px;
      background: hsla(0, 0%, 100%, 0.8);
      ::v-deep .el-input__wrapper .el-input__inner {
        color: #222;
      }
    }
  }
  .content-panel-wrapper {
    display: flex;
    justify-content: center;
    text-align: center;
    color: hsla(0, 0%, 100%, 0.9);
    .content-panel {
      background: hsla(0, 0%, 100%, 0.3);
      backdrop-filter: blur(15px);
      width: 600px;
      border-radius: 12px;
      padding: 12px 15px;
      font-size: 13px;
      transition: all 0.3s ease;
      visibility: hidden;
      opacity: 0;
      height: 0;
      &.show-content {
        height: 400px;
        visibility: inherit;
        opacity: 1;
      }
      .search-history-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        .search-history-item {
          max-width: 160px;
          min-width: 50px;
          padding: 3px 6px;
          background: hsla(0, 0%, 100%, 0.15);
          border-radius: 3px;
          cursor: pointer;
          margin: 4px 0;
          margin-right: 15px;
          transition: background-color 0.3s ease;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
