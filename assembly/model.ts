import {
    PersistentMap,
    PersistentSet,
} from "near-sdk-as";

// FIXME: We assume that the Earth is square. People living near Earth zero meridian can't find all peers.

class Quadrant {
    degree: number;
    x: number;
    y: number;
    constructor(degree: number, x: number, y: number) {
        this.degree = degree;
        this.x = x;
        this.y = y;
    }
    superQuadrant(): Quadrant | null {
        if(this.degree == 0) return null;
        return new Quadrant(this.degree - 1, Math.floor(this.x / 2), Math.floor(this.y / 2));
    }
}

const MAX_DEGREE = 20;

class Person {
    fullname: string;
    latitude: number;
    longtitude: number;
    setCoords(latitude: number, longtitude: number) {
        
    }
}

@nearBindgen
export class TextMessage {
    text: string; // FIXME: remove
    constructor() {
    }
}

export const personsMap = new PersistentMap<Quadrant, PersistentSet<Person>>("m");

function persistentCollectionForQuadrant(quadrant: Quadrant) : PersistentSet<Person> {
    return new PersistentSet("v"+quadrant.degree+'/'+quadrant.x+'/'+quadrant.y);
}

// TODO: Duplicate code with the below.
function addPerson(person: Person): void {
    for(let degree = MAX_DEGREE; degree >= 0; --degree) {
        const k = 2**degree;
        let x = Math.floor(((person.latitude+90) / 180) * k);
        let y = Math.floor(((person.longtitude+180) / 360) * k);
        let quadrant = new Quadrant(degree, x, y);
        let set = persistentCollectionForQuadrant(quadrant);
        personsMap.set(quadrant, set);
        set.add(person);
    }
}

// TODO: Duplicate code with the above.
function removePerson(person: Person): void {
    for(let degree = MAX_DEGREE; degree >= 0; --degree) {
        const k = 2**degree;
        let x = Math.floor(((person.latitude+90) / 180) * k);
        let y = Math.floor(((person.longtitude+180) / 360) * k);
        let quadrant = new Quadrant(degree, x, y);
        let set = persistentCollectionForQuadrant(quadrant);
        set.delete(person);
    }
}