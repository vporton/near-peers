import { context, logging, storage } from "near-sdk-as";
// available class: context, storage, logging, base58, base64, 
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math
import { TextMessage, Person, allPersons, persistentCollectionForQuadrant, addPerson, removePerson, MAX_DEGREE,
  personToQuadrant, Quadrant } from "./model";

export function getPerson(): Person | null {
    return allPersons.get(context.sender)
}

export function changePerson(person: Person): void {
    const oldPerson = getPerson();
    if(!oldPerson) {
        removePerson(person);
        allPersons.delete(context.sender);
    }
    addPerson(person);
    allPersons.set(context.sender, person);
}

export function findNear(entries: i32, degree: i32 = MAX_DEGREE): Person[] {
    const me = getPerson();
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