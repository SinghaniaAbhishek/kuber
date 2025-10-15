import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { Settings } from '../models/FinanceModels.js';

const TOKEN_TTL = '7d';

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: { message: 'Missing fields' } });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: { message: 'Email already in use' } });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    // default settings
    await Settings.create({ userId: user._id, theme: 'dreamy', currency: 'INR', monthlyBudget: 25000 });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('name email');
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (e) {
    next(e);
  }
}

