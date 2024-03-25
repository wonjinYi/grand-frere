<template>
	<!--  -->
	<!-- HEDAER -->
	<!--  -->
	<header id="app-header">
		<div class="logo" @click="doCode">
			<span class="emoji">👩‍💻</span>
			<span>Grand Frère</span>
		</div>
		<div id="header-actions-container">
			<div
				id="register-user-button"
				class="header-action button"
				style="margin-right: 12px"
				@click="open_user_modal(ENUM_USER_MODAL_MODE.register)"
			>
				<span>참여하기</span>
			</div>
			<div
				id="edit-user-button"
				class="header-action button"
				@click="open_user_modal(ENUM_USER_MODAL_MODE.edit)"
			>
				<span>내 정보 수정</span>
			</div>
		</div>
	</header>

	<!--  -->
	<!-- MAIN -->
	<!--  -->
	<main
		v-if="initialized"
		style="display: flex; flex-direction: column; align-items: center"
	>
		<div
			id="refresh-button"
			class="button"
			@click="refresh"
			style="width: fit-content; margin: 24px 0 12px 0"
		>
			<span>새로운 데이터 가져오기(좀 걸림)</span>
		</div>

		<div style="display: flex; flex-direction: column-reverse; padding: 0 10%">
			<submit-data-week-group
				v-for="(week, index) in grouped_submit_data"
				:key="week.week_number"
				:user="user"
				:item="week"
				:index="index"
				@open="open_submit_data_modal"
			></submit-data-week-group>
		</div>
	</main>

	<!--  -->
	<!-- FOOTER -->
	<!--  -->
	<footer id="app-footer">
		<span>Grand Frère</span>
		<span style="font-size: 0.8rem">2024</span>
	</footer>

	<!--  -->
	<!-- modal / overlay -->
	<!--  -->

	<!-- user-register/edit-modal -->
	<Transition>
		<user-modal
			v-if="user_modal_open"
			:mode="user_modal_mode"
			@close="close_user_modal"
		/>
	</Transition>
	<!-- submit-data-modal -->
	<Transition>
		<submit-data-modal
			v-if="submit_data_modal_open"
			@close="close_submit_data_modal"
			:item="submit_data_modal_item"
		/>
	</Transition>
	<!-- init overlay -->
	<Transition>
		<div id="init-overlay-container" v-if="!initialized">
			<init-overlay />
		</div>
	</Transition>
	<!-- loading overlay -->
	<Transition>
		<div id="loading-overlay-container" v-if="loading">
			<loading-overlay />
		</div>
	</Transition>
</template>

<script setup>
// libraries & framework
// global variables
import { ref, computed } from 'vue';
import API from '@/assets/apiService.js';

// components
import InitOverlay from '@/components/InitOverlay.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import UserModal from '@/components/UserModal.vue';
import SubmitDataModal from '@/components/SubmitDataModal.vue';
import SubmitDataWeekGroup from '@/components/SubmitDataWeekGroup.vue';

// initilize
const user = ref({});
const submit_data = ref({});
const server_setting = ref({
	challenge_start_date: new Date(),
});

const target_date_range = ref({
	start: new Date(),
	end: new Date(),
});

const initialized = ref(false);
async function init() {
	try {
		const { status, data, message } = await API.get_init_data();
		console.debug(data);
		if (!status) {
			alert(message);
			return;
		}
		user.value = data.user;
		submit_data.value = data.submit_data;
		initialized.value = true;
		server_setting.value = data.setting;

		// date range 기본값으로 초기화
		// -- 현행 : 스터디 시작일 (3월21일)~오늘 까지로 임시 고정
		// todo : 현재 주차의 월요일~일요일로 변경. 윈도우 변경할 수 있도록 기능 추가.
		target_date_range.value.start = new Date(
			server_setting.value.challenge_start_date,
		);
		target_date_range.value.end = new Date();
	} catch (err) {
		console.error(err);
		alert(
			'Error occured while initializing the app. Please try refreshing the page. : ' +
				err.message,
		);
	}
}
init();

// refresh
const loading = ref(false);
async function refresh() {
	try {
		loading.value = true;

		const { status, data, message } = await API.get_refreshed_data();
		if (!status) {
			alert(message);
			return;
		}
		user.value = data.user;
		submit_data.value = data.submit_data;
		initialized.value = true;
		server_setting.value = data.setting;
	} catch (err) {
		console.error(err);
		alert(
			'Error occured while initializing the app. Please try refreshing the page. : ' +
				err.message,
		);
	} finally {
		loading.value = false;
	}
}

// display submit_data on main area
const grouped_submit_data = computed(() => {
	// api로부터 받은 submit_data를 아래 순서로 그룹화한 computed
	// 1. 주(24*7시간) 단위로 // * 주차 수 'n'은 get_week_number() 호출 결과에 따름
	// 2. 일(24시간) 단위로
	// 3. 백준 아이디 별로
	// 주, 일은 KST를 기준으로 월~일, 0시~24시로 분할됨

	/*
		리턴값(items_groupby_week_number) 형식
		[	
			// n주차 (dow : day of week) 
			[
				// m요일에 해당하는 item(submit_data의 원소)들
				[ 
					백준아이디1 : [ 아이디에 해당하는 사람이 m요일에 제출한 item들 ],
					백준아이디2 : [ 아이디에 해당하는 사람이 m요일에 제출한 item들 ],
					...
				],
				// m+1요일에 해당하는 items(submit_data의 원소)들
				[
					백준아이디1 : [ 아이디에 해당하는 사람이 m+1요일에 제출한 item들 ],
					백준아이디2 : [ 아이디에 해당하는 사람이 m+1요일에 제출한 item들 ],
				]
			],

			// n+1주차 ...
			// n+2주차 ...
		]
	*/

	const item_groupby_day = [];
	const item_groupby_week_number = []; // 리턴할 결과.
	const set_week_number = []; // 주차수의 집합

	const { start, end } = target_date_range.value;

	// 일(24시간) 단위로 분할. (KST기준 0시부터 ~ 24시 이전)
	for (let i = new Date(start); i <= end; i.setDate(i.getDate() + 1)) {
		const tomorrow_of_i = new Date(i);
		tomorrow_of_i.setDate(tomorrow_of_i.getDate() + 1);

		const obj = {
			date: new Date(i),
			day_of_week: i.getDay(), // 요일. 일월화수목금토 0123456
			week_number: null,
			day_th: Math.floor(
				(i - new Date(server_setting.value.challenge_start_date)) /
					(1000 * 60 * 60 * 24) +
					1,
			),
			item_groupby_boj_id: [],
		};

		// 주차 수(week_number) 계산
		const week_number = get_week_number(
			i,
			new Date(server_setting.value.challenge_start_date),
		);
		obj.week_number = week_number;
		if (!set_week_number.includes(week_number))
			set_week_number.push(week_number);

		// 분할된 단위에 들어오는 submit_data를 obj.item_groupby_boj_id 추가
		for (const row of submit_data.value) {
			const submitted_at = new Date(row.submitted_at);
			if (i <= submitted_at && submitted_at < tomorrow_of_i) {
				obj.item_groupby_boj_id.push(row);
			}
		}
		item_groupby_day.push(obj);
	}

	// itmes_groupby_day.item_groupby_boj_id 내부를 boj_id로 그룹핑
	for (let i = 0; i < item_groupby_day.length; i++) {
		const group = item_groupby_day[i].item_groupby_boj_id.reduce(
			(acc, curr) => {
				const { boj_id } = curr;
				if (acc[boj_id]) acc[boj_id].push(curr);
				else acc[boj_id] = [curr];
				return acc;
			},
			{},
		);
		item_groupby_day[i].item_groupby_boj_id = group;
	}

	// itmes_groupby_day의 각 원소를 주차 수에 따라 묶기
	set_week_number.sort(function (a, b) {
		return a - b;
	});
	for (let i = 0; i < set_week_number.length; i++) {
		const week_number = set_week_number[i];
		const group = item_groupby_day.filter(el => el.week_number === week_number);
		item_groupby_week_number.push({
			week_number: week_number,
			item_groupby_day: group,
		});
	}

	return item_groupby_week_number;
});

function get_week_number(cur_date, start_date) {
	// start_date가 속한 주의 월요일로부터 몇 주차인지 계산
	// e.g., start_date가 2024-03-27(수)라면, 2024-03-25(월)로부터 몇 주차인지 계산
	// 주차는 1주차부터 시작.

	// start_date의 요일이 월요일이 아닌 경우, 월요일로 조정
	const dow_start_date = start_date.getDay();
	if (dow_start_date !== 1) {
		start_date.setDate(start_date.getDate() - dow_start_date + 1);
	}

	// 차이 계산
	const diff = Math.abs(cur_date - start_date);
	const week_diff = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));

	return week_diff + 1;
}

// user resiger, update
const user_modal_open = ref(false);
const user_modal_mode = ref(null);
const ENUM_USER_MODAL_MODE = {
	register: 'register',
	edit: 'edit',
};
function open_user_modal(mode) {
	user_modal_mode.value = mode;
	user_modal_open.value = true;
}
function close_user_modal() {
	user_modal_open.value = false;
	user_modal_mode.value = null;
}

// submit data modal
const submit_data_modal_open = ref(false);
const submit_data_modal_item = ref(null);

function open_submit_data_modal({ week_index, day_index }) {
	submit_data_modal_open.value = true;
	submit_data_modal_item.value =
		grouped_submit_data.value[week_index].item_groupby_day[day_index];
}
function close_submit_data_modal() {
	submit_data_modal_open.value = false;
	submit_data_modal_item.value = null;
}

// 장난
// called when logo's clicked
function doCode() {
	const ok = window.confirm('코딩해');
	if (ok) {
		window.open('https://www.youtube.com/watch?v=TpPwI_Lo0YY');
		location.href = 'https://www.acmicpc.net/group/20497';
	} else {
		window.alert('그럼 남들 하는거라도 봐');
		window.open('https://www.acmicpc.net/status?group_id=20497');
	}
}
</script>

<style lang="scss" scoped>
.button {
	span {
		font-weight: 400;
	}
	cursor: pointer;
	font-size: 1.1rem;
	padding: 8px 16px;
	border: 1px solid #959595;
	border-radius: 16px;
	transition: all 0.3s;
	&:hover {
		background-color: #000;
		color: #fff;
	}
}

header {
	display: flex;
	align-items: center;

	background-color: $color-header-bg;
	padding: 18px 48px;

	.logo {
		cursor: pointer;
		span {
			font-size: 2rem;
			font-weight: lighter;
		}
		.emoji {
			padding-right: 16px;
		}
	}

	#header-actions-container {
		display: flex;
		margin-left: auto;
	}
}

main {
	min-height: 80vh;
}

footer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 24px 0;
	background-color: rgb(63, 63, 63);
	span {
		font-size: 1.2rem;
		padding: 4px;
		color: white;
	}
}
@media (max-width: 768px) {
	header {
		flex-direction: column;
		padding-left: 24px;
		padding-right: 24px;
		#header-actions-container {
			margin-left: 0;
			margin-top: 12px;
		}
	}
}
</style>

<!-- global transition -->
<style lang="scss">
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
