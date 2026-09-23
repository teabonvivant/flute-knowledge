import csvBundle from "@/data/generated/csv_rows.json"
import topicsBundle from "@/data/generated/topics_30.json"
import peopleBundle from "@/data/flute_masters_100.json"
import { dataRowsFrom, parsePerson, parseTopic, recordFrom } from "@/lib/data/parse"
import type { DataRow, Person, Topic } from "@/lib/data/types"

const people = peopleBundle.map(parsePerson)
const topics = topicsBundle.map(parseTopic)
const csvMap = recordFrom(csvBundle, "generated CSV bundle")

export function getPeople(): Person[] { return [...people] }
export function getPerson(id: string): Person | undefined { return people.find((person) => person.id === id) }
export function getCsv(name: string): DataRow[] { return dataRowsFrom(csvMap[name], name) }
export function getTopics(): Topic[] { return [...topics] }
export function getTopic(number: string): Topic | undefined { return topics.find((topic) => topic.number === number.padStart(2, "0")) }
