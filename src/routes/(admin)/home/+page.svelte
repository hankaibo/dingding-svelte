<script>
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
	 * @typedef Resp
	 * @property {User[]} data
	 */

	import { onMount } from 'svelte';
	import {
		FloatingLabelInput,
		Tooltip,
		Select,
		Checkbox,
		Modal,
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Upload from './upload.svelte';

	$: name = '';
	$: date = '2021-10-01';
	$: offset = '';
	let offsetOptions = [
		{ value: '0', name: '0分钟' },
		{ value: '30', name: '30分钟' },
		{ value: '60', name: '60分钟' }
	];
	$: hidden = true;
	let defaultModal = false;

	/**
	 * @type {User[]}
	 */
	let tableData = [];

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

	async function getList() {
		sumOvertimeWeekend = 0;
		sumOvertimeWeekday = 0;
		sumOvertimeWeekendAfter = 0;
		sumOvertimeWeekdayAfter = 0;
		sumOvertimeWeekendAfterBase = 0;
		sumOvertimeWeekdayAfterBase = 0;
		sumResttime = 0;

		const params = new URLSearchParams();
		params.append('page', '' + 1);
		params.append('limit', '' + 1000);
		params.append('filters', `{"name": "${name}", "date": "${date}"}`);
		const res = await fetch(`/api/attendance-report?${params}`, {
			method: 'get',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		/**
		 * @type {Resp}
		 */
		const users = await res.json();
		tableData = users.data
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

	onMount(() => {
		getList();
	});
</script>

<div class="grid gap-6 items-end w-full md:grid-cols-5 py-2">
	<FloatingLabelInput id="floating_filled" name="name" type="text" bind:value={name}>
		姓名
	</FloatingLabelInput>
	<FloatingLabelInput id="floating_filled" name="date" type="date" bind:value={date}>
		开始日期
	</FloatingLabelInput>
	<Select items={offsetOptions} bind:value={offset} placeholder="晚上加班扣除吃饭时间" />
	<Checkbox bind:checked={hidden}>隐藏未加班数据</Checkbox>
	<Button on:click={getList}>查询</Button>
</div>

<Button on:click={() => (defaultModal = true)} class="hidden">上传</Button>

<Table hoverable={true} shadow>
	<TableHead defaultRow={false} class="border-b">
		<tr>
			<TableHeadCell rowspan="2">姓名</TableHeadCell>
			<TableHeadCell rowspan="2" class="bg-white">日期</TableHeadCell>
			<TableHeadCell rowspan="2">星期</TableHeadCell>
			<TableHeadCell rowspan="2" class="bg-white">
				<span id="startTime">开始时间</span>
				<Tooltip triggeredBy="#startTime">早上8:30上班</Tooltip>
			</TableHeadCell>
			<TableHeadCell colspan="2" class="text-center">结束时间</TableHeadCell>
			<TableHeadCell colspan="2" class="text-center bg-white">加班时长(单位:分)</TableHeadCell>
			<TableHeadCell rowspan="2">加班基数</TableHeadCell>
			<TableHeadCell colspan="2" class="text-center bg-white">加班时长(单位:分)</TableHeadCell>
			<TableHeadCell rowspan="2">调休天数</TableHeadCell>
		</tr>
		<tr>
			<TableHeadCell class="text-center">
				<span id="endTime">调整前</span>
				<Tooltip triggeredBy="#endTime">晚上17:30下班</Tooltip>
			</TableHeadCell>
			<TableHeadCell class="text-center">
				<span id="endTimeAfter">调整后</span>
				<Tooltip triggeredBy="#endTimeAfter">不足30分钟则舍弃</Tooltip>
			</TableHeadCell>
			<TableHeadCell class="text-center bg-white">
				<span id="originMinutes">原始</span>
				<Tooltip triggeredBy="#originMinutes">除去不足30分钟后的加班时间</Tooltip>
			</TableHeadCell>
			<TableHeadCell class="text-center bg-white">
				<span id="originMinutesAfter">调整后</span>
				<Tooltip triggeredBy="#originMinutesAfter">除去不足30分钟及吃晚饭时间</Tooltip>
			</TableHeadCell>
			<TableHeadCell class="text-center bg-white">工作日</TableHeadCell>
			<TableHeadCell class="text-center bg-white">周末</TableHeadCell>
		</tr>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each tableData as item}
			<TableBodyRow>
				<TableBodyCell class="bg-gray-50 dark:text-white dark:bg-gray-800"
					>{item.name}</TableBodyCell
				>
				<TableBodyCell>{item.workDate}</TableBodyCell>
				<TableBodyCell class="bg-gray-50 dark:bg-gray-800">{item.dayLabel}</TableBodyCell>
				<TableBodyCell>{item.startTime}</TableBodyCell>
				<TableBodyCell class="bg-gray-50 dark:bg-gray-800">{item.endTime}</TableBodyCell>
				<TableBodyCell class="bg-gray-50 dark:bg-gray-800">{item.endTimeAfter}</TableBodyCell>
				<TableBodyCell class="text-right">{item.overtime}</TableBodyCell>
				<TableBodyCell class="text-right">{item.overtimeAfter}</TableBodyCell>
				<TableBodyCell class="bg-gray-50 dark:bg-gray-800 text-right">{item.base}</TableBodyCell>
				<TableBodyCell class="text-right">{item.overtimeAfterBaseWeekday}</TableBodyCell>
				<TableBodyCell class="text-right">{item.overtimeAfterBaseWeekend}</TableBodyCell>
				<TableBodyCell class="bg-gray-50 dark:bg-gray-800 text-right">{item.rest}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
	<tfoot class="border-t">
		<tr class="font-semibold text-gray-900 dark:text-white">
			<th
				scope="row"
				class="py-3 px-6 text-base text-right bg-gray-50 dark:bg-gray-800"
				colspan="6"
				rowspan="2">合计(单位:分)</th
			>
			<td class="py-3 px-6" colspan="2" rowspan="2">
				<span class="block text-right">
					原始加班时长：{sumOvertimeWeekday}(工作日), {sumOvertimeWeekend}(周末)</span
				>
				<span class="block text-right"
					>调整后加班时长：{sumOvertimeWeekdayAfter}(工作日), {sumOvertimeWeekendAfter}(周末)</span
				>
			</td>
			<th scope="row" class="py-3 px-6 text-base text-right bg-gray-50 dark:bg-gray-800" rowspan="2"
				>合计(单位:天)</th
			>
			<td class="py-3 px-6 text-right">{sumOvertimeWeekdayAfterBase / (60 * 8)}</td>
			<td class="py-3 px-6 text-right">{sumOvertimeWeekendAfterBase / (60 * 8)}</td>
			<td class="py-3 px-6 text-right bg-gray-50 dark:bg-gray-800" rowspan="2">{sumResttime}</td>
		</tr>
		<tr class="font-semibold text-gray-900 dark:text-white">
			<td class="py-3 px-6 text-right border-t" colspan="2"
				>{(sumOvertimeWeekdayAfterBase + sumOvertimeWeekendAfterBase) / (60 * 8)}</td
			>
		</tr>
	</tfoot>
</Table>

<Modal title="上传考勤表" bind:open={defaultModal} autoclose>
	<Upload />
</Modal>
