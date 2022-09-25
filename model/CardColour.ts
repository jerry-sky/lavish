let cardColour: {
  Red: 'Red',
  Green: 'Green',
  Blue: 'Blue',
  Black: 'Black',
  White: 'White'
};

export type CardColour = (typeof cardColour)[keyof typeof cardColour]
