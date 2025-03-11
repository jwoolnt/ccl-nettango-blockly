export function dynamicOptions(options: string[]) {
	return () => options.map(option => [option, option]);
}
