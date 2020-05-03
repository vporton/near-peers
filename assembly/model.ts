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
    // We don't reach degree 0
    parentQuadrant(): Quadrant /*| null*/ {
        //if(this.degree == 0) return null;
        // return new Quadrant(this.degree - 1, <u64>0, <u64>0); // FIXME
        return new Quadrant(this.degree - 1, <u64>(this.x / 2), <u64>(this.y / 2)); // FIXME
    }
    toString(): String {
        return this.degree.toString() + '/' + this.x.toString() + '/' + this.y.toString();
    }
}

// Should not exceeds gas
export const MIN_DEGREE: i32 = 10;
export const MAX_DEGREE: i32 = 11;

@nearBindgen
export class Person {
    account_id: string; // FIXME: assign it
    fullname: string;
    address: string;
    description: string;
}

@nearBindgen
export class Coords {
    account_id: string; // FIXME: assign it
    latitude: u64; // 0 = -90 degrees, 2^64-1 = 90 degrees
    longtitude: u64; // 0 = -180 degrees, 2^64-1 = 180 degrees
}

@nearBindgen
export class TextMessage {
    text: string; // FIXME: remove
}

export const allPersons = new PersistentMap<string, Person>("a"); // account ID -> Person
export const allPersonCoords = new PersistentMap<string, Coords>("L"); // account ID -> Coords

export function persistentCollectionForQuadrant(quadrant: Quadrant) : PersistentSet<string> {
    return new PersistentSet<string>("v" + quadrant.toString());
}

export function coordsToQuadrant(coords: Coords, degree: i32 = MAX_DEGREE): Quadrant {
    let k: i32 = 1 << degree;
    // TODO: Working but silly and inexact formulas:
    const x = i64((coords.latitude >> 32) * k) >> 32;
    const y = i64((coords.longtitude >> 32) * k) >> 32;
    return new Quadrant(k, x, y);
}
