import init_ai from './ai';
import { IActions, IEvents } from './interfaces';

const MM_EVENTS_INIT = 'mm-events-init';
const MM_EVENTS_WX_APP_LAUNCH = 'mm-events-wx-app-launch';
const MM_EVENTS_WX_APP_SHOW = 'mm-events-wx-app-show';
const MM_EVENTS_WX_APP_HIDE = 'mm-events-wx-app-hide';
const MM_EVENTS_WX_APP_ERROR = 'mm-events-wx-app-error';

export default function init_app(events: IEvents, actions: IActions) {
	const ai = init_ai(actions, events);
	const data = { app: null as unknown/* as wx.App*/ };
	const app = {
		mm: data,
		async onLaunch() {
			this.mm.app = this;
			Object.freeze(data);
			await ai.emit(this, MM_EVENTS_INIT);
			// Do something initial when launch.
			ai.emit(this, MM_EVENTS_WX_APP_LAUNCH);
		},
		onShow() {
			// Do something when show.
			ai.emit(this, MM_EVENTS_WX_APP_SHOW);
		},
		onHide() {
			// Do something when hide.
			ai.emit(this, MM_EVENTS_WX_APP_HIDE);
		},
		onError(msg: unknown) {
			ai.emit(this, MM_EVENTS_WX_APP_ERROR, msg);
		}
	};
	App(app);
}
