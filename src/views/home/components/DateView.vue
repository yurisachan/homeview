<script lang="ts">
export default { name: 'DateViewView' }
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDebouncedEventListener } from '@/hooks/useEventListener'

const Month = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
]
const Week = ['一', '二', '三', '四', '五', '六', '日']
const Day = [
  [...new Array(7).fill(''), 1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
  [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, ...new Array(3).fill('')],
  [29, 30, 31, ...new Array(10).fill('')]
]
const activeMonth = ref(0)
const getCurrentDate = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const day = currentDate.getDate()
  return {
    currentDate,
    year,
    month,
    day
  }
}
const activeDay = ref(getCurrentDate().day)
const getMonthHole = () => {
  const { year } = getCurrentDate()
  //计算每个月第一天和最后一天
  const MonthHole = Month.map((_, index) => {
    const FirstDay = new Date(year, index, 1)
    const LastDay = new Date(year, index + 1, 0)
    //分别星期几
    const FirstDayWeek = FirstDay.getDay()
    const LastDayWeek = LastDay.getDay()
    const FirstDayLocal = FirstDay.getDate()
    const LastDayLocal = LastDay.getDate()
    //计算每个月的天数
    //从第一天和最后一天前后分别填充空
    const Hole = [
      ...new Array(FirstDayWeek - 1 < 0 ? 6 : FirstDayWeek - 1).fill(''),
      ...Array.from({ length: LastDayLocal }, (_, i) => i + 1),
      ...new Array(7 - LastDayWeek > 6 ? 0 : 7 - LastDayWeek).fill('')
    ]
    // console.log(
    //   `月:${index + 1} 第一天:${FirstDayLocal} 最后一天:${LastDayLocal} 第一天星期:${FirstDayWeek} 最后一天星期:${LastDayWeek} `,
    //   Hole
    // )
    return Hole
  })

  return MonthHole
}
const holes = ref(getMonthHole())
const firstOneRectLeft = ref(0)
const secondOneRectLeft = ref(0)

const setActiveMonth = (index: number) => {
  activeMonth.value = index
  setWeekPosition(index)
}
const activeMonthHole = computed(() => holes.value[activeMonth.value])

const getWeekPosition = () => {
  console.log('resize')

  const [firstOne, secondOne] = document.querySelectorAll('.day-target')
  const firstOneRect = firstOne.getBoundingClientRect()
  const secondOneRect = secondOne.getBoundingClientRect()
  firstOneRectLeft.value = firstOneRect.left
  secondOneRectLeft.value = secondOneRect.left
}
useDebouncedEventListener(window, 'resize', getWeekPosition)

const setWeekPosition = (month) => {
  //一个月第一天是周一选用第二行的1号
  const { year } = getCurrentDate()
  const FirstDay = new Date(year, month, 1)
  const FirstDayWeek = FirstDay.getDay()
  //需要移动的目标
  const target = document.querySelector('.week-list')

  const weekItems = document.querySelectorAll('.week-item')
  const weekItem = weekItems[FirstDayWeek === 0 ? 6 : FirstDayWeek - 1]
  const weekItemRect = weekItem.getBoundingClientRect()

  let x,
    y = 0
  if (FirstDayWeek === 1) {
    x = weekItemRect.left - secondOneRectLeft.value
    y = -42 //一行高度
  }
  //否则选用第一行的1号
  else {
    //找到1号和周几的位置
    x = weekItemRect.left - firstOneRectLeft.value
  }
  target.style.transform = `translate(${x}px,${y}px)`
}

const handleMouseover = (e: any) => {
  const { month } = e.target.dataset
  if (month !== undefined) {
    setActiveMonth(month)
  } else {
    setCurrentMonth()
  }
}

const handleMouseleave = () => {
  setCurrentMonth()
}

const setCurrentMonth = () => {
  const { month } = getCurrentDate()
  setActiveMonth(month)
}
const ifCurrentMonth = computed(() => getCurrentDate().month === activeMonth.value)

onMounted(() => {
  getWeekPosition()
  setCurrentMonth()
  console.log(activeMonthHole.value, activeMonth.value)
})
</script>

<template>
  <div class="DateView-container text-white text-center w-[1000px]">
    <div class="flex pb-15" v-on:mouseover="handleMouseover" v-on:mouseleave="handleMouseleave">
      <div
        class="text-2xl flex-1 cursor-pointer hover:text-red-500"
        :class="{ 'text-red-500': activeMonth === index }"
        v-for="(month, index) in Month"
        :data-month="index"
        :key="month"
      >
        {{ month }}
      </div>
    </div>
    <div class="mask w-[350px] absolute left-[50%] translate-x-[-50%] rounded bg-card">
      <div
        class="week flex text-[20px] h-9 relative mb-2 after:content-[''] after:w-[100%] after:h-[1px] after:bg-black after:absolute after:bottom-0 after:left-0"
      >
        <div class="week-item flex-1" v-for="(week, index) in Week" :key="index">
          {{ week }}
        </div>
      </div>
      <div class="holes flex flex-wrap">
        <div class="w-[50px] h-9 mb-[6px]" v-for="(day, index) in activeMonthHole" :key="index">
          <div
            class="hole w-9 h-9 rounded-full mx-auto transition-[background-color]"
            :class="{ ' bg-black ': day }"
          ></div>
        </div>
      </div>
    </div>
    <div class="week-list mt-[44px] mx-auto transition-all">
      <div class="flex cursor-default" v-for="(row, index) in Day" :key="index">
        <div
          class="w-[50px] h-9 leading-9 text-[18px] mb-[6px]"
          v-for="(day, subIndex) in row"
          :key="subIndex"
          :class="{ 'day-target': day === 1, 'text-red-500': activeDay === day && ifCurrentMonth }"
        >
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>
