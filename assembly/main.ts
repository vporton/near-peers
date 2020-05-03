import { context, logging, storage } from "near-sdk-as";
// available class: context, storage, logging, base58, base64, 
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math
import { Person, Coords, allPersons, allPersonCoords, persistentCollectionForQuadrant, MAX_DEGREE,
  coordsToQuadrant, Quadrant, MIN_DEGREE } from "./model";

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
                             description: string): void {
    let person = new Person();
    person.account_id = context.sender;
    person.fullname = fullname;
    person.address = address;
    person.description = description;
    const oldPerson = getPerson();
    if(oldPerson) allPersons.delete(context.sender);
    allPersons.set(context.sender, person);
}

// TODO: Duplicate code with the below.
export function addCoords(account_id: string, latitude: u64, longtitude: u64): void {
  const coords = new Coords(account_id, latitude, longtitude);
  allPersonCoords.set(coords.account_id, coords);
  for(let quadrant: Quadrant = coordsToQuadrant(coords, MAX_DEGREE);
      quadrant.degree >= MIN_DEGREE;
      quadrant = quadrant.parentQuadrant()
  ) {
      let set = persistentCollectionForQuadrant(quadrant);
      set.add(account_id);
  }
}

// TODO: Duplicate code with the above.
export function removeCoords(account_id: string): void {
  const coords = allPersonCoords.get(account_id, null);
  if(!coords) return;
  allPersonCoords.delete(coords.account_id);
  for(let quadrant: Quadrant = coordsToQuadrant(coords, MAX_DEGREE);
      quadrant.degree >= MIN_DEGREE;
      quadrant = quadrant.parentQuadrant()
  ) {
      let set = persistentCollectionForQuadrant(quadrant);
      if(set.has(account_id)) // FIXME: paniced without the check
          set.delete(account_id);
  }
}

export function findNear(entries: i32, account: string = context.sender): Person[] {
    let degree: i32 = MAX_DEGREE;
  
    const me = getCoords(account);
    if(!me) return [];
    let quadrant = coordsToQuadrant(me, degree);

    let persons: Person[] = [];

    for(; degree >= MIN_DEGREE; --degree) {
      // Iterate nearby quadrants:
      // FIXME: Wrap at edges of the square Earth.

      let set = persistentCollectionForQuadrant(quadrant);
      if(set) {
          const values = set.values()
          for(let i: i32 = 0; i<values.length; ++i) // TODO: for in
              persons.push(allPersons.getSome(values[i]));
      }
      if(persons.length > entries) break;
      ++quadrant.x;
      set = persistentCollectionForQuadrant(quadrant);
      if(set) {
          const values = set.values()
          for(let i: i32 = 0; i<values.length; ++i) // TODO: for in
              persons.push(allPersons.getSome(values[i]));
      }
      if(persons.length > entries) break;
      ++quadrant.y;
      set = persistentCollectionForQuadrant(quadrant);
      if(set) {
          const values = set.values()
          for(let i: i32 = 0; i<values.length; ++i) // TODO: for in
              persons.push(allPersons.getSome(values[i]));
      }
      if(persons.length > entries) break;
      --quadrant.x;
      set = persistentCollectionForQuadrant(quadrant);
      if(set) {
          const values = set.values()
          for(let i: i32 = 0; i<values.length; ++i) // TODO: for in
              persons.push(allPersons.getSome(values[i]));
      }
      if(persons.length > entries) break;
      --quadrant.x;
      set = persistentCollectionForQuadrant(quadrant);
      if(set) {
          const values = set.values()
          for(let i: i32 = 0; i<values.length; ++i) // TODO: for in
              persons.push(allPersons.getSome(values[i]));
      }
      if(persons.length > entries) break;
      --quadrant.y;
      set = persistentCollectionForQuadrant(quadrant);
      if(set) {
          const values = set.values()
          for(let i: i32 = 0; i<values.length; ++i) // TODO: for in
              persons.push(allPersons.getSome(values[i]));
      }
      if(persons.length > entries) break;
      --quadrant.y;
      set = persistentCollectionForQuadrant(quadrant);
      if(set) {
          const values = set.values()
          for(let i: i32 = 0; i<values.length; ++i) // TODO: for in
              persons.push(allPersons.getSome(values[i]));
      }
      if(persons.length > entries) break;
      ++quadrant.x;
      set = persistentCollectionForQuadrant(quadrant);
      if(set) {
          const values = set.values()
          for(let i: i32 = 0; i<values.length; ++i) // TODO: for in
              persons.push(allPersons.getSome(values[i]));
      }
      if(persons.length > entries) break;
      ++quadrant.x;
      set = persistentCollectionForQuadrant(quadrant);
      if(set) {
          const values = set.values()
          for(let i: i32 = 0; i<values.length; ++i) // TODO: for in
              persons.push(allPersons.getSome(values[i]));
      }
      if(persons.length > entries) break;

      let parent = quadrant.parentQuadrant();
      if(!parent) break; // We researched the entire Earth
      quadrant = <Quadrant>parent;
  }

  return persons;
}