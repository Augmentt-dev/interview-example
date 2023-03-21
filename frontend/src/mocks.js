function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export const loginApi = async (values = {}) => {
  const { email, password } = values

  await delay(1500); // simulate request delay

  if (!email) {
    throw new Error("Email is required")
  } else if (!password) {
    throw new Error("Password is required")
  } else if (email !== "user@email.com" || password !== "123456") {
    throw new Error("Invalid credentials")
  }

  return { token: "bot683o6tbc3og2cby2i6" }
}