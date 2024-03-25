<template>
	<div id="user-modal">
		<div class="overlay" @click="$emit('close')"></div>
		<loading-overlay v-if="loading" />
		<!--  -->
		<div class="user-modal-content">
			<div class="header">
				<!-- x button with 2 divs  -->
				<div
					class="button close-button"
					@click="$emit('close')"
					style="margin-bottom: 48px"
				>
					<span>닫기</span>
				</div>
			</div>
			<div class="body">
				<div class="user-form">
					<div class="input-set">
						<span>{{ props.mode === 'edit' ? '등록된' : '' }} 백준 아이디</span>
						<input type="text" v-model="form.boj_id" autocomplete="off" />
					</div>
					<div class="input-set">
						<span>표시 할 이름</span>
						<input type="text" v-model="form.name" autocomplete="off" />
					</div>
					<div class="input-set">
						<span>정보 수정용 비밀번호</span>
						<input :type="input_pw_type" v-model="form.pw" autocomplete="off" />
					</div>
					<!-- 비밀번호 변경 -->
					<div v-if="props.mode === 'edit'" class="input-set">
						<template v-if="change_pw">
							<span>새로운 정보 수정용 비밀번호</span>
							<input
								:type="input_pw_type"
								v-model="form.new_pw"
								autocomplete="off"
							/>
						</template>

						<div
							class="button toggle-change-pw-button"
							@click="change_pw = !change_pw"
							:style="[
								change_pw && {
									backgroundColor: '#000',
									color: '#fff',
								},
							]"
						>
							<span>비밀번호 변경</span>
						</div>
					</div>

					<div
						class="button toggle-visible-pw-button"
						@click="visible_pw = !visible_pw"
						:style="[
							visible_pw && {
								backgroundColor: '#000',
								color: '#fff',
							},
						]"
					>
						<span>비밀번호 표시</span>
					</div>
				</div>

				<div class="button submit-button" @click="submit(props.mode)">
					<span>제출</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import API from '@/assets/apiService.js';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
const props = defineProps({
	mode: String,
});
const emits = defineEmits(['close']);

const loading = ref(false);

const change_pw = ref(false);
const visible_pw = ref(false);
const input_pw_type = computed(() => (visible_pw.value ? 'text' : 'password'));
const form = ref({
	boj_id: '',
	name: '',
	pw: '',
	new_pw: '',
	emoji: '',
});

async function submit(mode) {
	try {
		loading.value = true;
		if (mode === 'register') {
			const { status, message } = await API.register_user({
				form: {
					boj_id: form.value.boj_id,
					name: form.value.name,
					pw: form.value.pw,
					emoji: form.value.emoji,
				},
			});
			if (!status) {
				throw new Error(JSON.stringify(message));
			}
			alert(`ㅇㅋ : ${form.value.boj_id} 등록 됨`);
		} else if (mode === 'edit') {
			const { status, message } = await API.edit_user({
				form: {
					boj_id: form.value.boj_id,
					name: form.value.name,
					pw: form.value.pw,
					new_pw: change_pw.value ? form.value.new_pw : form.value.pw,
					emoji: form.value.emoji,
				},
			});
			if (!status) {
				throw new Error(JSON.stringify(message));
			}
			alert(`ㅇㅋ : ${form.value.boj_id} 수정 됨`);
		}
		emits('close');
	} catch (err) {
		console.error(err);
		console.error(err.message);
		alert(err.message);
	} finally {
		loading.value = false;
	}
}
</script>

<style lang="scss" scoped>
#user-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	// background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
}

.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: -1;
}

.user-modal-content {
	background-color: #fefefe;
	padding: 48px 32px;
	border-radius: 18px;
	max-height: 90%;
	overflow-y: auto;
	max-width: 90%;
	.button {
		// padding: 8px;
		// border: 1px solid #000;
		// border-radius: 12px;
		width: fit-content;

		span {
			font-weight: 400;
		}
		cursor: pointer;
		font-size: 1.1rem;
		padding: 8px 16px;
		margin-top: 24px;
		border: 1px solid #959595;
		border-radius: 16px;
		transition: all 0.3s;
		&:hover {
			background-color: #000;
			color: #fff;
		}
	}

	// .header {

	// }

	.body {
		display: flex;
		flex-direction: column;
		align-items: end;
		.user-form {
			.input-set {
				display: flex;
				flex-direction: column;
				margin-bottom: 24px;
				span {
					font-size: 1.1rem;
					font-weight: 300;
					margin-bottom: 8px;
				}
				input {
					width: 50vw;
					padding: 16px;
					border: 1px solid #959595;
					border-radius: 8px;
					font-size: 1.1rem;
				}
			}
		}
	}
}
</style>
