<template>
	<div id="submit-data-day-card" @click="open_user_modal">
		<div class="date-container">
			<span>{{ day_th }}일차</span>
			<span>{{ item_date }} ~ {{ tomorrow_of_item_date }}</span>
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
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	user: Object,
	item: Object,
	index: Number,
});
const emits = defineEmits(['open']);

console.log(props.item);
const submit_data = computed(() => props.item.submit_data);
const person_pass = computed(() => Object.keys(props.item.submit_data));
const person_fail = computed(() => {
	if (person_pass.value.length === 0)
		return props.user.map(item => item.boj_id);

	const user_boj_id = props.user.map(item => item.boj_id);
	console.log(user_boj_id);
	console.log(person_pass.value);
	const result = user_boj_id.filter(item => !person_pass.value.includes(item));
	console.log(result);
	return result;
});

const day_th = computed(() => props.item.day_th);
const item_date = computed(() => props.item.date);
const tomorrow_of_item_date = computed(() => {
	const date = new Date(props.item.date);
	date.setDate(date.getDate() + 1);
	return date;
});

function get_name_by_boj_id(boj_id) {
	const idx = props.user.findIndex(item => item.boj_id === boj_id);
	if (idx === -1) return 'Unknown';
	return props.user[idx].name;
}

function open_user_modal() {
	emits('open', { index: props.index });
}
</script>

<style lang="scss" scoped>
#submit-data-day-card {
	background-color: white;
	display: flex;
	flex-direction: column;
	border: 1px solid #9b9b9b;
	border-radius: 12px;
	cursor: pointer;

	margin: 12px;
	// width: 30%;
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
	}
	.abstract-container {
		display: flex;
		justify-content: center;
		padding: 8px;
		flex-wrap: wrap;
		.list-set {
			min-width: 128px;
			padding: 12px;
			.title {
				font-size: 1.2rem;
				padding: 8px;
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
