import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import duration from "dayjs/plugin/duration.js";
import objectSupport from 'dayjs/plugin/objectSupport'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.locale(ptBR)
dayjs.extend(duration);
dayjs.extend(objectSupport)
dayjs.extend(customParseFormat)

export default dayjs