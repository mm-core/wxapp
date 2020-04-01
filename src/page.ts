import init_ai from './ai';
import { IActions, IEvents } from './interfaces';

const MM_EVENTS_INIT = 'mm-events-init';
const MM_EVENTS_WX_PAGE_LOAD = 'mm-events-wx-page-load';
const MM_EVENTS_WX_PAGE_READY = 'mm-events-wx-page-ready';
const MM_EVENTS_WX_PAGE_SHOW = 'mm-events-wx-page-show';
const MM_EVENTS_WX_PAGE_HIDE = 'mm-events-wx-page-hide';
const MM_EVENTS_WX_PAGE_UNLOAD = 'mm-events-wx-page-unload';
const MM_EVENTS_WX_PAGE_PULLDOWN_REFRESH = 'mm-events-wx-page-pulldown_refresh';
const MM_EVENTS_WX_PAGE_REACH_BOTTOM = 'mm-events-wx-page-reach-bottom';
const MM_EVENTS_WX_PAGE_SHARE_APP_MESSAGE = 'mm-events-wx-page-share-app-message';
const MM_EVENTS_WX_PAGE_PAGE_SCROLL = 'mm-events-wx-page-page-scroll';

interface IData {
	page: unknown;
	params: unknown;
	app: wx.App;
}

function init_events(data: object, events: IEvents, fire: (instance: unknown, type: string, ...args: unknown[]) => Promise<unknown>) {
	const data_events = {
		mm: null as unknown as IData,
		async onLoad(options: { [key: string]: string; }) {
			const mm = this.mm = { ...data, local: {} } as unknown as IData;
			mm.page = this;
			mm.params = options;
			mm.app = getApp();
			// Object.freeze(data);	// !!! Could not freeze data here
			await fire(this, MM_EVENTS_INIT);
			fire(this, MM_EVENTS_WX_PAGE_LOAD, options);
		},
		onReady() {
			fire(this, MM_EVENTS_WX_PAGE_READY);
		},
		onShow() {
			(data as { page: unknown; }).page = this;
			fire(this, MM_EVENTS_WX_PAGE_SHOW);
		},
		onHide() {
			fire(this, MM_EVENTS_WX_PAGE_HIDE);
		},
		onUnload() {
			fire(this, MM_EVENTS_WX_PAGE_UNLOAD);
		},
		onPullDownRefresh() {
			fire(this, MM_EVENTS_WX_PAGE_PULLDOWN_REFRESH);
		},
		onReachBottom() {
			fire(this, MM_EVENTS_WX_PAGE_REACH_BOTTOM);
		},
		onShareAppMessage(e: wx.PageShareAppMessageOptions) {
			// fire(MM_EVENTS_WX_PAGE_SHARE_APP_MESSAGE);
			// return custom share data when user share.
			return (data as { [key: string]: (mm: IData, e: wx.PageShareAppMessageOptions) => unknown; })[MM_EVENTS_WX_PAGE_SHARE_APP_MESSAGE](this.mm, e);
		},
		onPageScroll(e: { scrollTop: number; }) {
			fire(this, MM_EVENTS_WX_PAGE_PAGE_SCROLL, e);
		}
	};
	Object.keys(events).forEach((event) => {
		data_events[event] = function <T extends wx.BaseEvent<string, unknown>>(e: T) {
			fire(this, event, e);
		};
	});
	return data_events as wx.PageOptions;
}

export default function init_page(events: IEvents, actions: IActions, data = {}) {
	const ai = init_ai(actions, events);
	const page = init_events(data, events, ai.emit);
	Page(page);
}
