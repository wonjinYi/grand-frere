<template>
	<div id="submit-data-modal">
		<div class="overlay" @click="$emit('close')"></div>
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
				<p>내용이 들어갈 곳</p>
				<div>{{ item }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	item: Object,
});
const emits = defineEmits(['close']);

const loading = ref(false);
</script>

<style lang="scss" scoped>
#submit-data-modal {
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
	max-height: 100%;
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
