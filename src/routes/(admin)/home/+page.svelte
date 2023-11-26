<script>
	import { onMount } from 'svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import qs from 'qs';

	let tableData = [];
	let sumOvertime = 0;

	async function getList() {
		// const params = new URLSearchParams();
		// params.append('page', '' + 1);
		// params.append('limit', '' + 1000);
		// params.append('filters[name]', '韩凯波');
		const params = qs.stringify({
			page: 1,
			limit: 1000
		});
		const res = await fetch(`/api/dingding?${params}`, {
			method: 'get',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		const users = await res.json();

		const baseTime = new Date('2023-11-26 17:30:00');
		tableData = users.data.map((user) => {
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
			let endTimeAfter = '';
			let overtime = 0;
			let overtime30 = 0;
			let base = 0;
			let overtimeAfter = 0;
			let offset = 30;

			if (user.endTime) {
				debugger;
				if (day === 0 || day === 6) {
					base = 2;

					endTimeAfter = user.endTime;
					// 计算2个时间的差
					const end = new Date(`2023-11-26 ${endTimeAfter}:00`);
					const start = new Date(`2023-11-26 ${user.startTime}:00`);
					overtime = (end - start) / 60000;
					//  周末不用偏移
					overtime30 = overtime;
				} else {
					base = 1.5;

					let m = '00';
					const [hour, minutes] = user.endTime.split(':');
					if (+minutes < 30) {
						m = '00';
					} else if (+minutes < 60) {
						m = '30';
					}
					endTimeAfter = `${hour}:${m}`;
					if (endTimeAfter === user.endTime) {
						overtime = 0;
						overtime30 = 0;
					} else {
						// 计算2个时间的差
						const end = new Date(`2023-11-26 ${endTimeAfter}:00`);
						overtime = (end - baseTime) / 60000;
						if (overtime && offset) {
							overtime30 = overtime - offset;
						}
					}
				}

				// 偶尔会提前下班，公司允许
				if (overtime < 0) {
					overtime = 0;
					overtime30 = 0;
				}
				if (overtime30 < 0) {
					overtime30 = 0;
				}

				// 加班时长 = 加班基数 * 加班时间
				overtimeAfter = overtime30 * base;
				// 累加加班时长
				sumOvertime += overtimeAfter;
			}

			return {
				...user,
				dayLabel,
				endTimeAfter,
				overtime,
				overtime30,
				base,
				overtimeAfter
			};
		});
	}

	onMount(() => {
		getList();
	});
</script>

<Table>
	<TableHead>
		<TableHeadCell>姓名</TableHeadCell>
		<TableHeadCell>日期</TableHeadCell>
		<TableHeadCell>星期</TableHeadCell>
		<TableHeadCell>开始时间</TableHeadCell>
		<TableHeadCell>结束时间</TableHeadCell>
		<TableHeadCell>结束时间(调整后)</TableHeadCell>
		<TableHeadCell>加班基数</TableHeadCell>
		<TableHeadCell>加班时间</TableHeadCell>
		<TableHeadCell>加班偏移量(-30分钟)</TableHeadCell>
		<!-- <TableHeadCell>加班偏移量(-1小时)</TableHeadCell> -->
		<TableHeadCell>加班时长(调整后)</TableHeadCell>
		<TableHeadCell>调休天数</TableHeadCell>
	</TableHead>
	<TableBody class="divide-y">
		{#each tableData as item}
			<TableBodyRow>
				<TableBodyCell>{item.name}</TableBodyCell>
				<TableBodyCell>{item.workDate}</TableBodyCell>
				<TableBodyCell>{item.dayLabel}</TableBodyCell>
				<TableBodyCell>{item.startTime}</TableBodyCell>
				<TableBodyCell>{item.endTime}</TableBodyCell>
				<TableBodyCell>{item.endTimeAfter}</TableBodyCell>
				<TableBodyCell>{item.base}</TableBodyCell>
				<TableBodyCell>{item.overtime}</TableBodyCell>
				<TableBodyCell>{item.overtime30}</TableBodyCell>
				<!-- <TableBodyCell>{item.overtime > 30 ? item.overtime - 60 : 0}</TableBodyCell> -->
				<TableBodyCell>{item.overtimeAfter}</TableBodyCell>
				<TableBodyCell>{item.rest}</TableBodyCell>
			</TableBodyRow>
		{/each}
		<TableBodyRow>
			<TableBodyCell>合计</TableBodyCell>
			<TableBodyCell />
			<TableBodyCell />
			<TableBodyCell />
			<TableBodyCell />
			<TableBodyCell />
			<TableBodyCell />
			<TableBodyCell />
			<TableBodyCell />
			<TableBodyCell>{sumOvertime}</TableBodyCell>
		</TableBodyRow>
	</TableBody>
</Table>
