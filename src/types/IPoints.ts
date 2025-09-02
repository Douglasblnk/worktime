export namespace IPoints {
  export interface Root {
    work_day: {
      id: number
      created_at: number
      updated_at: number
      date: string
      shift: Shift
      shift_day: Shiftday
      process_status: Processstatus
      time_cards: Timecards[]
      extra_time: number
      extra_time_50_percent: number
      extra_time_100_percent: number
      extra_time_150_percent: number
      extra_time_200_percent: number
      extra_time_factors: Extratimefactors
      overnight_extra_time_50_percent: number
      overnight_extra_time_100_percent: number
      overnight_extra_time_150_percent: number
      overnight_extra_time_200_percent: number
      simple_overnight_time: number
      total_time: number
      interval_time: number
      missing_time: number
      regular_time: number
      shift_time: number
      time_balance: number
      custom_totals: boolean
      custom_totals_changed_at: null
      custom_totals_changed_by: null
      cumulative_preference: null
      time_balance_enabled: boolean
      time_balance_middle_phases_extra_time: boolean
      overnight_enabled: boolean
      can_team_leader_edit_own_work_day: boolean
      extended_overnight_time: number
      time_registration_receipt_email_preference: boolean
      work_schedule_publication: null
      has_closing: null
      has_absences: null
      work_schedule: null
    }
  }
  
  export interface Extratimefactors {
    is_advanced_preference: boolean
    is_advanced_shift: boolean
    is_cumulative_extra_time: boolean
    is_custom_extra_time: boolean
    is_simple_extra_time: boolean
    factor1: Factor1
    factor2: Factor2
    factor3: Factor3
  }
  
  export interface Factor3 {
    percent: number
    limit: number
    time_balance: boolean
  }
  
  export interface Factor2 {
    percent: number
    limit: number
    time_balance: boolean
  }
  
  export interface Factor1 {
    percent: number
    limit: number
    time_balance: boolean
  }
  
  export interface Timecards {
    id: number
    date: string
    time: string
    register_type: Registertype
    source: Source
    receipt: string
    hash_code: string
    nsr: number
  }
  
  export interface Source {
    id: number
    name: string
  }
  
  export interface Registertype {
    id: number
    name: string
  }
  
  export interface Processstatus {
    id: number
    name: string
  }
  
  export interface Shiftday {
    id: number
    day_change_time: string
    extra_time_50_percent: string
    is_holiday: boolean
    week_day: Weekday
    week_index: number
    periods: Periods[]
  }
  
  export interface Periods {
    id: number
    enter_time: string
    leave_time: string
    main_interval_after: boolean
  }
  
  export interface Weekday {
    id: number
    name: string
  }
  
  export interface Shift {
    id: number
    name: string
    flexible: boolean
    without_holidays: boolean
    advanced: boolean
    cumulative_extra_time: boolean
    nr17: boolean
    work_schedule: boolean
  }
}