import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const comparePasswords = async (
  password: string,
  storedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, storedPassword);
};

export { hashPassword, comparePasswords };
