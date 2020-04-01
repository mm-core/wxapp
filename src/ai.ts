import get_emit from './get-emit';
import { IActions, IEvents } from './interfaces';

interface IData {
	page: unknown;
	params: unknown;
	app: wx.App;
}

interface IInstance {
	mm: IData;
}

export default function init(actions: IActions, events: IEvents) {
	// 执行事件对应的js响应函数，或者规则编号对应的响应函数
	function fire_action(instance: IInstance, action: string, ...args: unknown[]) {
		const fun = actions[action];
		if (!fun) {
			return Promise.resolve();
		}
		const mm_data = { emit, fire, fire_action, fire_nools, data: instance.mm };
		return Promise.resolve(fun(mm_data, ...args));
	}

	// 执行事件对应的规则响应
	function fire_nools() {
		return Promise.reject(new Error('Could not fire nools'));
	}

	function fire(instance: IInstance, action: string, ...args: unknown[]) {
		return fire_action(instance, action, ...args);
	}

	const emit = get_emit(events, fire);
	// Object.freeze(data);	// Could not freeze data here, see page.ts

	return { emit };
}
