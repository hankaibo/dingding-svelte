import * as api from '$lib/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
	const page = url.searchParams.get('page') ?? '1';
	const name = url.searchParams.get('name') || '';
	const date = url.searchParams.get('date') || '';
	const offset = url.searchParams.get('offset') || 0;
	const hidden = url.searchParams.get('hidden') || 'on';

	const params = new URLSearchParams();
	params.set('page', page);
	params.set('limit', '' + 1000);
	params.set('filters', `{"name": "${name}", "date": "${date}"}`);

	const body = await api.get(`attendance-report?${params}`, locals?.token);

	if (body.errors) {
		return fail(401, body);
	}

	const {
		reports,
		sumOvertimeWeekend,
		sumOvertimeWeekday,
		sumOvertimeWeekendAfter,
		sumOvertimeWeekdayAfter,
		sumOvertimeWeekendAfterBase,
		sumOvertimeWeekdayAfterBase,
		sumResttime
	} = formatReport(body.data, { offset, hidden: hidden === 'on' });

	return {
		reports,
		sumOvertimeWeekend,
		sumOvertimeWeekday,
		sumOvertimeWeekendAfter,
		sumOvertimeWeekdayAfter,
		sumOvertimeWeekendAfterBase,
		sumOvertimeWeekdayAfterBase,
		sumResttime
	};
}

/**
 * @typedef User
 * @property {string} name
 * @property {string} workDate
 * @property {string | number} [dayLabel]
 * @property {string | number} startTime
 * @property {string} endTime
 * @property {string} [endTimeAfter]
 * @property {string | number} [overtime]
 * @property {string | number} [overtimeAfter]
 * @property {string | number} [base]
 * @property {string | number} [overtimeAfterBaseWeekday]
 * @property {string | number} [overtimeAfterBaseWeekend]
 * @property {string | number} rest
 */

/**
 *
 * @param {User[]} data
 * @param {*} param1
 * @returns
 */
function formatReport(data, { offset, hidden }) {
	/**
	 * @type {User[]}
	 */
	let reports = [];
	let sumOvertimeWeekend = 0;
	let sumOvertimeWeekday = 0;
	let sumOvertimeWeekendAfter = 0;
	let sumOvertimeWeekdayAfter = 0;
	let sumOvertimeWeekendAfterBase = 0;
	let sumOvertimeWeekdayAfterBase = 0;
	let sumResttime = 0;

	const baseTime = new Date('2023-11-26 17:30:00');
	const workDay = [
		'2021-10-09',
		'2022-01-29',
		'2022-01-30',
		'2022-04-02',
		'2022-04-24',
		'2022-05-07',
		'2022-10-08',
		'2022-10-09',
		'2023-01-28',
		'2023-01-29',
		'2023-04-23',
		'2023-05-06',
		'2023-06-25',
		'2023-10-07',
		'2023-10-08'
	];

	if (Array.isArray(data)) {
		reports = data
			.map((user) => {
				let day = new Date(user.workDate).getDay();
				let dayLabel = '';
				if (day == 0) {
					dayLabel = '星期日';
				} else if (day == 1) {
					dayLabel = '星期一';
				} else if (day == 2) {
					dayLabel = '星期二';
				} else if (day == 3) {
					dayLabel = '星期三';
				} else if (day == 4) {
					dayLabel = '星期四';
				} else if (day == 5) {
					dayLabel = '星期五';
				} else if (day == 6) {
					dayLabel = '星期六';
				}

				// 如果不足30分钟，省去这些时间
				let endTimeAfter = ''; // 加班时间取整后时间
				let overtime = 0; // 原始加班时间，单位分钟
				let overtimeAfter = 0; // 扣除晚上吃饭时间后的加班时间，单位分钟
				let base = 0; // 加班基数：工作日1.5，周末2
				let overtimeAfterBaseWeekday = 0;
				let overtimeAfterBaseWeekend = 0;

				if (user.endTime) {
					if ((day === 0 || day === 6) && !workDay.includes(user.workDate)) {
						base = 2;

						endTimeAfter = user.endTime;
						// 计算2个时间的差
						const end = new Date(`2023-11-26 ${endTimeAfter}:00`);
						const start = new Date(`2023-11-26 ${user.startTime}:00`);
						overtime = (+end - +start) / 60000;
						sumOvertimeWeekend += overtime;

						//  周末不用偏移
						overtimeAfter = overtime;
						sumOvertimeWeekendAfter += overtimeAfter;
						//
						overtimeAfterBaseWeekend = (Number.isNaN(overtimeAfter) ? 0 : overtimeAfter) * base;
						sumOvertimeWeekendAfterBase += overtimeAfterBaseWeekend;
					} else {
						base = 1.5;

						let m = '00';
						const [hour, minutes] = user.endTime.split(':');
						if ((+hour >= 20 && +minutes >= 30) || +hour >= 21) {
							if (+minutes < 30) {
								m = '00';
							} else if (+minutes < 60) {
								m = '30';
							}
							endTimeAfter = `${hour}:${m}`;

							// 计算2个时间的差
							const end = new Date(`2023-11-26 ${endTimeAfter}:00`);
							overtime = (+end - +baseTime) / 60000;
							sumOvertimeWeekday += overtime;

							if (offset) {
								overtimeAfter = overtime - +offset;
							} else {
								overtimeAfter = overtime;
							}
							sumOvertimeWeekdayAfter += overtimeAfter;

							overtimeAfterBaseWeekday = (Number.isNaN(overtimeAfter) ? 0 : overtimeAfter) * base;
							sumOvertimeWeekdayAfterBase += overtimeAfterBaseWeekday;
						}
					}
				}

				if (user.rest) {
					sumResttime += +user.rest;
				}

				return {
					...user,
					dayLabel,
					endTimeAfter,
					overtime,
					overtimeAfter,
					base,
					overtimeAfterBaseWeekend,
					overtimeAfterBaseWeekday
				};
			})
			.filter((user) => {
				if (hidden) {
					return user.overtime > 0;
				} else {
					return true;
				}
			});
	}

	return {
		reports,
		sumOvertimeWeekend,
		sumOvertimeWeekday,
		sumOvertimeWeekendAfter,
		sumOvertimeWeekdayAfter,
		sumOvertimeWeekendAfterBase,
		sumOvertimeWeekdayAfterBase,
		sumResttime
	};
}
