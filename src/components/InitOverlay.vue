<template>
	<div id="init-overlay">
		<div class="content-container">
			<div class="emoji">👩‍💻</div>
			<div class="title">Grand Frère</div>

			<div class="loading-spinner"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
#init-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: black;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
	color: white;

	padding: 48px 0;

	.content-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		.emoji {
			font-size: 80px;
		}
		.title {
			font-size: 40px;
			font-weight: 100;
			margin-top: 12px;
			margin-bottom: 48px;
		}

		.loading-spinner {
			border: 4px solid #f3f3f3;
			border-right: 4px solid transparent;
			border-radius: 50%;
			width: 40px;
			height: 40px;
			animation: spin 1s ease-in-out infinite;
		}
		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
	}
}
</style>
