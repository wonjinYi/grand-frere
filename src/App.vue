<template>
	<!-- HEDAER -->
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

	<!-- MAIN -->
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
			<submit-data-day-card
				v-for="(item, index) in submit_data_groupby_day"
				:key="item.date"
				:user="user"
				:item="item"
				:index="index"
				@open="open_submit_data_modal(index)"
			></submit-data-day-card>
		</div>
		<div>{{ submit_data_groupby_day }}</div>
	</main>

	<!-- FOOTER -->
	<footer id="app-footer">
		<span>Grand Frère</span>
		<span>2024</span>
	</footer>
	<!-- <router-view></router-view> -->

	<!-- modal / overlay -->
	<Transition>
		<user-modal
			v-if="user_modal_open"
			:mode="user_modal_mode"
			@close="close_user_modal"
		/>
	</Transition>
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
import SubmitDataDayCard from '@/components/SubmitDataDayCard.vue';

// initilize
const user = ref(null);
const submit_data = ref(null);
const server_setting = ref(null);

const target_date_range = ref({
	start: new Date().toISOString().split('T')[0],
	end: new Date().toISOString().split('T')[0],
});

const initialized = ref(false);
async function init() {
	try {
		const { status, data, message } = await API.get_init_data();
		console.log(data);
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

const submit_data_groupby_day = computed(() => {
	const result = [];

	const { start, end } = target_date_range.value;

	// 24시간 단위로 분할. (KST기준 0시부터 ~ 24시 이전)
	for (let i = new Date(start); i <= end; i.setDate(i.getDate() + 1)) {
		const tomorrow_of_i = new Date(i);
		tomorrow_of_i.setDate(tomorrow_of_i.getDate() + 1);

		const item = {
			date: new Date(i),
			day_th: Math.floor(
				(i - new Date(server_setting.value.challenge_start_date)) /
					(1000 * 60 * 60 * 24) +
					1,
			),
			submit_data: [],
		};
		for (const row of submit_data.value) {
			const submitted_at = new Date(row.submitted_at);
			if (i <= submitted_at && submitted_at < tomorrow_of_i) {
				console.log('ok');
				item.submit_data.push(row);
			}
		}

		result.push(item);
	}

	// boj_id로 그룹핑
	for (let i = 0; i < result.length; i++) {
		const grouped = result[i].submit_data.reduce((acc, curr) => {
			const { boj_id } = curr;
			if (acc[boj_id]) acc[boj_id].push(curr);
			else acc[boj_id] = [curr];
			return acc;
		}, {});
		result[i].submit_data = grouped;
	}

	return result;
});

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

function open_submit_data_modal(index) {
	submit_data_modal_open.value = true;
	submit_data_modal_item.value = submit_data_groupby_day.value[index];
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

<!-- mobile -->
<style lang="scss" scoped></style>

<!-- gobal transition -->
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
