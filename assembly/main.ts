import { context, logging, storage } from "near-sdk-as";
// available class: context, storage, logging, base58, base64, 
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math
import { TextMessage, Person, persons, addPerson, removePerson, MAX_DEGREE, personToQuadrant } from "./model";

export function getPerson(): Person {
    return persons.get(context.sender)
}

export function changePerson(person: Person): void {
    const oldPerson = getPerson();
    if(!oldPerson) {
        removePerson(person);
        persons.delete(context.sender);
    }
    addPerson(person);
    persons.set(context.sender, person);
}

export function findNear(degree: number = MAX_DEGREE) {
    let quadrant = personToQuadrant(getPerson(), degree);
}