const { z } = require("zod");

const themes = [
  "green", "cyan", "yellow", "navy", "red", "purple", "turquoise",
  "brown", "magenta", "blue", "army", "gold", "orange",
];

const budgetDto = z.object({
  category: z.string().trim().min(1).max(50),
  maximum: z.coerce.number().finite().positive(),
  theme: z.enum(themes),
});

module.exports = { budgetDto };
