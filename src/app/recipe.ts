export class Recipe {

    constructor(
        public title: string,
        public ingredients: object,
        public instructions: object,
        public image: string,
        public date?: string
    ) { }
}
