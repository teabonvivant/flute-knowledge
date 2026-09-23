import type { DataRow, Person, Topic } from "@/lib/data"

const topicTerms: Readonly<Record<string, readonly string[]>> = {
  "01": ["flautist", "soloist", "orchestral principal"],
  "02": ["professor", "pedagogy", "teaching"],
  "03": ["lineage", "school", "tradition", "pedagogy"],
  "04": ["recording", "recordings", "recording history"],
  "05": ["literature", "author", "bibliography", "source reading", "research"],
  "06": ["method", "etudes", "daily exercises", "practice systems", "pedagogy"],
  "07": ["repertoire", "solo repertoire", "chamber music"],
  "08": ["graded", "beginner", "student", "pedagogy"],
  "09": ["orchestral excerpts", "audition", "orchestral principal"],
  "10": ["concerto", "concertos"],
  "11": ["baroque", "traverso", "historical performance", "early music"],
  "12": ["classical style", "romantic", "19th-century", "classical concertos"],
  "13": ["contemporary", "new music", "modernism", "extended"],
  "14": ["extended techniques", "contemporary notation", "glissando", "circular breathing"],
  "15": ["tone", "sonority", "sound", "resonance"],
  "16": ["breathing", "breath"],
  "17": ["embouchure", "tone-hole", "blowing"],
  "18": ["articulation", "tongue", "rhythm"],
  "19": ["vibrato", "phrasing", "expression", "singing"],
  "20": ["intonation", "tuning", "scale tuning"],
  "21": ["fingerings", "fingering"],
  "22": ["phrasing", "rhetoric", "interpretation", "style"],
  "23": ["pedagogy", "teaching", "professor", "method"],
  "24": ["competition", "audition", "competition repertoire"],
  "25": ["body use", "health", "breathing", "remediation"],
  "26": ["acoustics", "mechanism", "construction", "boehm", "headjoint"],
  "27": ["piccolo", "alto flute", "bass flute", "doubling", "flute family"],
  "28": ["women", "diversity", "representation", "social mission"],
  "29": ["jazz", "crossover", "improvisation", "asian", "latin american", "korean", "japanese", "world"],
  "30": ["institution", "competition", "journal", "author", "conservatoire"]
}

export function getRelatedPeopleForTopic(topic: Topic, people: readonly Person[], mapRows: readonly DataRow[], limit = 4): Person[] {
  const terms = topicTerms[topic.number] ?? []
  const mappedTerms = new Map<string, string[]>()
  for (const row of mapRows) {
    const personId = row["person_id"]
    const keyword = row["topic_keyword"]
    if (!personId || !keyword) continue
    const existing = mappedTerms.get(personId) ?? []
    existing.push(keyword)
    mappedTerms.set(personId, existing)
  }

  return people
    .map((person) => {
      const mapped = mappedTerms.get(person.id) ?? []
      const text = [
        person.core_topics,
        person.roles,
        person.school_lineage,
        person.selection_basis,
        person.recordings_repertoire,
        person.literature,
        person.research_keywords ?? "",
        ...mapped
      ].join(" ").toLocaleLowerCase("en")
      const score = terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0)
      return { person, score }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || left.person.id.localeCompare(right.person.id))
    .slice(0, limit)
    .map((item) => item.person)
}
