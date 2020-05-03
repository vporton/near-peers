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

export const MAX_DEGREE = 20;

export class Person {
    fullname: string;
    description: string;
    latitude: number;
    longtitude: number;
}

@nearBindgen
export class TextMessage {
    text: string; // FIXME: remove
}

export const persons = new PersistentMap<string, Person>("a"); // account ID -> Person

export const personsMap = new PersistentMap<Quadrant, PersistentSet<Person>>("m");

function persistentCollectionForQuadrant(quadrant: Quadrant) : PersistentSet<Person> {
    return new PersistentSet("v"+quadrant.degree+'/'+quadrant.x+'/'+quadrant.y);
}

export function personToQuadrant(person: Person, degree: number = MAX_DEGREE): Quadrant {
    const k = 2**degree;
    let x = Math.floor(((person.latitude+90) / 180) * k);
    let y = Math.floor(((person.longtitude+180) / 360) * k);
    return new Quadrant(degree, x, y);
}

// TODO: Duplicate code with the below.
export function addPerson(person: Person): void {
    for(let degree = MAX_DEGREE; degree >= 0; --degree) {
        let quadrant = personToQuadrant(person, degree);
        let set = persistentCollectionForQuadrant(quadrant);
        personsMap.set(quadrant, set);
        set.add(person);
    }
}

// TODO: Duplicate code with the above.
export function removePerson(person: Person): void {
    for(let degree = MAX_DEGREE; degree >= 0; --degree) {
        let quadrant = personToQuadrant(person, degree);
        let set = persistentCollectionForQuadrant(quadrant);
        set.delete(person);
    }
}