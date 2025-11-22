const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const { setUser } = require('../../service/auth');

describe('Auth Service - Unit Tests', () => {
  describe('setUser', () => {
    it('should generate a JWT token for a user', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser'
      };

      const token = setUser(user);

      expect(token).to.be.a('string');
      expect(token).to.not.be.empty;
    });

    it('should generate different tokens for different users', () => {
      const user1 = { id: 1, email: 'user1@example.com' };
      const user2 = { id: 2, email: 'user2@example.com' };

      const token1 = setUser(user1);
      const token2 = setUser(user2);

      expect(token1).to.not.equal(token2);
    });
  });

  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);

      expect(hashedPassword).to.be.a('string');
      expect(hashedPassword).to.not.equal(password);
    });

    it('should verify hashed password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isValid = await bcrypt.compare(password, hashedPassword);

      expect(isValid).to.be.true;
    });
  });
});

