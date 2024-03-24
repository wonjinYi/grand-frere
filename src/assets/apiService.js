import axios from 'axios';

const BASE_URL =
	'https://script.google.com/macros/s/AKfycbymzwCjYHjO5I-S1YbBUYq3PC5_UElo_s9hugsRBOr-bFxnne2kWqYElR0ocEOl4ayq7g/exec';

function success({ res, message }) {
	return {
		status: true,
		data: res.data.data,
		message: message,
	};
}

function fail({ err }) {
	return {
		status: false,
		data: null,
		message: err.message,
	};
}

const API_SERVICE = {
	get_init_data: async function () {
		try {
			const res = await axios.get(`${BASE_URL}?task_type=init`);
			if (!res.data.status) {
				throw new Error(res.data.data);
			}
			return success({ res, message: 'Successfully fetched data' });
		} catch (err) {
			return fail({ err });
		}
	},
	get_refreshed_data: async function () {
		try {
			const res = await axios.get(`${BASE_URL}?task_type=refresh`);
			if (!res.data.status) {
				throw new Error(res.data.data);
			}
			return success({
				res,
				message: 'Successfully refreshed then fetched data',
			});
		} catch (err) {
			return fail({ err });
		}
	},
	register_user: async function ({ form }) {
		try {
			console.log(form);
			const res = await axios.post(
				`${BASE_URL}?task_type=register_user`,
				JSON.stringify({ form }),
			);
			if (!res.data.status) {
				throw new Error(res.data.data);
			}
			return success({ res, message: 'Successfully registered' });
		} catch (err) {
			return fail({ err });
		}
	},
	edit_user: async function ({ form }) {
		try {
			const res = await axios.post(
				`${BASE_URL}?task_type=edit_user`,
				JSON.stringify({ form }),
			);
			if (!res.data.status) {
				throw new Error(res.data.data);
			}
			return success({ res, message: 'Successfully edited(updated)' });
		} catch (err) {
			return fail({ err });
		}
	},
};

export default API_SERVICE;
