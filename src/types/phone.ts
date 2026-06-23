export type PhoneNumberCountryKey = string | number | null | undefined
export type PhoneInputValue = string | PhoneCountry | { target?: unknown }

export interface PhoneCountry {
    name: string
    key: string
    countryCodes?: string[]
    isoCode2?: string
    isoCode3?: string
    iso2?: string
    iso3?: string
    flag?: string
    flag_url?: string
    phone_length?: number
    phone_lengths?: number[]
    phone_max_length?: number
    phoneLength?: number
    phoneLengths?: number[]
    phoneMaxLength?: number
    [key: string]: unknown
}

export interface PhoneDialCode {
    label?: string
    value?: string
    country?: string
    country_code?: string
    dial_code?: string
    countryCodes?: string[]
    isoCode2?: string
    isoCode3?: string
    [key: string]: unknown
}

export interface PhoneNumberSharedData {
    countries?: PhoneCountry[]
    dialCodes?: PhoneDialCode[]
}

export interface PhoneNumberOptions extends PhoneNumberSharedData {
    countryCode?: string
    phone?: string
}

export interface PhoneNumberHelpers {
    countryOptions: import('vue').ComputedRef<PhoneCountry[]>
    selectedCountry: import('vue').WritableComputedRef<PhoneCountry | undefined>
    mask: import('vue').ComputedRef<string>
    callingCode: import('vue').ComputedRef<string | null>
    localPhone: import('vue').Ref<string>
    isValid: import('vue').ComputedRef<boolean>
    handleInput: (value: PhoneInputValue) => boolean
}
