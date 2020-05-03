import {
    PersistentMap,
    PersistentVector,
} from "near-sdk-as";

class Quadrant {
    degree: number;
    x: number;
    y: number;
}

class Person {
    fullname: string;
    lattitude: number;
    longtitude: number;
}

@nearBindgen
export class TextMessage {
    text: string; // FIXME: remove
    map: any;
    constructor() {
        this.map = new PersistentMap<Quadrant, Person[]>("m");
    }
}