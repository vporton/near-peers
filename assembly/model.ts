import {
    PersistentMap,
    PersistentVector,
} from "near-sdk-as";

class Quadrant {
    degree: number;
    x: number;
    y: number;
    superQuadrant(): Quadrant | null {
        if(this.degree == 0) return null;
        let result: Quadrant = new Quadrant();
        result.degree = this.degree - 1;
        result.x = Math.floor(this.x / 2);
        result.y = Math.floor(this.y / 2);
        return result;
    }
}

class Person {
    fullname: string;
    lattitude: number;
    longtitude: number;
}

@nearBindgen
export class TextMessage {
    text: string; // FIXME: remove
    constructor() {
    }
}

export const personsMap = new PersistentMap<Quadrant, Person[]>("m");