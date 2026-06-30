const { default: z } = require("zod");

const signInDto = z.object({
  email: z.email("Wrong email provided"),
  password: z
    .string("password is required")
    .min(8, "password must be at least 8 char"),
});

module.exports = { signInDto };
