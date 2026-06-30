# @erag/phone-number-vue

Vue composable for building country-aware phone number fields without writing phone parsing logic from scratch. It manages selected country state, local digit cleanup, max-length handling, calling codes, masks, and basic phone length validation for custom Vue forms.

## Key Features

- 🌍 Country-aware phone input state.
- 🔢 Local digit normalization and max-length truncation.
- ✅ Validation based on selected country phone lengths.
- 🎭 Mask pattern output without a masking dependency.
- 📞 Calling code output for the selected country.
- 🧩 Headless composable that works with any UI.
- 📦 Built-in country and dial-code metadata.
- 🛡️ Fully typed TypeScript support.

## Installation

```bash
npm install @erag/phone-number-vue
```

## Usage

```vue
<script setup lang="ts">
import { usePhoneNumber } from '@erag/phone-number-vue'

const { selectedCountry, countryOptions, mask, handleInput, localPhone, callingCode, isValid } =
    usePhoneNumber()
</script>

<template>
    <div>
        <select v-model="selectedCountry">
            <option
                v-for="country in countryOptions"
                :key="country.isoCode2 ?? country.key"
                :value="country"
            >
                {{ country.isoCode2 }} - {{ country.name }}
            </option>
        </select>

        <input
            v-model="localPhone"
            @input="handleInput"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            inputmode="numeric"
            placeholder="Enter phone number"
        />

        <small>{{ callingCode }}</small>
        <small>{{ mask }}</small>
        <small>{{ isValid ? 'Valid phone number' : 'Enter a valid phone number' }}</small>
    </div>
</template>
```

Pass custom data or a Vue ref when you want to override the bundled static data:

```ts
import { ref } from 'vue'
import { usePhoneNumber, type PhoneNumberSharedData } from '@erag/phone-number-vue'

const customData = ref<PhoneNumberSharedData>({
    countries: [],
    dialCodes: []
})

const phone = usePhoneNumber(customData)
```

## API

`usePhoneNumber(dataOrRef)` returns:

| Name              | Type                                             | Description                                                                                               |
| ----------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `selectedCountry` | `WritableComputedRef<PhoneCountry \| undefined>` | Selected country object for object-based selects.                                                         |
| `countryOptions`  | `ComputedRef<PhoneCountry[]>`                    | Country list for select components.                                                                       |
| `mask`            | `ComputedRef<string>`                            | Mask pattern for the selected country.                                                                    |
| `handleInput`     | `(valueOrEvent: PhoneInputValue) => boolean`     | Updates local digits or selected country, truncates by country length, and returns the validation result. |
| `localPhone`      | `Ref<string>`                                    | Normalized local phone digits, truncated to the selected country's max length.                            |
| `callingCode`     | `ComputedRef<string \| null>`                    | Calling code for the selected country, for example `+91`.                                                 |
| `isValid`         | `ComputedRef<boolean>`                           | Phone validation result for the selected country.                                                         |

For example, India (`IN`) allows 10 local digits. Extra digits are removed automatically while typing.

## Data Shape

```ts
type PhoneNumberSharedData = {
    countries?: PhoneCountry[]
    dialCodes?: PhoneDialCode[]
}
```

The package also exports the bundled data directly:

```ts
import { countries, dialCodes, phoneNumberData } from '@erag/phone-number-vue'
```

Country records can use either snake_case or camelCase phone length fields:

```ts
{
  name: 'United States',
  key: 'us',
  isoCode2: 'US',
  countryCodes: ['1'],
  phone_lengths: [10],
}
```

## Scripts

- `npm run build`: build ESM output with Vite 8 and TypeScript declarations.
- `npm run type-check`: run TypeScript without emitting files.
- `npm run lint`: format source files with Prettier.
- `npm run lint:check`: verify source formatting.

## License

MIT
