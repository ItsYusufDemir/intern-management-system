import { Program } from "./Program";

export class Team {
    name: string;
    curriculum: Program[];

    constructor(name: string, curriculum: Program[]) {
        this.name = name;
        this.curriculum = curriculum;
    }

}