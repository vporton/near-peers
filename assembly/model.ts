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
    toString(): String {
        return this.x.toString() + '/' + this.y.toString();
    }
}

// Should not exceeds gas
export const DEGREE: i32 = 11; // 10

@nearBindgen
export class Person {
    account_id: string; // FIXME: assign it
    fullname: string;
    address: string;
    description: string;
}

@nearBindgen
export class Coords {
    account_id: string;
    latitude: u64; // 0 = -90 degrees, 2^64-1 = 90 degrees
    longtitude: u64; // 0 = -180 degrees, 2^64-1 = 180 degrees
    constructor(account_id: string, latitude: u64, longtitude: u64) {
        this.account_id = account_id;
        this.latitude = latitude;
        this.longtitude = longtitude;
    }
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

export function coordsToQuadrant(coords: Coords): Quadrant {
    let k: i32 = 1 << DEGREE;
    // TODO: Working but silly and inexact formulas:
    const x = i64((coords.latitude >> 32) * k) >> 32;
    const y = i64((coords.longtitude >> 32) * k) >> 32;
    return new Quadrant(k, x, y);
}
