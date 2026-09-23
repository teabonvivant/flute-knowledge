import professorBundle from "@/data/professor_guides.json"
import type { Topic } from "@/lib/data"

export type ProfessorSource = (typeof professorBundle.sources)[number]
export type TopicGuide = (typeof professorBundle.guides)[number]

export const professorMethod = professorBundle.method
export const professorSources = professorBundle.sources
export const topicGuides = professorBundle.guides

const guideMap = new Map(topicGuides.map((guide) => [guide.number, guide]))
const sourceMap = new Map(professorSources.map((source) => [source.id, source]))

export function getTopicGuide(topic: Topic): TopicGuide {
  const guide = guideMap.get(topic.number)
  if (!guide) throw new Error(`Missing professor guide for flute topic ${topic.number}`)
  return guide
}

export function getTopicGuideSources(guide: TopicGuide): ProfessorSource[] {
  return guide.sourceIds.flatMap((id) => {
    const source = sourceMap.get(id)
    return source ? [source] : []
  })
}
