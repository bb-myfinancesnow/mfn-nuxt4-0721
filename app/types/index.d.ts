import type { ParsedContent } from '@nuxt/content';
import type { Avatar, Badge, Link } from '#ui/types';

export interface BlogPost extends ParsedContent {
	title: string;
	description: string;
	date: string;
	image?: HTMLImageElement;
	badge?: Badge;
	authors?: ({
		name: string;
		description?: string;
		avatar: Avatar;
	} & Link)[];
}

export type SaleStatus = 'paid' | 'failed' | 'refunded';

export interface Sale {
	id: string;
	date: string;
	status: SaleStatus;
	email: string;
	amount: number;
}

export interface Stat {
	title: string;
	icon: string;
	value: number | string;
	variation: number;
	formatter?: (value: number) => string;
}

export type Period = 'daily' | 'weekly' | 'monthly';

export interface Range {
	start: Date;
	end: Date;
}

export interface ICardStat {
	title: string;
	icon: string;
	value: number | string;
	formatter?: (value: number) => string;
	description?: string;
	to?: string;
}

export type TUniquePeriodYears = {
	year: number;
	label: string;
	journalCount: number;
	lockCount: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TObjAny = { [key: string]: any };

export type TTree<T> = {
	children?: TTree<T>[];
} & T;

export type TPeriodLockAction = 'lock' | 'unlock';
