<script>
	import { onMount } from 'svelte';
	import {
		FloatingLabelInput,
		// Datepicker,
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
	$: offset = '';
	let offsetOptions = [
		{ value: '0', name: '0分钟' },
		{ value: '30', name: '30分钟' },
		{ value: '60', name: '60分钟' }
	];
	$: hidden = false;
	let defaultModal = false;

	let tableData = [];

	let sumOvertimeWeekend = 0;
	let sumOvertimeWeekday = 0;
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
		sumResttime = 0;

		const params = new URLSearchParams();
		params.append('page', '' + 1);
		params.append('limit', '' + 1000);
		params.append('filters', '{"name":"' + name + '"}');
		const res = await fetch(`/api/attendance-report?${params}`, {
			method: 'get',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
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
				let overtimeWeekend = 0;
				let overtimeWeekday = 0;

				if (user.endTime) {
					if ((day === 0 || day === 6) && !workDay.includes(user.workDate)) {
						base = 2;

						endTimeAfter = user.endTime;
						// 计算2个时间的差
						const end = new Date(`2023-11-26 ${endTimeAfter}:00`);
						const start = new Date(`2023-11-26 ${user.startTime}:00`);
						overtime = (end - start) / 60000;
						//  周末不用偏移
						overtimeAfter = overtime;
						overtimeWeekend = (Number.isNaN(overtimeAfter) ? 0 : overtimeAfter) * base;
						sumOvertimeWeekend += overtimeWeekend;
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
							overtime = (end - baseTime) / 60000;
							if (offset) {
								overtimeAfter = overtime - offset;
							} else {
								overtimeAfter = overtime;
							}
							// 加班时长 = 加班基数 * 加班时间
							overtimeWeekday = (Number.isNaN(overtimeAfter) ? 0 : overtimeAfter) * base;
							// 累加加班时长
							sumOvertimeWeekday += overtimeWeekday;
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
					overtimeWeekend,
					overtimeWeekday
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

<div class="grid gap-6 items-end w-full md:grid-cols-4 py-2">
	<FloatingLabelInput id="floating_filled" name="name" type="text" bind:value={name}>
		姓名
	</FloatingLabelInput>
	<Select items={offsetOptions} bind:value={offset} placeholder="晚上加班扣除吃饭时间" />
	<Checkbox bind:checked={hidden}>隐藏未加班数据</Checkbox>
	<Button on:click={getList}>查询</Button>
</div>

<Button on:click={() => (defaultModal = true)}>上传</Button>

<Table hoverable={true} shadow>
	<TableHead defaultRow={false}>
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
	<TableBody class="divide-y">
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
				<TableBodyCell class="text-right">{item.overtimeWeekday}</TableBodyCell>
				<TableBodyCell class="text-right">{item.overtimeWeekend}</TableBodyCell>
				<TableBodyCell class="bg-gray-50 dark:bg-gray-800 text-right">{item.rest}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
	<tfoot>
		<tr class="font-semibold text-gray-900 dark:text-white">
			<th scope="row" class="py-3 px-6 text-base text-right" colspan="9" rowspan="2"
				>合计(单位:天)</th
			>
			<td class="py-3 px-6">{sumOvertimeWeekday / (60 * 8)}</td>
			<td class="py-3 px-6">{sumOvertimeWeekend / (60 * 8)}</td>
			<td class="py-3 px-6" rowspan="2">{sumResttime}</td>
		</tr>
		<tr class="font-semibold text-gray-900 dark:text-white">
			<td class="py-3 px-6 text-right" colspan="2"
				>{(sumOvertimeWeekday + sumOvertimeWeekend) / (60 * 8)}</td
			>
		</tr>
	</tfoot>
</Table>

<Modal title="上传考勤表" bind:open={defaultModal} autoclose>
	<Upload />
</Modal>
