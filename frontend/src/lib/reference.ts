// Linguistic facts, with original examples supplied in the interface.
export const irregularVerbs = `be|was / were|been|ser / estar
become|became|become|convertirse
begin|began|begun|empezar
break|broke|broken|romper
bring|brought|brought|traer
build|built|built|construir
buy|bought|bought|comprar
catch|caught|caught|atrapar
choose|chose|chosen|elegir
come|came|come|venir
cost|cost|cost|costar
cut|cut|cut|cortar
do|did|done|hacer
drink|drank|drunk|beber
drive|drove|driven|conducir
eat|ate|eaten|comer
fall|fell|fallen|caer
feel|felt|felt|sentir
fight|fought|fought|pelear
find|found|found|encontrar
fly|flew|flown|volar
forget|forgot|forgotten|olvidar
freeze|froze|frozen|congelar
get|got|got / gotten|obtener
give|gave|given|dar
go|went|gone|ir
grow|grew|grown|crecer
have|had|had|tener
hear|heard|heard|oír
hit|hit|hit|golpear
keep|kept|kept|guardar
know|knew|known|saber / conocer
learn|learnt / learned|learnt / learned|aprender
leave|left|left|salir / dejar
lend|lent|lent|prestar
let|let|let|dejar / permitir
lose|lost|lost|perder
make|made|made|hacer / crear
meet|met|met|conocer / reunirse
pay|paid|paid|pagar
put|put|put|poner
read|read|read|leer
ride|rode|ridden|montar
ring|rang|rung|sonar
run|ran|run|correr
say|said|said|decir
see|saw|seen|ver
sell|sold|sold|vender
send|sent|sent|enviar
shut|shut|shut|cerrar
sing|sang|sung|cantar
sit|sat|sat|sentarse
sleep|slept|slept|dormir
speak|spoke|spoken|hablar
spend|spent|spent|pasar tiempo / gastar
stand|stood|stood|estar de pie
steal|stole|stolen|robar
swim|swam|swum|nadar
take|took|taken|tomar / llevar
teach|taught|taught|enseñar
tell|told|told|contar / decir
think|thought|thought|pensar
throw|threw|thrown|lanzar
understand|understood|understood|entender
wake|woke|woken|despertar
wear|wore|worn|llevar puesto
win|won|won|ganar
write|wrote|written|escribir`.split("\n").map(line => line.split("|"));

export const soundGroups: { title: string; sounds: [string, string, string | null][] }[] = [
  { title: "Vocales", sounds: [["iː", "tree", "0069"], ["ɪ", "ship", "026A"], ["ʊ", "good", "028A"], ["uː", "school", "0075"], ["e", "ten", "0065"], ["ə", "about", "0259"], ["ɜː", "bird", "025C"], ["ɔː", "four", "0254"], ["æ", "hat", "00E6"], ["ʌ", "sun", "028C"], ["ɑː", "car", "0251"], ["ɒ", "clock", "0252"]] },
  { title: "Consonantes", sounds: [["p", "pen", "0070"], ["b", "big", "0062"], ["t", "tea", "0074"], ["d", "day", "0064"], ["tʃ", "chair", null], ["dʒ", "journey", null], ["k", "cat", "006B"], ["g", "go", "0261"], ["f", "fly", "0066"], ["v", "very", "0076"], ["θ", "think", "03B8"], ["ð", "this", "00F0"], ["s", "see", "0073"], ["z", "zoo", "007A"], ["ʃ", "shoe", "0283"], ["ʒ", "vision", "0292"], ["m", "man", "006D"], ["n", "never", "006E"], ["ŋ", "sing", "014B"], ["h", "hot", "0068"], ["l", "like", "006C"], ["r", "river", "0279"], ["w", "water", "0077"], ["j", "yes", "006A"]] },
  { title: "Diptongos · escucha la palabra de ejemplo", sounds: [["ɪə", "near", null], ["ʊə", "tour", null], ["eə", "wear", null], ["eɪ", "train", null], ["ɔɪ", "boy", null], ["aɪ", "try", null], ["əʊ", "so", null], ["aʊ", "out", null]] },
];
