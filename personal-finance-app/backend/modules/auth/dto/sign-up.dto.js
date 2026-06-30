const { default: z } = require("zod");

const signUpDto = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8, "password must be at least 8 char"),
});

module.exports = { signUpDto };
