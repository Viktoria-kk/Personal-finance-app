const { z } = require("zod");

const themes = [
  "green", "cyan", "yellow", "navy", "red", "purple", "turquoise",
  "brown", "magenta", "blue", "army", "gold", "orange",
];

const potDto = z.object({
  name: z.string().trim().min(1).max(100),
  target: z.coerce.number().finite().positive(),
  theme: z.enum(themes),
});

const moneyDto = z.object({
  amount: z.coerce.number().finite().positive(),
});

module.exports = { potDto, moneyDto };
