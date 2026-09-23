import { splitValues, truncate } from "@/lib/utils"
import type { Person } from "@/lib/data/types"

const selectionBasisZh: Readonly<Record<string, string>> = {
  FM001: "以演奏家兼作者身份，寫下十八世紀長笛教學與風格的核心文獻。",
  FM002: "其樂器設計奠定了現代西方音樂會長笛的基本形制。",
  FM003: "這位英國炫技演奏家的音色，曾直接啟發伯姆思考長笛設計。",
  FM004: "在伯姆系統全面普及之前，他是十九世紀法國長笛教學的核心人物。",
  FM005: "承接早期法國長笛傳統，並把演奏與教學帶入現代法國學派。",
  FM006: "在法國音樂院任教，所著長笛教程成為後世常用的教學文獻。",
  FM007: "透過演奏、巴黎音樂院教學與曲目推廣，奠定現代法國長笛學派。",
  FM008: "同時從事演奏、作曲與音樂院教學，作品與課堂都延續法國學派。",
  FM009: "多位二十世紀法國長笛家的教學源頭，都可追溯到他的課堂。",
  FM010: "把法國學派帶到美國，同時積極推動當時的新長笛曲目。",
  FM011: "早期力倡現代長笛獨奏曲目，為二十世紀演奏文化開拓了位置。",
  FM012: "所編寫的音色、長音與技巧練習，至今仍見於各地長笛課堂。",
  FM013: "先受法國演奏傳統訓練，其後在美國演出和任教，連起兩地傳承。",
  FM014: "戰後多位法國長笛家出自其門下，課堂形成清晰的師承脈絡。",
  FM015: "在伊士曼音樂學院任教，並寫下長笛史研究的常用參考著作。",
  FM016: "在美國主要樂團擔任首席，把法國學派的訓練帶進當地樂團。",
  FM017: "以首席長笛與教師身份，參與建立美國長笛的樂團與專業訓練傳統。",
  FM018: "曾在伊士曼音樂學院任教，也任羅徹斯特愛樂樂團首席；可由院校職歷和師承資料了解其教學脈絡。",
  FM019: "長期兼顧美國樂團演奏與院校教學，多代專業長笛家曾受其指導。",
  FM020: "以密集的獨奏會和錄音，把長笛帶進二十世紀主流音樂會市場。",
  FM021: "在朗帕爾之後活躍於法國的獨奏與教學舞台，承接兩代演奏傳統。",
  FM022: "以獨奏和教學見稱，並獲美國長笛協會頒發終身成就獎。",
  FM023: "演出範圍由標準曲目延伸至當代音樂，兩方面均留下可供比較的錄音。",
  FM024: "把演奏、教學和著述帶到多個國家，形成跨地域的學生傳承。",
  FM025: "首演及推動多部二十世紀新作，令當代長笛曲目進入常設舞台。",
  FM026: "透過獨奏會、錄音與媒體演出，把長笛帶到古典樂圈以外的聽眾面前。",
  FM027: "曾任倫敦交響樂團和英國室樂團長笛，並在英國皇家音樂學院及弗萊堡任教。",
  FM028: "在英國樂團任職，其後於大西洋兩岸任教，學生分布英美兩地。",
  FM029: "活躍於法國與美國的名師，並著有廣為使用的長笛教學書。",
  FM030: "所著長笛練習系列在多地音樂院與私人課堂使用，涵蓋技巧和曲目訓練。",
  FM031: "以演奏、編訂和教學擴闊可用曲目，讓更多學習者接觸長笛文獻。",
  FM032: "先後在奧柏林音樂學院和皮博蒂音樂學院任教，研究可由室內樂和教學脈絡入手。",
  FM033: "以室內樂演奏和院校授課並行，把合奏經驗帶進美國長笛教學。",
  FM034: "先後在美國主要樂團演奏和院校任教，課堂建立於實際樂團經驗。",
  FM035: "美國女性長笛家的先驅，成就獲美國長笛協會終身成就獎肯定。",
  FM036: "在波士頓交響樂團長期擔任首席長笛，是女性參與美國職業樂團的重要人物。",
  FM037: "在波士頓交響樂團演奏，並以短笛專業建立鮮明的職業位置。",
  FM038: "長期擔任首席長笛，同時任教，學生延續其樂團演奏方法。",
  FM039: "以短笛演奏和著述整理美國樂團的短笛技巧與曲目經驗。",
  FM040: "把首席短笛的樂團經驗整理成教學方法，供專業演奏者訓練。",
  FM041: "長期出任芝加哥交響樂團首席長笛，也以文字記錄樂團工作。",
  FM042: "把樂團片段的聲部經驗整理成教材，並在美國院校長期任教。",
  FM043: "在伊士曼音樂學院任教及演出，學生其後進入多地樂團與院校。",
  FM044: "長期從事獨奏，也委約新作，為美國長笛曲目增加當代作品。",
  FM045: "兼具樂團與院校經驗，並與法國學派有深厚的師承聯繫。",
  FM046: "演出涵蓋獨奏與室內樂，可由不同編制比較其音色和樂句處理。",
  FM047: "工作橫跨長笛獨奏、指揮與教學，呈現演奏者職涯的多種路徑。",
  FM048: "兼任長笛家、作曲家、指揮和教授，工作連結多倫多大學與 New Music Concerts。",
  FM049: "在爵士與古典之間建立鮮明聲音，是美國長笛協會肯定的跨界先驅。",
  FM050: "曾任費城樂團和底特律交響樂團，後在印第安納大學任教；著作涉及曲目索引、指法和試演準備。",
  FM051: "以演奏、作曲和教材系統整理多音、循環換氣等擴展技法。",
  FM052: "在美國演奏及創作新音樂，持續把實驗聲響帶進長笛曲目。",
  FM053: "在歐洲長期任教，並獲美國長笛協會頒發終身成就獎。",
  FM054: "專注專業長笛訓練，課堂方法由學生帶到不同樂團與院校。",
  FM055: "兼具美國主要樂團與跨界演出經驗，演奏面向十分廣闊。",
  FM056: "以歷史樂器、原典與時期風格重建早期長笛的現代演奏實踐。",
  FM057: "除直笛外亦演奏橫笛，其早期音樂工作連結了長笛與歷史演奏運動。",
  FM058: "在英國演奏及教授歷史長笛，把實物樂器與時期風格帶進課堂。",
  FM059: "參與歐洲早期音樂復興，以歷史長笛演出巴羅克及古典曲目。",
  FM060: "兼任歷史長笛演奏家與作者，文字研究可與錄音實踐互相對照。",
  FM061: "在英國演奏歷史長笛並於院校任教，連結舞台與專業訓練。",
  FM062: "在北美演奏歷史長笛，專注早期曲目的樂器、裝飾與句法。",
  FM063: "以演奏和教學整理當代長笛技法，為法國新音樂建立實作資源。",
  FM064: "兼任獨奏家與指揮，錄音橫跨常規曲目及較少演出的作品。",
  FM065: "在法國任教，並著有專書分析口型、氣流與發音的關係。",
  FM066: "同時從事樂團首席與國際獨奏，可比較兩種舞台角色的演奏取向。",
  FM067: "累積主要樂團首席與國際教學經驗，課堂緊扣樂團實務。",
  FM068: "長期巡迴獨奏，亦在音樂院任教，把舞台經驗帶回專業課堂。",
  FM069: "錄音成果豐富，並以大量委約作品擴闊當代長笛曲目。",
  FM070: "兼任樂團長笛家與教師，教學特別重視炫技曲目的控制與效率。",
  FM071: "先有首席長笛經驗，其後在德國任教，課堂建基於樂團實務。",
  FM072: "在瑞士任教，多地職業演奏者出自其課堂，形成國際學生網絡。",
  FM073: "同時擔任樂團首席與院校教師，工作連起日常樂團和專業訓練。",
  FM074: "兼具英國樂團與院校經驗，並獲美國長笛協會終身成就獎。",
  FM075: "以演奏和授課巡訪多國，教學方法強調聆聽、身體與音樂溝通。",
  FM076: "在倫敦擔任樂團首席，亦透過公開講解分享樂團工作。",
  FM077: "在英國兼任樂團長笛與教授，把演出曲目帶進院校訓練。",
  FM078: "兼顧主要樂團首席與教學，課堂內容緊貼職業樂團要求。",
  FM079: "長期擔任倫敦主要樂團首席，教學材料亦廣受採用。",
  FM080: "在美國主要樂團擔任首席，亦於柯蒂斯音樂學院任教。",
  FM081: "曾任聖路易交響樂團首席長笛，並在德保羅大學及 Aspen 音樂節任教；研究重點包括樂團片段和試演準備。",
  FM082: "年輕時已獲克里夫蘭管弦樂團首席席位，職涯集中於樂團演奏。",
  FM083: "在美國大學長期任教，教材與課堂涵蓋學生至專業階段。",
  FM084: "來自新西蘭、活躍國際舞台的獨奏家兼教授。",
  FM085: "長期任教並編寫分級教材，把技巧、曲目與課堂次序整理成書。",
  FM086: "撰寫多部長笛教材，並獲美國長笛協會終身成就獎。",
  FM087: "在紐約兼任教師與室內樂演奏家，課堂重視合作和曲目實踐。",
  FM088: "在美國從事室內樂和院校教學，合作編制涵蓋多種樂器組合。",
  FM089: "以當代室內樂演奏和教授身份，持續把新作帶進課堂。",
  FM090: "在美洲從事教學與音樂活動策劃，連結學生、演奏者和節慶平台。",
  FM091: "以亞洲長笛獨奏家身份巡演多國，曲目與舞台活動具國際規模。",
  FM092: "在日本與法國學習、演奏和任教，連結兩地長笛傳統。",
  FM093: "帶着法國學派訓練回到日本演奏和任教，形成跨地域傳承。",
  FM094: "以比賽、獨奏和國際演出進入日本新一代長笛家的視野。",
  FM095: "活躍於歐洲樂團與獨奏舞台的日本長笛家。",
  FM096: "以法國長笛訓練連結荷蘭樂團工作、室內樂與錄音。",
  FM097: "擔任巴黎管弦樂團首席，並參與巴黎音樂院的長笛教學。",
  FM098: "活躍於意大利與歐洲的教授及樂團演奏家。",
  FM099: "曾在萊比錫與柏林擔任樂團首席，其後從事獨奏與教學。",
  FM100: "兼任美國樂團首席、教授與文化倡議者，工作橫跨舞台、課堂和社群。"
}

const regionZh: Readonly<Record<string, string>> = {
  Belgium: "比利時",
  Canada: "加拿大",
  "Canada / United States": "加拿大／美國",
  "Chile / United States": "智利／美國",
  France: "法國",
  "France / United States": "法國／美國",
  Germany: "德國",
  "Germany / Prussia": "德國／普魯士",
  "Hungary / Denmark / Germany": "匈牙利／丹麥／德國",
  "Israel / Sweden": "以色列／瑞典",
  Italy: "意大利",
  "Italy / Germany": "意大利／德國",
  "Italy / United States": "意大利／美國",
  Japan: "日本",
  "Japan / Finland": "日本／芬蘭",
  "Japan / France": "日本／法國",
  "Lebanon / United Kingdom": "黎巴嫩／英國",
  Netherlands: "荷蘭",
  "Netherlands / Switzerland": "荷蘭／瑞士",
  "New Zealand / United States": "新西蘭／美國",
  "Northern Ireland / United Kingdom": "北愛爾蘭／英國",
  "Russia / United States": "俄羅斯／美國",
  "South Korea / United States": "韓國／美國",
  Switzerland: "瑞士",
  "Switzerland / France": "瑞士／法國",
  "Switzerland / Germany": "瑞士／德國",
  "United Kingdom": "英國",
  "United Kingdom / Netherlands": "英國／荷蘭",
  "United Kingdom / United States": "英國／美國",
  "United States": "美國",
  "United States / Italy": "美國／意大利"
}

const eraZh: Readonly<Record<string, string>> = {
  Baroque: "巴羅克時期",
  "19th century": "十九世紀",
  "late 19th century": "十九世紀後期",
  "late 19th / early 20th century": "十九世紀後期至二十世紀初",
  "early 20th century": "二十世紀初",
  "20th century": "二十世紀",
  "20th / 21st century": "二十至二十一世紀",
  "21st century": "二十一世紀"
}

const roleZh: Readonly<Record<string, string>> = {
  author: "作者",
  "breathing specialist": "呼吸法專家",
  "chamber musician": "室內樂演奏家",
  "competition winner": "國際比賽得主",
  composer: "作曲家",
  conductor: "指揮",
  "contemporary music advocate": "當代音樂推動者",
  "contemporary music specialist": "當代音樂專家",
  "Curtis professor": "柯蒂斯音樂學院教授",
  editor: "編訂者",
  educator: "音樂教育家",
  "Eastman professor": "伊士曼音樂學院教授",
  "festival director": "音樂節總監",
  flautist: "長笛家",
  flutist: "長笛家",
  "flute maker": "長笛製作者",
  historian: "音樂史研究者",
  "humanitarian artist": "人道藝術倡議者",
  improviser: "即興演奏家",
  inventor: "發明家",
  "jazz and classical crossover artist": "爵士與古典跨界演奏家",
  "jazz/classical artist": "爵士與古典跨界演奏家",
  "Juilliard/Curtis professor": "茱莉亞／柯蒂斯教授",
  "method author": "教材作者",
  "Oberlin professor": "奧柏林音樂學院教授",
  "orchestral principal": "樂團首席長笛",
  "orchestral trailblazer": "樂團界先驅",
  "orchestral/chamber musician": "樂團與室內樂演奏家",
  "Paris Conservatoire professor": "巴黎音樂院教授",
  pedagogue: "長笛教育家",
  pianist: "鋼琴家",
  piccoloist: "短笛演奏家",
  professor: "教授",
  "recorder player": "直笛演奏家",
  "recording artist": "錄音藝術家",
  soloist: "獨奏家",
  teacher: "老師",
  "traverso player": "歷史橫笛演奏家"
}

const topicRules: readonly Readonly<[RegExp, string]>[] = [
  [/piccolo/i, "短笛演奏"],
  [/historical|baroque|traverso|early music|18th-century/i, "歷史演奏法"],
  [/contemporary|extended|new music|commission/i, "當代曲目與擴展技法"],
  [/jazz|crossover|improvis/i, "爵士與跨界演奏"],
  [/acoustic|mechanism|tone-hole|construction|flute design|maker/i, "長笛聲學與製作"],
  [/orchestral|orchestra|excerpt|audition/i, "樂團演奏與試演"],
  [/pedagog|teach|method|professor|student/i, "長笛教學法"],
  [/tone|embouchure|sonority|sound/i, "音色與口型"],
  [/articulation|tongu/i, "吐音與發音"],
  [/breath/i, "呼吸與氣息"],
  [/intonation|tuning/i, "音準"],
  [/chamber/i, "室內樂"],
  [/French school|German school|American school|school|lineage/i, "學派與師承"],
  [/repertoire|recording|solo|virtuos/i, "獨奏曲目與錄音"],
  [/composer|composition/i, "作曲與作品"],
  [/rhetoric|ornament/i, "音樂修辭與裝飾奏"],
  [/career|women|diversity|advocacy/i, "音樂文化與專業發展"]
]

export function personSelectionBasis(person: Person): string {
  return selectionBasisZh[person.id] ?? "這份檔案記錄此人在演奏、教育、曲目或長笛文化中的工作。"
}

export function personRegion(person: Person): string {
  return regionZh[person.country_region] ?? person.country_region
}

export function personEra(person: Person): string {
  return eraLabel(person.era)
}

export function eraLabel(era: string): string {
  return eraZh[era] ?? era
}

export function personRoles(person: Person): string {
  const roles = splitValues(person.roles).map((role) => roleZh[role]).filter((role): role is string => Boolean(role))
  return [...new Set(roles)].join("、") || "長笛演奏及教育工作者"
}

export function personTopics(person: Person): readonly string[] {
  const topics = splitValues(person.core_topics).flatMap((topic) => {
    const match = topicRules.find(([pattern]) => pattern.test(topic))
    return match ? [match[1]] : []
  })
  return [...new Set(topics)]
}

export function personSummary(person: Person): string {
  const basis = personSelectionBasis(person)
  const topics = personTopics(person).slice(0, 3).join("、")
  return truncate(`${basis}${topics ? ` 閱讀時可留意：${topics}。` : ""}`, 150)
}

export function chunkRows<T>(rows: readonly T[], size = 80): readonly T[][] {
  return Array.from({ length: Math.ceil(rows.length / size) }, (_item, index) => rows.slice(index * size, index * size + size))
}
