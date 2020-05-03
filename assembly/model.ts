import {
    PersistentMap,
    PersistentSet,
} from "near-sdk-as";

// FIXME: We assume that the Earth is square. People living near Earth zero meridian can't find all peers.

@nearBindgen
export class Quadrant {
    degree: i32;
    x: u64;
    y: u64;
    constructor(degree: i32, x: u64, y: u64) {
        this.degree = degree;
        this.x = x;
        this.y = y;
    }
    parentQuadrant(): Quadrant | null {
        if(this.degree == 0) return null;
        // return new Quadrant(this.degree - 1, <u64>0, <u64>0); // FIXME
        return new Quadrant(this.degree - 1, <u64>(this.x / 2), <u64>(this.y / 2)); // FIXME
    }
    toString(): String {
        return this.degree.toString() + '/' + this.x.toString() + '/' + this.y.toString();
    }
}

export const MAX_DEGREE: i32 = 20;

@nearBindgen
export class Person {
    account_id: string; // FIXME: assign it
    fullname: string;
    address: string;
    description: string;
    latitude: i64;
    longtitude: i64;
}

@nearBindgen
export class TextMessage {
    text: string; // FIXME: remove
}

export const allPersons = new PersistentMap<string, Person>("a"); // account ID -> Person

export function persistentCollectionForQuadrant(quadrant: Quadrant) : PersistentSet<string> {
    return new PersistentSet<string>("v" + quadrant.toString());
}

export function personToQuadrant(person: Person, degree: i32 = MAX_DEGREE): Quadrant {
    let k: i32 = 1 << degree;
    const x = i64((person.latitude >> 32) * k);
    const y = i64((person.longtitude >> 32) * k);
    return new Quadrant(k, x, y);
}

// TODO: Duplicate code with the below.
export function addPerson(person: Person): void {
    for(let degree = MAX_DEGREE; degree >= 0; --degree) {
        let quadrant = personToQuadrant(person, degree);
        let set = persistentCollectionForQuadrant(quadrant);
        set.add(person.account_id);
    }
}

// TODO: Duplicate code with the above.
export function removePerson(person: Person): void {
    for(let degree = MAX_DEGREE; degree >= 0; --degree) {
        let quadrant = personToQuadrant(person, degree);
        let set = persistentCollectionForQuadrant(quadrant);
        set.delete(person.account_id);
    }
}

export class Person1 {
    fullname: string;
}

