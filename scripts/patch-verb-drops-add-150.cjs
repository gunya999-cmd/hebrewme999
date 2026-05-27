const fs=require('fs');const path=require('path');
const file=path.join(process.cwd(),'src','data','verbDrops.ts');
let source=fs.readFileSync(file,'utf8');
const RAW=String.raw`להגיד|леhаги́д|сказать|הפעיל|נגד|communication|say
להביא|леhави́|приносить|הפעיל|בוא|daily|bring
לעזור|лаазо́р|помогать|פעל|עזר|daily|help
לקבל|лекабе́ль|получать|פיעל|קבל|daily|receive
להסביר|леhасби́р|объяснять|הפעיל|סבר|communication|explain
להגיע|леhаги́а|прибывать|הפעיל|נגע|movement|arrive
להחליט|леhахли́т|решать|הפעיל|חלט|daily|decide
להשתמש|леhишта́меш|пользоваться|התפעל|שמש|daily|use
להצליח|леhацли́ах|получаться / преуспевать|הפעיל|צלח|daily|succeed
להתקשר|леhиткаше́р|звонить / связываться|התפעל|קשר|communication|call
לנסוע|линсо́а|ехать|פעל|נסע|movement|travel
לגור|лаго́р|жить / проживать|פעל|גור|home|live
לישון|лишо́н|спать|פעל|ישן|home|sleep
לקום|лаку́м|вставать|פעל|קומ|daily|wake-stand
לחכות|лехако́т|ждать|פיעל|חכה|daily|wait
לנסות|ленасо́т|пытаться|פיעל|נסה|daily|try
לשלוח|лишло́ах|отправлять|פעל|שלח|communication|send
להראות|леhаръо́т|показывать|הפעיל|ראה|communication|show
לספר|лесапе́р|рассказывать|פיעל|ספר|communication|tell
להזמין|леhазми́н|приглашать / заказывать|הפעיל|זמנ|daily|invite-order
להכין|леhахи́н|готовить / подготавливать|הפעיל|כונ|daily|prepare
לפגוש|лифго́ш|встречать|פעל|פגש|communication|meet-person
לשחק|лесахе́к|играть|פיעל|שחק|daily|play
לזכור|лизко́р|помнить|פעל|זכר|study|remember
לשכוח|лишко́ах|забывать|פעל|שכח|study|forget
להקשיב|леhакши́в|слушать внимательно|הפעיל|קשב|communication|listen-carefully
לבדוק|ливдо́к|проверять|פעל|בדק|study|check
לבחור|ливхо́р|выбирать|פעל|בחר|daily|choose
להאמין|леhаами́н|верить|הפעיל|אמנ|daily|believe
להוסיף|леhоси́ф|добавлять|הפעיל|יספ|daily|add
להוריד|леhори́д|спускать / скачивать|הפעיל|ירד|daily|download-lower
להעלות|леhаало́т|поднимать / загружать|הפעיל|עלה|daily|upload-raise
להוציא|леhоци́|вынимать / выводить|הפעיל|יצא|daily|take-out
להכניס|леhахни́с|вносить / вставлять|הפעיל|כנס|daily|put-in
להחזיר|леhахзи́р|возвращать|הפעיל|חזר|daily|return-object
להשאיר|леhашъи́р|оставлять|הפעיל|שאר|daily|leave-behind
להחליף|леhахли́ф|менять / заменять|הפעיל|חלפ|daily|replace
להספיק|леhаспи́к|успевать|הפעיל|ספק|daily|manage-time
להזכיר|леhазки́р|напоминать|הפעיל|זכר|communication|remind
להודיע|леhоди́а|сообщать|הפעיל|ידע|communication|notify
להסכים|леhаски́м|соглашаться|הפעיל|סכמ|communication|agree
להמליץ|леhамли́ц|рекомендовать|הפעיל|מלצ|communication|recommend
להוביל|леhови́ль|вести / перевозить|הפעיל|יבל|movement|lead-transport
להפעיל|леhафъи́ль|включать / запускать|הפעיל|פעל|daily|activate
להציל|леhаци́ль|спасать|הפעיל|נצל|daily|save-rescue
להדליק|леhадли́к|включать свет / зажигать|הפעיל|דלק|home|turn-on
לכבות|лехабо́т|выключать / тушить|פיעל|כבה|home|turn-off
לסיים|лесае́м|заканчивать|פיעל|סימ|daily|finish
לשנות|лешано́т|менять|פיעל|שנה|daily|change
לשפר|лешапе́р|улучшать|פיעל|שפר|study|improve
לקדם|лекаде́м|продвигать|פיעל|קדמ|daily|promote
לטפל|летапе́ль|заниматься / лечить|פיעל|טפל|daily|handle-treat
לפתח|лефате́ах|развивать|פיעל|פתח|study|develop
לנהל|ленаhе́ль|управлять|פיעל|נהל|daily|manage
לפרסם|лефарсе́м|публиковать|פיעל|פרסמ|communication|publish
לתרגם|летарге́м|переводить|פיעל|תרגמ|study|translate
לחלק|лехале́к|делить / раздавать|פיעל|חלק|study|divide
לציין|лецае́н|отмечать / указывать|פיעל|צינ|communication|mention
לקשר|лекаше́р|связывать|פיעל|קשר|communication|connect
לנגן|ленаге́н|играть на инструменте|פיעל|נגנ|daily|play-music
לצייר|лецае́р|рисовать|פיעל|ציר|study|draw
לצלם|лецале́м|фотографировать|פיעל|צלמ|daily|photo
לחייך|лехайе́х|улыбаться|פיעל|חייכ|communication|smile
לבקש|леваке́ш|просить|פיעל|בקש|communication|request
ללמד|леламе́д|учить кого-то|פיעל|למד|study|teach
לברר|левара́р|выяснять|פיעל|ברר|communication|clarify
לשחרר|лешахре́р|освобождать|פיעל|שחרר|daily|release
למסור|лимсо́р|передавать|פעל|מסר|communication|deliver
להתאמן|леhитаме́н|тренироваться|התפעל|אמנ|daily|train
להתלבש|леhитлабе́ш|одеваться|התפעל|לבש|daily|get-dressed
להתקלח|леhиткале́ах|принимать душ|התפעל|קלח|home|shower
להתעורר|леhиторэ́р|просыпаться|התפעל|עור|daily|wake-up
להתיישב|леhитяше́в|садиться / устраиваться|התפעל|ישב|home|sit-down
להתפתח|леhитпате́ах|развиваться|התפעל|פתח|study|self-develop
להתבלבל|леhитбальбе́ль|путаться|התפעל|בלבל|study|get-confused
להתלהב|леhитлаhе́в|воодушевляться|התפעל|להב|daily|get-excited
להתווכח|леhитваке́ах|спорить|התפעל|וכח|communication|argue
להתגעגע|леhитгааге́а|скучать по кому-то|התפעל|געגע|daily|miss-someone
להתחתן|леhитхате́н|жениться / выходить замуж|התפעל|חתנ|daily|marry
להתגרש|леhитгаре́ш|разводиться|התפעל|גרש|daily|divorce
להתנצל|леhитнаце́ль|извиняться|התפעל|נצל|communication|apologize
להתעניין|леhитанье́н|интересоваться|התפעל|ענינ|study|be-interested
להתנדב|леhитнаде́в|волонтёрить|התפעל|נדב|daily|volunteer
להתקבל|леhиткабе́ль|быть принятым|התפעל|קבל|study|be-accepted
להתקרב|леhиткаре́в|приближаться|התפעל|קרב|movement|approach
להתרחק|леhитрахе́к|отдаляться|התפעל|רחק|movement|move-away
להתנהג|леhитнаhе́г|вести себя|התפעל|נהג|daily|behave
להתמודד|леhитмоде́д|справляться|התפעל|מודד|daily|cope
להתכונן|леhитконэ́н|готовиться|התפעל|כונ|study|get-ready
להתכתב|леhиткате́в|переписываться|התפעל|כתב|communication|text-each-other
להתייעץ|леhитьяэ́ц|советоваться|התפעל|יעצ|communication|consult
להתעלם|леhитале́м|игнорировать|התפעל|עלמ|communication|ignore
להשתתף|леhишта́теф|участвовать|התפעל|שתפ|study|participate
להשתנות|леhиштано́т|изменяться|התפעל|שנה|daily|change-self
להתרגש|леhитраге́ш|волноваться|התפעל|רגש|daily|be-moved
להסתדר|леhистаде́р|справляться / ладить|התפעל|סדר|daily|manage-oneself
להסתכל|леhистаке́ль|смотреть|התפעל|סכל|daily|look-at
להסתובב|леhистове́в|прогуливаться / вращаться|התפעל|סובב|movement|walk-around
להתרגל|леhитраге́ль|привыкать|התפעל|רגל|daily|get-used
להתאמץ|леhитаме́ц|стараться|התפעל|אמץ|daily|make-effort
להתבייש|леhитбае́ш|стесняться|התפעל|בוש|daily|be-ashamed
להתפלל|леhитпале́ль|молиться|התפעל|פלל|daily|pray
להתפטר|леhитпате́р|увольняться|התפעל|פטר|daily|resign
להיפגש|леhипаге́ш|встречаться|נפעל|פגש|communication|meet-up
להיזכר|леhизахе́р|вспоминать|נפעל|זכר|study|recall
להישבר|леhишаве́р|ломаться|נפעל|שבר|home|break
להיפתח|леhипате́ах|открываться|נפעל|פתח|home|open-self
להיסגר|леhисаге́р|закрываться|נפעל|סגר|home|close-self
להירדם|леhираде́м|засыпать|נפעל|רדמ|home|fall-asleep
להיעלם|леhиале́м|исчезать|נפעל|עלמ|daily|disappear
להימצא|леhимаце́|находиться|נפעל|מצא|daily|be-located
להיבנות|леhибано́т|строиться|נפעל|בנה|home|be-built
להיקרא|леhикаре́|называться / быть прочитанным|נפעל|קרא|study|be-called
להיגמר|леhигаме́р|заканчиваться|נפעל|גמר|daily|end
להימשך|леhимаше́х|продолжаться|נפעל|משכ|daily|continue-passive
להיוולד|леhивале́д|рождаться|נפעל|ילד|daily|be-born
להילחם|леhилахе́м|сражаться|נפעל|לחמ|daily|fight
להיזהר|леhизахе́р|остерегаться|נפעל|זהר|daily|be-careful
להיכשל|леhикаше́ль|проваливаться / терпеть неудачу|נפעל|כשל|study|fail
להיעצר|леhиаце́р|останавливаться / быть арестованным|נפעל|עצר|daily|be-stopped
להיבחר|леhибахе́р|быть выбранным|נפעל|בחר|daily|be-chosen
להיפרד|леhипаре́ד|расставаться|נפעל|פרד|communication|separate
להישמע|леhишама́|звучать / быть услышанным|נפעל|שמע|communication|sound
להיענות|леhиано́т|откликаться|נפעל|ענה|communication|respond-passive
להיקלט|леhикале́т|усваиваться / приниматься|נפעל|קלט|study|be-absorbed
להינצל|леhинаце́ль|спасаться|נפעל|נצל|daily|be-saved
להיפגע|леhипаге́а|пострадать / обидеться|נפעל|פגע|daily|be-hurt
להיתפס|леhитапе́с|быть пойманным|נפעל|תפס|daily|be-caught
להיחשב|леhихаше́в|считаться|נפעל|חשב|study|be-considered
להיכתב|леhикате́в|быть написанным|נפעל|כתב|study|be-written
להיאמר|леhеаме́р|быть сказанным|נפעל|אמר|communication|be-said
להיערך|леhеарэ́х|готовиться / проводиться|נפעל|ערכ|daily|be-arranged
להישמר|леhишаме́р|сохраняться|נפעל|שמר|daily|be-kept
לגדול|лигдо́ль|расти|פעל|גדל|daily|grow
ליפול|липо́ль|падать|פעל|נפל|movement|fall
לעמוד|лаамо́д|стоять|פעל|עמד|daily|stand
לרדת|ларе́дет|спускаться|פעל|ירד|movement|go-down
לעלות|лаало́т|подниматься|פעל|עלה|movement|go-up
לרוץ|лару́ц|бежать|פעל|רוצ|movement|run
לשיר|лаши́р|петь|פעל|שיר|daily|sing
לרקוד|лирко́д|танцевать|פעל|רקד|daily|dance
לשחות|лисхо́т|плавать|פעל|שחה|movement|swim
לטוס|лату́с|лететь|פעל|טוס|movement|fly
לשמור|лишמו́р|сохранять / охранять|פעל|שמר|daily|keep
למכור|лимко́р|продавать|פעל|מכר|daily|sell
לספור|лисфо́р|считать|פעל|ספר|study|count
למדוד|лимдо́д|мерить|פעל|מדד|daily|measure
לחתוך|лахто́х|резать|פעל|חתכ|food|cut
לזרוק|лизро́к|бросать|פעל|זרק|daily|throw
למשוך|лимшо́х|тянуть|פעל|משכ|daily|pull
לדחוף|лидхо́ф|толкать|פעל|דחפ|daily|push
לגעת|лага́ат|трогать|פעל|נגע|daily|touch
לפתור|лифто́р|решать задачу|פעל|פתר|study|solve
לחיות|лихьйо́т|жить|פעל|חיה|daily|live-life
לצמוח|лицמוֹах|расти / прорастать|פעל|צמח|daily|sprout
לנוח|ланוּах|отдыхать|פעל|נוח|daily|rest
לרעוב|лиръוֹв|голодать|פעל|רעב|food|be-hungry
לכאוב|лихъוֹв|болеть / причинять боль|פעל|כאב|daily|hurt
לשמוח|лисמוֹах|радоваться|פעל|שמח|daily|be-happy
לכעוס|лихъוֹс|злиться|פעל|כעס|daily|be-angry
לפחד|лифха́д|бояться|פעל|פחד|daily|fear
לגדל|легаде́ль|выращивать|פיעל|גדל|home|raise-grow
לארגן|леарге́н|организовывать|פיעל|ארגנ|daily|arrange
לחבר|лехабе́р|соединять|פיעל|חבר|study|join
לנתק|ленате́к|отключать|פיעל|נתק|home|disconnect
לחזק|лехазе́к|укреплять|פיעל|חזק|daily|strengthen
להרגיע|леhарги́а|успокаивать|הפעיל|רגע|communication|calm
להפתיע|леhафти́а|удивлять|הפעיל|פתע|communication|surprise
להשפיע|леhашпи́а|влиять|הפעיל|שפע|communication|influence
להשוות|леhашво́т|сравнивать|הפעיל|שוה|study|compare
להפוך|леhафо́х|превращать / переворачивать|הפעיל|הפכ|daily|turn-into
להפריע|леhафри́а|мешать|הפעיל|פרע|communication|disturb
להתראות|леhитрао́т|увидеться / прощаться|התפעל|ראה|communication|see-each-other
להתחבר|леhитхабе́р|подключаться / дружить|התפעל|חבר|communication|connect-self
להתנתק|леhитнате́к|отключаться|התפעל|נתק|daily|disconnect-self
להתחדש|леhитхаде́ש|обновляться|התפעל|חדש|daily|renew
להתחזק|леhитхазе́к|укрепляться|התפעל|חזק|daily|get-stronger
להתקרר|леhиткаре́р|охлаждаться / простужаться|התפעל|קרר|daily|cool-down
להתחמם|леhитхамэ́м|нагреваться|התפעל|חממ|daily|warm-up`;
const TARGET=150;
const fields=['infinitive_hebrew','transcription_ru','translation_ru','binyan','root','category','visualType'];
const candidates=RAW.trim().split('\n').map(line=>Object.fromEntries(line.split('|').map((value,index)=>[fields[index],value])));
function bounds(text){const anchor=text.indexOf('export const VERB_DROPS_SEED');if(anchor<0)throw new Error('VERB_DROPS_SEED not found');const start=text.indexOf('[',anchor);let depth=0,inString=false,quote='',esc=false;for(let i=start;i<text.length;i++){const ch=text[i];if(inString){if(esc)esc=false;else if(ch==='\\')esc=true;else if(ch===quote){inString=false;quote='';}continue;}if(ch==='"'||ch==="'"||ch==='`'){inString=true;quote=ch;continue;}if(ch==='[')depth++;if(ch===']'&&--depth===0)return{start,end:i};}throw new Error('VERB_DROPS_SEED end not found');}
function uniqVisual(base,used){let v=base,n=2;while(used.has(v))v=`${base}-${n++}`;used.add(v);return v;}
function format(card){return `  { id: "${card.id}", infinitive_hebrew: "${card.infinitive_hebrew}", transcription_ru: "${card.transcription_ru}", translation_ru: "${card.translation_ru}", binyan: "${card.binyan}", root: "${card.root}", category: "${card.category}", visualType: "${card.visualType}", frequencyRank: ${card.frequencyRank} },`;}
function renumber(text){let rank=1;return text.replace(/frequencyRank:\s*\d+/g,()=>`frequencyRank: ${rank++}`);}
const b=bounds(source);const block=source.slice(b.start+1,b.end);
const existing=new Set([...block.matchAll(/infinitive_hebrew:\s*"([^"]+)"/g)].map(m=>m[1]));
const visual=new Set([...block.matchAll(/visualType:\s*"([^"]+)"/g)].map(m=>m[1]));
const ids=[...block.matchAll(/id:\s*"vd-(\d+)"/g)].map(m=>Number(m[1]));const maxId=ids.length?Math.max(...ids):0;
const seen=new Set();const unique=candidates.filter(v=>!existing.has(v.infinitive_hebrew)&&!seen.has(v.infinitive_hebrew)&&(seen.add(v.infinitive_hebrew)||true));
if(unique.length<TARGET)throw new Error(`Only ${unique.length} unique new verbs; need ${TARGET}`);
const additions=unique.slice(0,TARGET).map((v,i)=>({id:`vd-${String(maxId+i+1).padStart(3,'0')}`,...v,visualType:uniqVisual(v.visualType,visual),frequencyRank:maxId+i+1}));
const counts=additions.reduce((a,v)=>(a[v.binyan]=(a[v.binyan]||0)+1,a),{});
for(const binyan of ['פעל','נפעל','פיעל','הפעיל','התפעל'])if(!counts[binyan])throw new Error(`No verbs for binyan ${binyan}`);
source=`${source.slice(0,b.end)}\n${additions.map(format).join('\n')}${source.slice(b.end)}`;
source=renumber(source);
fs.writeFileSync(file,source);
console.log(`[verb-drops add 150] added ${additions.length} verbs; binyan counts: ${JSON.stringify(counts)}`);
