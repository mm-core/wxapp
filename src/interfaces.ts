export interface IEvents {
	[event: string]: string;
}

export interface IActions {
	[atom: string]: (...args: unknown[]) => Promise<unknown> | unknown;
}

export interface IAi {
	readonly data: {
		readonly [attr: string]: unknown;
	};
	fire(action: string, ...args: unknown[]): Promise<unknown>;
	emit(event: string, ...args: unknown[]): Promise<unknown>;
}

export interface IAiWeappAppData {
	readonly [attr: string]: unknown;
	readonly app: wx.App;
	inner_audio_context?: wx.InnerAudioContext;
	background_audio_manager?: wx.BackgroundAudioManager;
	record_manager?: wx.RecorderManager;
	video_context?: wx.VideoContext;
	camera_context?: wx.CameraContext;
}

export interface IAiWeappPage extends IAi {
	page: unknown;
	readonly data: {
		readonly [attr: string]: unknown;
		readonly spaceid: string;
		readonly page: wx.Page;
		readonly params: { [name: string]: string; };
		readonly mm: IAiWeappAppData;
	};
}

export interface IAiWeappApp extends IAi {
	readonly data: IAiWeappAppData;
}
