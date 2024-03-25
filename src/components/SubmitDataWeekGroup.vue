<template>
	<div id="submit-data-week-group" @open="open_submit_data_modal">
		<!-- 주차 끝 표시 -->
		<div class="end-of-week-divider divider">
			<div class="divider-line"></div>
			<span class="divider-text">{{ props.item.week_number }}주차 끝</span>
		</div>

		<!-- 주차 요약 정보 영역 -->
		<div class="week-summary"></div>

		<!-- 일별 카드  -->
		<div class="card-container">
			<submit-data-day-card
				v-for="(day, index) in props.item.item_groupby_day"
				:key="day.day_th"
				:user="user"
				:item="day"
				:index="index"
				@open="open_submit_data_modal"
			>
			</submit-data-day-card>
		</div>

		<!-- 주차 시작 표시  -->
		<div class="start-of-week-divider divider">
			<span class="divider-text">{{ props.item.week_number }}주차 시작</span>
			<div class="divider-line"></div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import SubmitDataDayCard from '@/components/SubmitDataDayCard.vue';

const props = defineProps({
	user: Object,
	item: Object,
	index: Number,
});
const emits = defineEmits(['open']);

// const person_pass = computed(() => Object.keys(props.item.submit_data));
// const person_fail = computed(() => {
// 	if (person_pass.value.length === 0)
// 		return props.user.map(item => item.boj_id);

// 	const user_boj_id = props.user.map(item => item.boj_id);
// 	const result = user_boj_id.filter(item => !person_pass.value.includes(item));

// 	return result;
// });

function get_name_by_boj_id(boj_id) {
	const idx = props.user.findIndex(item => item.boj_id === boj_id);
	if (idx === -1) return 'Unknown';
	return props.user[idx].name;
}

function open_submit_data_modal(day_index) {
	emits('open', { week_index: props.index, day_index });
}
</script>

<style lang="scss" scoped>
#submit-data-week-group {
}
.divider {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8px 0 16px 0;
	.divider-line {
		width: 100%;
		height: 1px;
		background-color: #9b9b9b;
	}
	.divider-text {
		padding: 8px;
		font-size: 1.2rem;
	}
}
.card-container {
	display: flex;
	flex-direction: column-reverse;
	flex-wrap: wrap;
}
</style>
