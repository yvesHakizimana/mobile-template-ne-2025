export function SingletonFactory<T>() {
    return class {
        private static instance: T | null = null;

        protected constructor() {}

        public static getInstance(this: any): T {
            if (!this.instance) {
                this.instance = new this()
            }
            return this.instance;
        }
    }
}