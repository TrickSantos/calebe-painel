import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'
import generatePicker from 'antd/es/date-picker/generatePicker'
import 'antd/es/date-picker/style/index'
import { PickerLocale } from 'antd/lib/date-picker/generatePicker'
import styled from 'styled-components'

const locale: PickerLocale = {
  lang: {
    locale: 'pt_BR',
    today: 'Hoje',
    now: 'Agora',
    backToToday: 'Voltar para hoje',
    ok: 'Ok',
    clear: 'Limpar',
    month: 'Mês',
    year: 'Ano',
    timeSelect: 'Selecionar hora',
    dateSelect: 'Selecionar data',
    monthSelect: 'Escolher mês',
    yearSelect: 'Escolher ano',
    decadeSelect: 'Escolher década',
    yearFormat: 'YYYY',
    dateFormat: 'D/M/YYYY',
    dayFormat: 'D',
    dateTimeFormat: 'D/M/YYYY HH:mm:ss',
    monthBeforeYear: false,
    previousMonth: 'Mês anterior (PageUp)',
    nextMonth: 'Próximo mês (PageDown)',
    previousYear: 'Ano anterior (Control + esquerda)',
    nextYear: 'Próximo ano (Control + direita)',
    previousDecade: 'Década anterior',
    nextDecade: 'Próxima década',
    previousCentury: 'Século anterior',
    nextCentury: 'Próximo século',
    placeholder: 'Selecionar data',
    rangePlaceholder: ['Data inicial', 'Data final'],
    shortWeekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  },
  timePickerLocale: {
    placeholder: 'Hora'
  }
}

const Picker = generatePicker<Date>(dateFnsGenerateConfig)

const DatePicker = styled(Picker).attrs(() => ({
  locale: locale,
  picker: 'date',
  format: 'dd/MM/yyyy',
  size: 'large'
}))``

export default DatePicker
