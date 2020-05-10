import { context, logging, storage } from "near-sdk-as";
// available class: context, storage, logging, base58, base64, 
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math
import { Person, Coords, PersonAndCoords, allPersons, allPersonCoords, persistentCollectionForQuadrant, DEGREE,
  coordsToQuadrant, Quadrant } from "./model";

// FIXME: remove
export function getWelcome(): string {
    return "www";
}

export function getPerson(account: string = context.sender): Person | null {
  return allPersons.get(account, null);
}

export function getCoords(account: string = context.sender): Coords | null {
  return allPersonCoords.get(account, null);
}

export function changePerson(fullname: string,
                             address: string,
                             description: string,
                             phone: string): void {
    let person = new Person();
    person.account_id = context.sender;
    person.fullname = fullname;
    person.address = address;
    person.description = description;
    person.phone = phone;
    const oldPerson = getPerson();
    if(oldPerson) allPersons.delete(context.sender);
    allPersons.set(context.sender, person);
}

// TODO: Duplicate code with the below.
export function addCoords(account_id: string, latitude: u64, longtitude: u64): void {
  const coords = new Coords(account_id, latitude, longtitude);
  allPersonCoords.set(coords.account_id, coords);
  let quadrant: Quadrant = coordsToQuadrant(coords);
  let set = persistentCollectionForQuadrant(quadrant);
  /*if(!set.has(account_id))*/ set.add(account_id);
}

// TODO: Duplicate code with the above.
export function removeCoords(account_id: string): void {
  const coords = allPersonCoords.get(account_id, null);
  if(!coords) return;
  if(allPersonCoords.contains(account_id)) // FIXME: paniced without the check?
    allPersonCoords.delete(account_id);
  let quadrant: Quadrant = coordsToQuadrant(coords);
  let set = persistentCollectionForQuadrant(quadrant);
  if(set.has(account_id)) // FIXME: paniced without the check
      set.delete(account_id);
}

export function findNear(entries: i32, account: string = context.sender): PersonAndCoords[] {
    const me = getCoords(account);
    if(!me) return [];
    let quadrant = coordsToQuadrant(me);

    let persons: PersonAndCoords[] = [];

    let set = persistentCollectionForQuadrant(quadrant);
    if(set) {
        const values = set.values()
        for(let i: i32 = 0; i<values.length; ++i)
            if(values[i] != account)
                persons.push(new PersonAndCoords(allPersons.getSome(values[i]), allPersonCoords.getSome(values[i])));
    }
    if(persons.length > entries) return persons;
    ++quadrant.x;
    set = persistentCollectionForQuadrant(quadrant);
    if(set) {
        const values = set.values()
        for(let i: i32 = 0; i<values.length; ++i) {
            persons.push(new PersonAndCoords(allPersons.getSome(values[i]), allPersonCoords.getSome(values[i])));
        }
    }
    if(persons.length > entries) return persons;
    ++quadrant.y;
    set = persistentCollectionForQuadrant(quadrant);
    if(set) {
        const values = set.values()
        for(let i: i32 = 0; i<values.length; ++i) {
            persons.push(new PersonAndCoords(allPersons.getSome(values[i]), allPersonCoords.getSome(values[i])));
        }
    }
    if(persons.length > entries) return persons;
    --quadrant.x;
    set = persistentCollectionForQuadrant(quadrant);
    if(set) {
        const values = set.values()
        for(let i: i32 = 0; i<values.length; ++i) {
            persons.push(new PersonAndCoords(allPersons.getSome(values[i]), allPersonCoords.getSome(values[i])));
        }
    }
    if(persons.length > entries) return persons;
    --quadrant.x;
    set = persistentCollectionForQuadrant(quadrant);
    if(set) {
        const values = set.values()
        for(let i: i32 = 0; i<values.length; ++i) {
            persons.push(new PersonAndCoords(allPersons.getSome(values[i]), allPersonCoords.getSome(values[i])));
        }
    }
    if(persons.length > entries) return persons;
    --quadrant.y;
    set = persistentCollectionForQuadrant(quadrant);
    if(set) {
        const values = set.values()
        for(let i: i32 = 0; i<values.length; ++i) {
            persons.push(new PersonAndCoords(allPersons.getSome(values[i]), allPersonCoords.getSome(values[i])));
        }
    }
    if(persons.length > entries) return persons;
    --quadrant.y;
    set = persistentCollectionForQuadrant(quadrant);
    if(set) {
        const values = set.values()
        for(let i: i32 = 0; i<values.length; ++i) {
            persons.push(new PersonAndCoords(allPersons.getSome(values[i]), allPersonCoords.getSome(values[i])));
        }
    }
    if(persons.length > entries) return persons;
    ++quadrant.x;
    set = persistentCollectionForQuadrant(quadrant);
    if(set) {
        const values = set.values()
        for(let i: i32 = 0; i<values.length; ++i) {
            persons.push(new PersonAndCoords(allPersons.getSome(values[i]), allPersonCoords.getSome(values[i])));
        }
    }
    if(persons.length > entries) return persons;
    ++quadrant.x;
    set = persistentCollectionForQuadrant(quadrant);
    if(set) {
        const values = set.values()
        for(let i: i32 = 0; i<values.length; ++i) {
            persons.push(new PersonAndCoords(allPersons.getSome(values[i]), allPersonCoords.getSome(values[i])));
        }
    }
    if(persons.length > entries) return persons;

    return persons;
}