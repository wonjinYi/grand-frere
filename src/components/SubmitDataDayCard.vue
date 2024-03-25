<template>
	<div id="submit-data-day-card" @click="open_submit_data_modal">
		<div class="card-body">
			<div class="date-container">
				<span class="day-th">{{ props.item.day_th }}일차</span>
				<div class="date-range">
					<span>{{ format_date(props.item.date) }}</span>

					<span> ~ {{ format_date(tomorrow_of_item_date) }}</span>
				</div>
			</div>
			<div class="abstract-container">
				<div class="list-set fail">
					<div class="title">
						<span>미완료</span>
					</div>
					<div class="person-list">
						<div class="person" v-for="boj_id in person_fail" :key="boj_id">
							<span>{{ get_name_by_boj_id(boj_id) }}</span>
						</div>
					</div>
				</div>
				<div class="list-set pass">
					<div class="title">
						<span>완료</span>
					</div>
					<div class="person-list">
						<div class="person" v-for="boj_id in person_pass" :key="boj_id">
							<span>{{ get_name_by_boj_id(boj_id) }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	user: Object,
	item: Object,
	index: Number,
});
const emits = defineEmits(['open']);

const person_pass = computed(() => Object.keys(props.item.item_groupby_boj_id));
const person_fail = computed(() => {
	if (person_pass.value.length === 0)
		return props.user.map(item => item.boj_id);

	const user_boj_id = props.user.map(item => item.boj_id);
	const result = user_boj_id.filter(item => !person_pass.value.includes(item));

	return result;
});

const tomorrow_of_item_date = computed(() => {
	const date = new Date(props.item.date);
	date.setDate(date.getDate() + 1);
	date.setSeconds(date.getSeconds() - 1);
	return date;
});

function get_name_by_boj_id(boj_id) {
	const idx = props.user.findIndex(item => item.boj_id === boj_id);
	if (idx === -1) return 'Unknown';
	return props.user[idx].name;
}

function format_date(date) {
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let hour = date.getHours();
	let minute = date.getMinutes();
	let second = date.getSeconds();

	month = month >= 10 ? month : '0' + month;
	day = day >= 10 ? day : '0' + day;
	hour = hour >= 10 ? hour : '0' + hour;
	minute = minute >= 10 ? minute : '0' + minute;
	second = second >= 10 ? second : '0' + second;

	return (
		date.getFullYear() +
		'-' +
		month +
		'-' +
		day +
		'(' +
		['일', '월', '화', '수', '목', '금', '토'][date.getDay()] +
		') ' +
		' ' +
		hour +
		':' +
		minute +
		':' +
		second
	);
}
function open_submit_data_modal() {
	emits('open', props.index);
}
</script>

<style lang="scss" scoped>
#submit-data-day-card {
	padding: 12px;
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
.card-body {
	display: flex;
	flex-direction: column;

	background-color: white;
	border: 1px solid #9b9b9b;
	border-radius: 12px;

	cursor: pointer;
	transition: all 0.3s;
	&:hover {
		box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.2);
		transform: scale(1.1);
	}

	.date-container {
		display: flex;
		flex-direction: column;
		padding: 8px;
		border-radius: (12px 12px 0 0);
		background-color: #f0f0f0;
		text-align: center;

		.day-th {
			font-size: 1.1rem;
			font-weight: 500;
			padding-bottom: 4px;
		}
		.date-range {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
		}
	}
	.abstract-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		padding: 8px;

		.list-set {
			min-width: 128px;
			padding: 12px;
			.title {
				padding: 8px;
				font-size: 1.2rem;
				border-radius: 8px;
				text-align: center;
			}
			.person-list {
				padding: 8px;
				.person {
					padding: 4px;
				}
			}
		}
		.fail > .title {
			border: 1px solid #959595;
		}
		.pass > .title {
			color: white;
			background-color: black;
			border: 1px solid black;
			span {
				font-weight: 500;
			}
		}
	}
}
</style>
