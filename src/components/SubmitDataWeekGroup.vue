<template>
	<div id="submit-data-week-group" @open="open_submit_data_modal">
		<!-- 주차 끝 표시 -->
		<div class="end-of-week-divider divider">
			<div class="divider-line"></div>
			<span class="divider-text">{{ props.item.week_number }}주차 끝</span>
		</div>

		<!-- 주차 요약 정보 영역 -->
		<div class="week-summary">
			<div
				class="person"
				:class="[
					item.fail > 2 ? 'person-died' : '',
					item.pass >= 5 ? 'person-survived' : '',
				]"
				v-for="item in summmary_data"
				:key="item.boj_id"
			>
				<span class="person-submit-cnt">{{ item.submit_cnt }}</span>
				<span class="person-name">{{ get_name_by_boj_id(item.boj_id) }}</span>
				<span> {{ item.pass }} / {{ item.fail }}</span>
			</div>
		</div>

		<!-- 일별 카드  -->
		<div class="card-container">
			<submit-data-day-card
				v-for="(day, index) in props.item.item_groupby_day"
				:key="day.day_th"
				:user="user"
				:item="day"
				:index="index"
				@open="open_submit_data_modal"
				@update-pass-fail="update_week_summary"
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
import { computed, ref } from 'vue';
import SubmitDataDayCard from '@/components/SubmitDataDayCard.vue';

const props = defineProps({
	user: Object,
	item: Object,
	index: Number,
});
const emits = defineEmits(['open']);

const first_date_of_week = ref(props.item.item_groupby_day[0].date);
const second_date_of_week = computed(() => {
	const date = new Date(first_date_of_week.value);
	date.setDate(date.getDate() + 1);
	return date;
});

const summmary_data = ref({}); // summary_data[boj_id] = {pass : number, fail : number}

function update_week_summary({ passed_user_record, failed_user_boj_id }) {
	// select valid users ( registered_at < second date start time )
	const valid_user_boj_id = props.user
		.filter(({ registered_at }) => {
			const date = new Date(registered_at);
			return date < second_date_of_week.value;
		})
		.map(({ boj_id }) => boj_id);

	valid_user_boj_id.forEach(boj_id => {
		if (!summmary_data.value[boj_id]) {
			summmary_data.value[boj_id] = {
				boj_id: boj_id,
				pass: 0,
				fail: 0,
				submit_cnt: 0,
			};
		}
	});

	Object.keys(passed_user_record).forEach(boj_id => {
		summmary_data.value[boj_id].pass += 1;
		summmary_data.value[boj_id].submit_cnt += passed_user_record[boj_id];
	});

	failed_user_boj_id.forEach(boj_id => {
		summmary_data.value[boj_id].fail += 1;
	});
}

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
	align-items: center;
}

.week-summary {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;

	.person {
		width: fit-content;
		margin: 4px;
		// padding: 4px;
		border: 1px solid #9b9b9b;
		border-radius: 8px;
		span {
			display: inline-block;
			padding: 4px;
		}
		.person-name {
			border-right: 1px solid #9b9b9b;
		}
		.person-submit-cnt {
			vertical-align: center;
			// font-weight: 500;
			// padding: 0 4px;
			// padding: 4px;
			border-radius: 8px 0 0 8px;
			background-color: black;
			color: white;
		}
	}
	.person-survived {
		background-color: #eaffea;
	}
	.person-died {
		background-color: #fed5d5;
	}
}
</style>
