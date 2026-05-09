/// <reference types="astro/client" />

import type Lenis from 'lenis';

declare global {
	interface Window {
		lenis: Lenis;
		openAITerminal?: () => void;
		__navEntrancePlayed?: boolean;
	}
}
