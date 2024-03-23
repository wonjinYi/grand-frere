<template>
	<!-- HEDAER -->
	<header id="app-header">
		<div class="logo" @click="doCode">
			<span class="emoji">👩‍💻</span>
			<span>Grand Frère</span>
		</div>
		<div class="register-btn" style="margin-left: auto">
			<span>참여하기</span>
		</div>
	</header>

	<!-- MAIN -->
	<main>main area</main>

	<!-- FOOTER -->
	<footer id="app-footer">Grand Frère</footer>
	<!-- <router-view></router-view> -->
</template>

<script setup>
import { ref } from 'vue';
const title = ref('vue3-wonjin-template');

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
header {
	display: flex;
	align-items: center;

	background-color: $color-header-bg;
	transition: background-color 0.5s;
	&:hover {
		background-color: #e0e0e0;
	}
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

	.register-btn {
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
}
</style>
