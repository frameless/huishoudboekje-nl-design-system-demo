// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/node_modules/extend-expect"

class MockWeakMap<KeyType extends object, ValueType> {
	private map: Map<KeyType, ValueType>;

	constructor() {
		this.map = new Map<KeyType, ValueType>();
	}

	set(key: KeyType, value: ValueType) {
		this.map.set(key, value);
	}

	get(key: KeyType): ValueType | undefined {
		return this.map.get(key);
	}

	has(key: KeyType): boolean {
		return this.map.has(key);
	}
}

(global as any).WeakMap = MockWeakMap; // Mock WeakMap globally
