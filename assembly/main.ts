import { context, logging, storage } from "near-sdk-as";
// available class: context, storage, logging, base58, base64, 
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math
import { TextMessage, Person, allPersons, persistentCollectionForQuadrant, addPerson, removePerson, MAX_DEGREE,
  personToQuadrant, Quadrant } from "./model";

// FIXME: remove
export function getWelcome(): string {
    return "www";
}

export function getPerson(account: string = context.sender): Person | null {
    return allPersons.get(account, null);
}

export function changePerson(fullname: string,
                             address: string,
                             description: string,
                             latitude: i64,
                             longtitude: i64): void {
    let person = new Person();
    person.account_id = context.sender;
    person.fullname = fullname;
    person.address = address;
    person.description = description;
    person.latitude = latitude;
    person.longtitude = longtitude;
    const oldPerson = getPerson();
    if(oldPerson) {
        removePerson(oldPerson);
        allPersons.delete(context.sender);
    }
    addPerson(person);
    allPersons.set(context.sender, person);
}

export function findNear(entries: i32, degree: i32 = MAX_DEGREE, account: string = context.sender): Person[] {
    const me = getPerson(account);
    if(!me) return [];
    let quadrant = personToQuadrant(me, degree);

    let persons: Person[] = [];

    for(; degree >= 0; --degree) {
      // Iterate nearby quadrants:
      // FIXME: Wrap at edges of the square Earth.

      ++quadrant.x;
      let set = persistentCollectionForQuadrant(quadrant);
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