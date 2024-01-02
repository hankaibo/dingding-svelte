<script>
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
	import Upload from '$lib/components/Upload.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

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
</script>

<svelte:head>
	<title>首页</title>
</svelte:head>

<div class="container m-auto">
	<form class="grid gap-6 items-end w-full md:grid-cols-5 py-2">
		<FloatingLabelInput id="floating_filled" name="name" type="text" bind:value={name}>
			姓名
		</FloatingLabelInput>
		<FloatingLabelInput id="floating_filled" name="date" type="date" bind:value={date}>
			开始日期
		</FloatingLabelInput>
		<Select
			name="offset"
			items={offsetOptions}
			bind:value={offset}
			placeholder="晚上加班扣除吃饭时间"
		/>
		<Checkbox name="hidden" bind:checked={hidden}>隐藏未加班数据</Checkbox>
		<Button type="submit">查询</Button>
	</form>

	{#if data.user?.role?.name === 'Admin'}
		<Button on:click={() => (defaultModal = true)}>上传</Button>
	{/if}

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
			{#each data.reports as item}
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
						原始加班时长：{data.sumOvertimeWeekday}(工作日), {data.sumOvertimeWeekend}(周末)</span
					>
					<span class="block text-right"
						>调整后加班时长：{data.sumOvertimeWeekdayAfter}(工作日), {data.sumOvertimeWeekendAfter}(周末)</span
					>
				</td>
				<th
					scope="row"
					class="py-3 px-6 text-base text-right bg-gray-50 dark:bg-gray-800"
					rowspan="2">合计(单位:天)</th
				>
				<td class="py-3 px-6 text-right">{data.sumOvertimeWeekdayAfterBase / (60 * 8)}</td>
				<td class="py-3 px-6 text-right">{data.sumOvertimeWeekendAfterBase / (60 * 8)}</td>
				<td class="py-3 px-6 text-right bg-gray-50 dark:bg-gray-800" rowspan="2"
					>{data.sumResttime}</td
				>
			</tr>
			<tr class="font-semibold text-gray-900 dark:text-white">
				<td class="py-3 px-6 text-right border-t" colspan="2"
					>{(data.sumOvertimeWeekdayAfterBase + data.sumOvertimeWeekendAfterBase) / (60 * 8)}</td
				>
			</tr>
		</tfoot>
	</Table>

	<Modal title="上传考勤表" bind:open={defaultModal} autoclose>
		<Upload />
	</Modal>
</div>
