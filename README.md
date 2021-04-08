# numeral-react

It is a very tiny component which is a replacement of HTML input element for post-editing format of number values.

ex. 1000000 -> 1,000,000

[![react-numeral-input](http://i.imgur.com/7eUVb7z.gif)](http://i.imgur.com/7eUVb7z.gif)

# Dependency

- React
- [Numeral.js](http://numeraljs.com/)

# Install

```shell
yarn add numeral numeral-react
```

# Usage

```jsx
<NumeralReact
  onChange={(event, value) => {
    console.info(value)
  }}
/>
```

# Options

You can set any original input props such as format and onChange. For example:

```jsx
<NumeralReact className="" placeholder="" format="0,0" onChange={onChange} />
```

- ### format: string

Default: "0,0"

It is passed to configure numeral format, You can find more information from [Numeral.js](http://numeraljs.com/).

- ### onChange: function(event: React.ChangeEvent<HTMLInputElement>, value: number)

Callback when value is changed, you will receieve unformated number (1000000 instead of 1,000,000).
