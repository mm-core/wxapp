import { IEvents } from './interfaces';

export default function get_emit(events: IEvents, fire: (instance: unknown, action: string, ...args: unknown[]) => Promise<unknown>) {
	return function emit(instance: unknown, type: string, ...args: unknown[]) {
		const action = events[type];
		if (action) {
			return fire(instance, action, ...args);
		} else if (/^[n]?a\d+/.test(type)) {
			return fire(instance, type, ...args);
		}
		return Promise.resolve();
	};
}
