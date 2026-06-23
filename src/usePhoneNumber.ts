import { computed, ref, unref } from 'vue'
import type { Ref } from 'vue'
import { phoneNumberData } from './data/phone'
import {
  callingCodeForCountry,
  findPhoneCountry,
  localPhoneDigitsForCountry,
  phoneMaskForCountry,
  phoneLengthsForCountry
} from './types/helpers'
import type {
  PhoneCountry,
  PhoneInputValue,
  PhoneNumberHelpers,
  PhoneNumberOptions
} from './types/phone'

export function usePhoneNumber(
  source: PhoneNumberOptions | Ref<PhoneNumberOptions | undefined> = phoneNumberData
): PhoneNumberHelpers {
  const sourceValue = unref(source) ?? {}
  const countries = computed(() => unref(source)?.countries ?? phoneNumberData.countries ?? [])
  const selectedCountryKey = ref(sourceValue.countryCode ?? 'IN')
  const localPhone = ref(
    localPhoneDigitsForCountry(countries.value, selectedCountryKey.value, sourceValue.phone ?? '')
  )

  const selectedCountry = computed({
    get: () => findPhoneCountry(countries.value, selectedCountryKey.value),
    set: (country) => {
      updateCountry(country ?? '')
    }
  })
  const selectedPhoneLengths = computed(() =>
    phoneLengthsForCountry(countries.value, selectedCountryKey.value)
  )
  const callingCode = computed(() =>
    callingCodeForCountry(countries.value, selectedCountryKey.value)
  )
  const mask = computed(() => phoneMaskForCountry(countries.value, selectedCountryKey.value))
  const isValid = computed(
    () =>
      localPhone.value.length > 0 && selectedPhoneLengths.value.includes(localPhone.value.length)
  )

  const updatePhone = (value: PhoneInputValue): boolean => {
    const eventTarget = targetFromInput(value)
    const nextPhone = localPhoneDigitsForCountry(
      countries.value,
      selectedCountryKey.value,
      valueFromInput(value)
    )
    const nextIsValid =
      nextPhone.length > 0 && selectedPhoneLengths.value.includes(nextPhone.length)

    localPhone.value = nextPhone

    if (eventTarget) {
      eventTarget.value = nextPhone
    }

    return nextIsValid
  }

  const updateCountry = (value: PhoneInputValue): void => {
    selectedCountryKey.value = valueFromInput(value)
    updatePhone(localPhone.value)
  }

  return {
    countryOptions: countries,
    selectedCountry,
    mask,
    callingCode,
    localPhone,
    isValid,
    handleInput: updatePhone
  }
}

function valueFromInput(value: PhoneInputValue): string {
  if (typeof value === 'string') return value

  if (isPhoneCountry(value)) {
    return String(value.isoCode2 ?? value.iso2 ?? value.key ?? value.name)
  }

  return String(targetFromInput(value)?.value ?? '')
}

function targetFromInput(value: PhoneInputValue): HTMLInputElement | null {
  if (typeof value === 'string' || isPhoneCountry(value)) return null

  const target = value.target as HTMLInputElement | null | undefined

  return target ?? null
}

function isPhoneCountry(value: PhoneInputValue): value is PhoneCountry {
  return typeof value === 'object' && value !== null && ('key' in value || 'isoCode2' in value)
}
